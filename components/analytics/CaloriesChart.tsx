"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

interface DayData {
  day: string;
  calories: number;
}

export default function CaloriesChart() {
  const [chartData, setChartData] = useState<DayData[]>([]);

  useEffect(() => {
    loadChart();
  }, []);

  async function loadChart() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const { data: logs, error } = await supabase
      .from("meal_logs")
      .select(`
        created_at,
        meal_items(
          calories
        )
      `)
      .eq("user_id", user.id)
      .gte("created_at", start.toISOString());

    if (error || !logs) return;

    const totals: Record<string, number> = {};

    logs.forEach((meal: any) => {
      const date = new Date(meal.created_at).toLocaleDateString("en-US", {
        weekday: "short",
      });

      if (!totals[date]) totals[date] = 0;

      meal.meal_items?.forEach((item: any) => {
        totals[date] += item.calories || 0;
      });
    });

    const last7: DayData[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const label = d.toLocaleDateString("en-US", {
        weekday: "short",
      });

      last7.push({
        day: label,
        calories: totals[label] || 0,
      });
    }

    setChartData(last7);
  }

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg">

      <h2 className="mb-6 text-2xl font-bold text-white">
        Calories - Last 7 Days
      </h2>

      <div className="relative h-[350px] w-full">

        <Line
          data={{
            labels: chartData.map((d) => d.day),
            datasets: [
              {
                label: "Calories",
                data: chartData.map((d) => d.calories),
                borderColor: "#10b981",
                backgroundColor: "rgba(16,185,129,0.15)",
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,

            resizeDelay: 200,

            interaction: {
              mode: "index",
              intersect: false,
            },

            animation: {
              duration: 500,
            },

            plugins: {
              legend: {
                labels: {
                  color: "#ffffff",
                },
              },
            },

            scales: {
              x: {
                ticks: {
                  color: "#a1a1aa",
                },
                grid: {
                  color: "#27272a",
                },
              },

              y: {
                beginAtZero: true,
                ticks: {
                  color: "#a1a1aa",
                },
                grid: {
                  color: "#27272a",
                },
              },
            },
          }}
        />

      </div>

    </div>
  );
}
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
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface WeightLog {
  weight_kg: number;
  created_at: string;
}

export default function WeightChart() {
  const [logs, setLogs] = useState<WeightLog[]>([]);

  useEffect(() => {
    loadWeights();
  }, []);

  async function loadWeights() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("weight_logs")
      .select("weight_kg,created_at")
      .eq("user_id", user.id)
      .order("created_at");

    setLogs(data || []);
  }

  const chartData = {
    labels: logs.map((log) =>
      new Date(log.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    ),

    datasets: [
      {
        label: "Weight (kg)",
        data: logs.map((log) => log.weight_kg),
        borderColor: "#10b981",
        backgroundColor: "#10b981",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: "white",
        },

        grid: {
          color: "#27272a",
        },
      },

      y: {
        ticks: {
          color: "white",
        },

        grid: {
          color: "#27272a",
        },
      },
    },
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg">

      <h2 className="mb-6 text-2xl font-bold text-white">
        📈 Weight Trend
      </h2>

      {logs.length === 0 ? (
        <p className="text-zinc-400">
          No weight history available.
        </p>
      ) : (
        <Line
          data={chartData}
          options={options}
        />
      )}

    </section>
  );
}
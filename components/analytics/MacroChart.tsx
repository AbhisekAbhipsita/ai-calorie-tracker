"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function MacroChart() {
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);

  useEffect(() => {
    loadMacros();
  }, []);

  async function loadMacros() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("meal_logs")
      .select(`
        meal_items(
          protein,
          carbs,
          fat
        )
      `)
      .eq("user_id", user.id)
      .gte("created_at", start.toISOString());

    if (error || !data) return;

    let p = 0;
    let c = 0;
    let f = 0;

    data.forEach((meal: any) => {
      meal.meal_items?.forEach((item: any) => {
        p += Number(item.protein || 0);
        c += Number(item.carbs || 0);
        f += Number(item.fat || 0);
      });
    });

    setProtein(p);
    setCarbs(c);
    setFat(f);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg h-[420px]">

      <h2 className="mb-6 text-2xl font-bold text-white">
        Macro Distribution
      </h2>

      <Pie
        data={{
          labels: [
            "Protein",
            "Carbs",
            "Fat",
          ],
          datasets: [
            {
              data: [
                protein,
                carbs,
                fat,
              ],
              backgroundColor: [
                "#10b981",
                "#3b82f6",
                "#f59e0b",
              ],
              borderWidth: 2,
              borderColor: "#18181b",
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "white",
                padding: 20,
              },
            },
          },
        }}
      />

    </div>
  );
}
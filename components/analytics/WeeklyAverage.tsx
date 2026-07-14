"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BarChart3 } from "lucide-react";

interface AverageData {
  calories: number;
  protein: number;
}

export default function WeeklyAverage() {
  const [average, setAverage] = useState<AverageData>({
    calories: 0,
    protein: 0,
  });

  useEffect(() => {
    loadAverage();
  }, []);

  async function loadAverage() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const { data: meals } = await supabase
      .from("meal_logs")
      .select(`
        meal_items(
          calories,
          protein
        )
      `)
      .eq("user_id", user.id)
      .gte("created_at", start.toISOString());

    if (!meals) return;

    let calories = 0;
    let protein = 0;

    meals.forEach((meal: any) => {
      meal.meal_items?.forEach((item: any) => {
        calories += item.calories || 0;
        protein += Number(item.protein || 0);
      });
    });

    setAverage({
      calories: Math.round(calories / 7),
      protein: Number((protein / 7).toFixed(1)),
    });
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg">

      <div className="flex items-center gap-3">

        <div className="rounded-2xl bg-cyan-500/20 p-3">
          <BarChart3 className="text-cyan-400" size={26} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Weekly Average
          </h2>

          <p className="text-zinc-400">
            Average nutrition over the last 7 days
          </p>
        </div>

      </div>

      <div className="mt-10 grid grid-cols-2 gap-6">

        <div className="rounded-2xl bg-zinc-800 p-6">

          <p className="text-zinc-400">
            Calories / Day
          </p>

          <h1 className="mt-2 text-4xl font-bold text-orange-400">
            {average.calories}
          </h1>

          <p className="mt-2 text-zinc-500">
            kcal
          </p>

        </div>

        <div className="rounded-2xl bg-zinc-800 p-6">

          <p className="text-zinc-400">
            Protein / Day
          </p>

          <h1 className="mt-2 text-4xl font-bold text-emerald-400">
            {average.protein}
          </h1>

          <p className="mt-2 text-zinc-500">
            grams
          </p>

        </div>

      </div>

    </div>
  );
}
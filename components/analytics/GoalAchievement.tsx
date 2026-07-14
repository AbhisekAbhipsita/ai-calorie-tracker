"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Target } from "lucide-react";

interface GoalData {
  calorieGoal: number;
  proteinGoal: number;
  calories: number;
  protein: number;
}

export default function GoalAchievement() {
  const [data, setData] = useState<GoalData>({
    calorieGoal: 2000,
    proteinGoal: 120,
    calories: 0,
    protein: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Get Profile Goals
    const { data: profile } = await supabase
      .from("profiles")
      .select("calorie_goal, protein_goal")
      .eq("id", user.id)
      .single();

    const calorieGoal = profile?.calorie_goal ?? 2000;
    const proteinGoal = profile?.protein_goal ?? 120;

    // Today's Meals
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: meals } = await supabase
      .from("meal_logs")
      .select(`
        meal_items(
          calories,
          protein
        )
      `)
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    let calories = 0;
    let protein = 0;

    meals?.forEach((meal: any) => {
      meal.meal_items?.forEach((item: any) => {
        calories += item.calories || 0;
        protein += Number(item.protein || 0);
      });
    });

    setData({
      calorieGoal,
      proteinGoal,
      calories,
      protein,
    });
  }

  const caloriePercent = Math.min(
    (data.calories / data.calorieGoal) * 100,
    100
  );

  const proteinPercent = Math.min(
    (data.protein / data.proteinGoal) * 100,
    100
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg">

      <div className="flex items-center gap-3 mb-6">
        <Target className="text-emerald-400" size={28} />
        <h2 className="text-2xl font-bold text-white">
          Goal Achievement
        </h2>
      </div>

      {/* Calories */}
      <div className="mb-8">
        <div className="flex justify-between text-white mb-2">
          <span>Calories</span>

          <span>
            {data.calories} / {data.calorieGoal}
          </span>
        </div>

        <div className="h-3 rounded-full bg-zinc-700">
          <div
            className="h-3 rounded-full bg-orange-500"
            style={{ width: `${caloriePercent}%` }}
          />
        </div>

        <p className="mt-2 text-sm text-zinc-400">
          {data.calories >= data.calorieGoal
            ? "✅ Daily calorie target achieved"
            : `${data.calorieGoal - data.calories} kcal remaining`}
        </p>
      </div>

      {/* Protein */}
      <div>
        <div className="flex justify-between text-white mb-2">
          <span>Protein</span>

          <span>
            {data.protein.toFixed(1)} / {data.proteinGoal} g
          </span>
        </div>

        <div className="h-3 rounded-full bg-zinc-700">
          <div
            className="h-3 rounded-full bg-emerald-500"
            style={{ width: `${proteinPercent}%` }}
          />
        </div>

        <p className="mt-2 text-sm text-zinc-400">
          {data.protein >= data.proteinGoal
            ? "💪 Protein goal achieved"
            : `${(data.proteinGoal - data.protein).toFixed(1)} g remaining`}
        </p>
      </div>

    </div>
  );
}
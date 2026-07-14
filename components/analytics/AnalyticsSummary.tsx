"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Flame,
  Beef,
  UtensilsCrossed,
  Activity,
} from "lucide-react";

interface AnalyticsData {
  calories: number;
  protein: number;
  meals: number;
  averageCalories: number;
}

export default function AnalyticsSummary() {
  const [data, setData] = useState<AnalyticsData>({
    calories: 0,
    protein: 0,
    meals: 0,
    averageCalories: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Last 7 Days
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const { data: logs, error } = await supabase
      .from("meal_logs")
      .select(
        `
        id,
        created_at,
        meal_items (
          calories,
          protein
        )
      `
      )
      .eq("user_id", user.id)
      .gte("created_at", start.toISOString());

    if (error || !logs) return;

    let calories = 0;
    let protein = 0;

    logs.forEach((meal: any) => {
      meal.meal_items?.forEach((item: any) => {
        calories += item.calories || 0;
        protein += Number(item.protein || 0);
      });
    });

    setData({
      calories,
      protein,
      meals: logs.length,
      averageCalories: Math.round(calories / 7),
    });
  }

  const cards = [
    {
      title: "Calories This Week",
      value: `${data.calories} kcal`,
      icon: Flame,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Protein This Week",
      value: `${data.protein.toFixed(1)} g`,
      icon: Beef,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Meals Logged",
      value: data.meals,
      icon: UtensilsCrossed,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Avg Calories / Day",
      value: `${data.averageCalories} kcal`,
      icon: Activity,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg"
          >
            <div
              className={`inline-flex rounded-2xl bg-gradient-to-r ${card.color} p-4`}
            >
              <Icon className="text-white" size={26} />
            </div>

            <p className="mt-5 text-sm text-zinc-400">
              {card.title}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              {card.value}
            </h2>
          </div>
        );
      })}
    </div>
  );
}
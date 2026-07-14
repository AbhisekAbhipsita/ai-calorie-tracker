"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Flame, Beef, UtensilsCrossed, CalendarDays } from "lucide-react";

interface Summary {
  meals: number;
  calories: number;
  protein: number;
  days: number;
}

export default function HistorySummary() {
  const [summary, setSummary] = useState<Summary>({
    meals: 0,
    calories: 0,
    protein: 0,
    days: 0,
  });

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("meal_logs")
      .select(`
        id,
        created_at,
        meal_items(
          calories,
          protein
        )
      `)
      .eq("user_id", user.id);

    if (!data) return;

    let calories = 0;
    let protein = 0;

    const uniqueDays = new Set<string>();

    data.forEach((meal: any) => {
      uniqueDays.add(meal.created_at.substring(0, 10));

      meal.meal_items?.forEach((item: any) => {
        calories += item.calories || 0;
        protein += Number(item.protein || 0);
      });
    });

    setSummary({
      meals: data.length,
      calories,
      protein: Number(protein.toFixed(1)),
      days: uniqueDays.size,
    });
  }

  const cards = [
    {
      title: "Meals",
      value: summary.meals,
      icon: UtensilsCrossed,
      color: "text-blue-400",
    },
    {
      title: "Calories",
      value: summary.calories,
      suffix: "kcal",
      icon: Flame,
      color: "text-orange-400",
    },
    {
      title: "Protein",
      value: summary.protein,
      suffix: "g",
      icon: Beef,
      color: "text-emerald-400",
    },
    {
      title: "Days Logged",
      value: summary.days,
      icon: CalendarDays,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg"
          >
            <Icon className={card.color} size={32} />

            <p className="mt-4 text-zinc-400">
              {card.title}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              {card.value} {card.suffix}
            </h2>
          </div>
        );
      })}

    </div>
  );
}
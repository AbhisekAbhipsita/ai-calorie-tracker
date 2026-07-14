"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Flame } from "lucide-react";

export default function ProteinStreak() {
  const [streak, setStreak] = useState(0);
  const [goal, setGoal] = useState(120);

  useEffect(() => {
    loadStreak();
  }, []);

  async function loadStreak() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Get protein goal
    const { data: profile } = await supabase
      .from("profiles")
      .select("protein_goal")
      .eq("id", user.id)
      .single();

    const proteinGoal = profile?.protein_goal ?? 120;
    setGoal(proteinGoal);

    // Last 30 days meals
    const start = new Date();
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);

    const { data: logs } = await supabase
      .from("meal_logs")
      .select(`
        created_at,
        meal_items(
          protein
        )
      `)
      .eq("user_id", user.id)
      .gte("created_at", start.toISOString())
      .order("created_at", { ascending: false });

    if (!logs) return;

    const totals: Record<string, number> = {};

    logs.forEach((meal: any) => {
      const day = meal.created_at.substring(0, 10);

      if (!totals[day]) totals[day] = 0;

      meal.meal_items?.forEach((item: any) => {
        totals[day] += Number(item.protein || 0);
      });
    });

    let currentStreak = 0;

    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const key = d.toISOString().split("T")[0];

      if ((totals[key] || 0) >= proteinGoal) {
        currentStreak++;
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg">

      <div className="flex items-center gap-3">

        <div className="rounded-2xl bg-orange-500/20 p-3">
          <Flame className="text-orange-400" size={28} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Protein Streak
          </h2>

          <p className="text-zinc-400">
            Consecutive days hitting your protein goal
          </p>
        </div>

      </div>

      <div className="mt-10 text-center">

        <h1 className="text-6xl font-bold text-orange-400">
          {streak}
        </h1>

        <p className="mt-3 text-xl text-white">
          Day{streak !== 1 ? "s" : ""}
        </p>

        <p className="mt-4 text-zinc-400">
          Goal: {goal} g protein/day
        </p>

      </div>

    </div>
  );
}
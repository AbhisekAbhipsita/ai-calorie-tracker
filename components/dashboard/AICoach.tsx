"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Sparkles, Loader2 } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";

export default function AICoach() {
  const { refresh } = useDashboard();

  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    loadAdvice();
  }, [refresh]);

  async function loadAdvice() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // Get user goals
    const { data: profile } = await supabase
      .from("profiles")
      .select("calorie_goal, protein_goal")
      .eq("id", user.id)
      .single();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's meals
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

    try {
      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calories,
          protein,
          goalCalories: profile?.calorie_goal || 2000,
          goalProtein: profile?.protein_goal || 120,
        }),
      });

      const data = await response.json();

      setAdvice(data.advice);

    } catch (err) {
      setAdvice("Unable to generate AI advice.");
    }

    setLoading(false);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-8">

      <div className="flex items-center gap-3">

        <Sparkles
          className="text-emerald-400"
          size={28}
        />

        <div>

          <h2 className="text-2xl font-bold text-white">
            AI Nutrition Coach
          </h2>

          <p className="text-zinc-400">
            Personalized recommendations based on today's meals
          </p>

        </div>

      </div>

      {loading ? (

        <div className="mt-8 flex items-center gap-3 text-zinc-300">

          <Loader2 className="animate-spin" />

          Generating nutrition advice...

        </div>

      ) : (

        <div className="mt-8 whitespace-pre-wrap rounded-2xl bg-zinc-950 p-6 leading-8 text-zinc-300">

          {advice}

        </div>

      )}

    </section>
  );
}
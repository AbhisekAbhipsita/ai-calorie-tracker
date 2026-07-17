"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Stats {
  currentWeight: number;
  goalWeight: number;
  startWeight: number;
}

export default function WeightStats() {
  const [stats, setStats] = useState<Stats>({
    currentWeight: 0,
    goalWeight: 0,
    startWeight: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Load profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("weight, goal_weight")
      .eq("id", user.id)
      .single();

    // Load latest weight
    const { data: latestWeight } = await supabase
      .from("weight_logs")
      .select("weight_kg")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .limit(1)
      .single();

    // Load first recorded weight
    const { data: firstWeight } = await supabase
      .from("weight_logs")
      .select("weight_kg")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: true })
      .limit(1)
      .single();

    setStats({
      currentWeight:
        Number(latestWeight?.weight_kg) ||
        Number(profile?.weight) ||
        0,

      goalWeight: Number(profile?.goal_weight) || 0,

      startWeight:
        Number(firstWeight?.weight_kg) ||
        Number(profile?.weight) ||
        0,
    });
  }

  const remaining =
    stats.goalWeight > 0
      ? Math.max(stats.currentWeight - stats.goalWeight, 0)
      : 0;

  const lost = Math.max(
    stats.startWeight - stats.currentWeight,
    0
  );

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      {/* Current Weight */}
      <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg">
        <p className="text-sm text-zinc-400">
          Current Weight
        </p>

        <h2 className="mt-3 text-4xl font-bold text-white">
          {stats.currentWeight || "--"}
        </h2>

        <p className="mt-1 text-zinc-500">
          kg
        </p>
      </div>

      {/* Goal Weight */}
      <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg">
        <p className="text-sm text-zinc-400">
          Goal Weight
        </p>

        <h2 className="mt-3 text-4xl font-bold text-emerald-400">
          {stats.goalWeight || "--"}
        </h2>

        <p className="mt-1 text-zinc-500">
          kg
        </p>
      </div>

      {/* Remaining */}
      <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg">
        <p className="text-sm text-zinc-400">
          Remaining
        </p>

        <h2 className="mt-3 text-4xl font-bold text-orange-400">
          {remaining.toFixed(1)}
        </h2>

        <p className="mt-1 text-zinc-500">
          kg
        </p>
      </div>

      {/* Progress */}
      <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg">
        <p className="text-sm text-zinc-400">
          Weight Lost
        </p>

        <h2 className="mt-3 text-4xl font-bold text-cyan-400">
          {lost.toFixed(1)}
        </h2>

        <p className="mt-1 text-zinc-500">
          kg
        </p>
      </div>

    </section>
  );
}
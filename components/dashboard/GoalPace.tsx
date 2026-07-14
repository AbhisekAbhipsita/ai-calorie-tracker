"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Flag, Calendar, TrendingDown } from "lucide-react";

interface GoalPaceData {
  currentWeight: number;
  goalWeight: number;
  targetDate: string;
}

export default function GoalPace() {
  const [data, setData] = useState<GoalPaceData>({
    currentWeight: 0,
    goalWeight: 0,
    targetDate: "",
  });

  useEffect(() => {
    loadGoalPace();
  }, []);

  async function loadGoalPace() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Load goal details
const { data: profile } = await supabase
  .from("profiles")
  .select("goal_weight, target_date")
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

setData({
  currentWeight: Number(latestWeight?.weight_kg || 0),
  goalWeight: Number(profile?.goal_weight || 0),
  targetDate: profile?.target_date || "",
});
  }

  const remaining = Math.max(
    data.currentWeight - data.goalWeight,
    0
  );

  const today = new Date();

  const target =
    data.targetDate !== ""
      ? new Date(data.targetDate)
      : today;

  const diffDays = Math.max(
    Math.ceil(
      (target.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    ),
    0
  );

  const weeksLeft = Math.max(diffDays / 7, 0.1);

  const requiredPace = remaining / weeksLeft;

  const onTrack = requiredPace <= 1;

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg">

      <div className="flex items-center gap-3">

        <div className="rounded-2xl bg-purple-500/20 p-3">
          <Flag className="text-purple-400" />
        </div>

        <div>

          <h2 className="text-2xl font-bold text-white">
            Goal Pace
          </h2>

          <p className="text-sm text-zinc-400">
            Track your weight-loss journey
          </p>

        </div>

      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl bg-zinc-800 p-5">

          <p className="text-sm text-zinc-400">
            Current Weight
          </p>

          <h3 className="mt-2 text-3xl font-bold text-white">
            {data.currentWeight} kg
          </h3>

        </div>

        <div className="rounded-2xl bg-zinc-800 p-5">

          <p className="text-sm text-zinc-400">
            Goal Weight
          </p>

          <h3 className="mt-2 text-3xl font-bold text-emerald-400">
            {data.goalWeight} kg
          </h3>

        </div>

        <div className="rounded-2xl bg-zinc-800 p-5">

          <p className="text-sm text-zinc-400">
            Remaining
          </p>

          <h3 className="mt-2 text-3xl font-bold text-orange-400">
            {remaining.toFixed(1)} kg
          </h3>

        </div>

      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        <div className="rounded-2xl bg-zinc-800 p-5">

          <div className="flex items-center gap-2">

            <Calendar
              size={18}
              className="text-blue-400"
            />

            <span className="text-zinc-300">
              Weeks Left
            </span>

          </div>

          <h3 className="mt-3 text-3xl font-bold text-white">
            {weeksLeft.toFixed(1)}
          </h3>

        </div>

        <div className="rounded-2xl bg-zinc-800 p-5">

          <div className="flex items-center gap-2">

            <TrendingDown
              size={18}
              className="text-emerald-400"
            />

            <span className="text-zinc-300">
              Required Pace
            </span>

          </div>

          <h3 className="mt-3 text-3xl font-bold text-white">
            {requiredPace.toFixed(2)} kg/week
          </h3>

        </div>

      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-800 p-5">

        <p className="text-lg font-semibold text-white">
          Status
        </p>

        <div className="mt-3">

          {onTrack ? (
            <span className="rounded-full bg-emerald-500/20 px-4 py-2 font-semibold text-emerald-400">
              🟢 On Track
            </span>
          ) : (
            <span className="rounded-full bg-red-500/20 px-4 py-2 font-semibold text-red-400">
              🔴 Behind Schedule
            </span>
          )}

        </div>

      </div>

    </section>
  );
}
"use client";

import WeightStats from "../../components/weight/WeightStats";
import WeightTracker from "../../components/dashboard/WeightTracker";
import WeightHistory from "../../components/history/WeightHistory";
import GoalPace from "../../components/dashboard/GoalPace";
import BMICard from "../../components/weight/BMICard";

export default function WeightPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-4 md:p-8">

      <div className="mx-auto max-w-7xl space-y-8">

        <div>

          <h1 className="text-4xl font-bold text-white">
            Weight Management
          </h1>

          <p className="mt-2 text-zinc-400">
            Track your body weight, BMI and goal progress.
          </p>

        </div>

        <WeightStats />

        <WeightTracker />

        <WeightHistory />

        <div className="grid gap-8 lg:grid-cols-2">

          <GoalPace />

          <BMICard />

        </div>

      </div>

    </main>
  );
}
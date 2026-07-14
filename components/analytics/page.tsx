"use client";

import CaloriesChart from "./CaloriesChart";

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8">

      <h1 className="mb-8 text-4xl font-bold text-white">
        Nutrition Analytics
      </h1>

      <CaloriesChart />

    </main>
  );
}
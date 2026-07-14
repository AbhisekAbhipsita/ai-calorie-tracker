"use client";

import CaloriesChart from "@/components/analytics/CaloriesChart";

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-zinc-950 p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl">

        <h1 className="mb-8 text-4xl font-bold text-white">
          Nutrition Analytics
        </h1>

        <CaloriesChart />

      </div>
    </main>
  );
}
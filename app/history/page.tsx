"use client";

import HistorySummary from "@/components/history/HistorySummary";
import MealHistory from "@/components/history/MealHistory";
import WeightHistory from "@/components/history/WeightHistory";


export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8">
      <h1 className="mb-8 text-4xl font-bold text-white">
        Meal History
      </h1>

      <HistorySummary />

      <MealHistory />

      <WeightHistory />
    </main>
  );
}
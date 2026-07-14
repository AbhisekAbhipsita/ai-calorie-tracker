import MealHistory from "@/components/history/MealHistory";
import HistorySummary from "@/components/history/HistorySummary";


export default function HistoryPage() {
  return (
    <main className="space-y-8 p-4 md:p-8">

      <div>

        <h1 className="text-4xl font-bold text-white">
          Meal History
        </h1>

        <p className="mt-2 text-zinc-400">
          Browse and search all your previous meal logs.
        </p>

      </div>
      <HistorySummary />

      <MealHistory />

    </main>
  );
}
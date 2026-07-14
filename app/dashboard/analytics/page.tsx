import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import CaloriesChart from "@/components/analytics/CaloriesChart";
import ProteinChart from "@/components/analytics/ProteinChart";
import MacroChart from "@/components/analytics/MacroChart";
import GoalAchievement from "@/components/analytics/GoalAchievement";
import ProteinStreak from "@/components/analytics/ProteinStreak";
import WeeklyAverage from "@/components/analytics/WeeklyAverage";



export default function AnalyticsPage() {
  return (
    <main className="space-y-8 p-4 md:p-8">

      <h1 className="text-4xl font-bold text-white">
        Analytics
      </h1>

      <AnalyticsSummary />

      <div className="grid gap-8 lg:grid-cols-2">

        <CaloriesChart />

        <ProteinChart />


      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        <MacroChart />

        <GoalAchievement />

        <ProteinStreak />

        <WeeklyAverage />

        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 flex items-center justify-center">
          <p className="text-zinc-400">
            Goal Achievement (Coming Next)
          </p>
        </div>

      </div>

    </main>
  );
}
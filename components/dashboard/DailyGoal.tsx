"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/contexts/DashboardContext";

export default function DailyGoal() {
  const { refresh } = useDashboard();

  const [calories, setCalories] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);

  useEffect(() => {
    loadCalories();
  }, [refresh]);

  async function loadCalories() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Load user's calorie goal
    const { data: profile } = await supabase
      .from("profiles")
      .select("calorie_goal")
      .eq("id", user.id)
      .single();

    if (profile?.calorie_goal) {
      setDailyGoal(profile.calorie_goal);
    }

    // Today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Load today's meals
    const { data: meals } = await supabase
      .from("meal_logs")
      .select(
        `
        meal_items(
          calories
        )
      `
      )
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    let totalCalories = 0;

    meals?.forEach((meal: any) => {
      meal.meal_items?.forEach((item: any) => {
        totalCalories += item.calories || 0;
      });
    });

    setCalories(totalCalories);
  }

  const remaining = Math.max(dailyGoal - calories, 0);

  const percent =
    dailyGoal > 0
      ? Math.min((calories / dailyGoal) * 100, 100)
      : 0;

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          🔥 Today's Calories
        </h2>

        <span className="rounded-full bg-emerald-500/20 px-4 py-1 text-sm font-semibold text-emerald-400">
          {percent.toFixed(0)}%
        </span>

      </div>

      <div className="mt-8">

        <div className="flex items-end justify-between">

          <div>

            <p className="text-sm text-zinc-400">
              Consumed
            </p>

            <h3 className="mt-2 text-4xl font-bold text-white">
              {calories}
            </h3>

            <p className="text-zinc-500">
              kcal
            </p>

          </div>

          <div className="text-right">

            <p className="text-sm text-zinc-400">
              Goal
            </p>

            <h3 className="mt-2 text-3xl font-bold text-emerald-400">
              {dailyGoal}
            </h3>

            <p className="text-zinc-500">
              kcal
            </p>

          </div>

        </div>

      </div>

      <div className="mt-8">

        <div className="h-4 overflow-hidden rounded-full bg-zinc-700">

          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-700"
            style={{
              width: `${percent}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-6 flex items-center justify-between">

        <p className="text-zinc-400">
          {remaining > 0
            ? `${remaining} kcal remaining`
            : "Goal achieved 🎉"}
        </p>

        <p className="font-semibold text-white">
          {percent.toFixed(0)}%
        </p>

      </div>

    </section>
  );
}







// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { useDashboard } from "@/contexts/DashboardContext";

// export default function DailyGoal() {
//   const { refresh } = useDashboard();

//   const [calories, setCalories] = useState(0);
//   const [dailyGoal, setDailyGoal] = useState(2000);
  

//   useEffect(() => {
//     loadCalories();
//   }, [refresh]);

//   async function loadCalories() {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) return;

//     const { data: profile } = await supabase
//      .from("profiles")
//      .select("calorie_goal")
//      .eq("id", user.id)
//      .single();

//     if (profile) {
//       setDailyGoal(profile.calorie_goal);
//     }

//     const { data } = await supabase
//       .from("meal_items")
//       .select("calories");

//     let total = 0;

//     data?.forEach((item) => {
//       total += item.calories ?? 0;
//     });

//     setCalories(total);
//   }

//   const percent = Math.min(
//     (calories / dailyGoal) * 100,
//     100
//   );

//   return (
//     <div className="mt-8 rounded-3xl bg-zinc-900 p-8">

//       <h2 className="text-2xl font-bold text-white">
//         🔥 Daily Goal
//       </h2>

//       <p className="mt-5 text-4xl font-bold text-white">
//         {calories} / {dailyGoal} kcal
//       </p>

//       <div className="mt-6 h-4 w-full rounded-full bg-zinc-700">
//         <div
//           className="h-4 rounded-full bg-emerald-500 transition-all"
//           style={{
//             width: `${percent}%`,
//           }}
//         />
//       </div>

//       <p className="mt-5 text-zinc-400">
//         {dailyGoal - calories > 0
//           ? `${dailyGoal - calories} kcal remaining`
//           : "Goal achieved 🎉"}
//       </p>

//     </div>
//   );
// }
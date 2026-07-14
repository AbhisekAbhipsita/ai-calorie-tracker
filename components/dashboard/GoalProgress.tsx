"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/contexts/DashboardContext";

interface GoalData {
  calorieGoal: number;
  proteinGoal: number;
  calories: number;
  protein: number;
}

export default function GoalProgress() {
  const { refresh } = useDashboard();

  const [goalData, setGoalData] = useState<GoalData>({
    calorieGoal: 2000,
    proteinGoal: 150,
    calories: 0,
    protein: 0,
  });

  useEffect(() => {
    loadGoalProgress();
  }, [refresh]);

  async function loadGoalProgress() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Get user goals
    const { data: profile } = await supabase
      .from("profiles")
      .select("calorie_goal, protein_goal")
      .eq("id", user.id)
      .single();

    const calorieGoal = profile?.calorie_goal ?? 2000;
    const proteinGoal = profile?.protein_goal ?? 150;

    // Today's meals
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: meals } = await supabase
      .from("meal_logs")
      .select(`
        meal_items (
          calories,
          protein
        )
      `)
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    let totalCalories = 0;
    let totalProtein = 0;

    meals?.forEach((meal: any) => {
      meal.meal_items?.forEach((item: any) => {
        totalCalories += item.calories || 0;
        totalProtein += item.protein || 0;
      });
    });

    setGoalData({
      calorieGoal,
      proteinGoal,
      calories: totalCalories,
      protein: totalProtein,
    });
  }

  const calorieRemaining = Math.max(
    goalData.calorieGoal - goalData.calories,
    0
  );

  const proteinRemaining = Math.max(
    goalData.proteinGoal - goalData.protein,
    0
  );

  const caloriePercent = Math.min(
    (goalData.calories / goalData.calorieGoal) * 100,
    100
  );

  const proteinPercent = Math.min(
    (goalData.protein / goalData.proteinGoal) * 100,
    100
  );

  return (
    <div className="rounded-3xl bg-zinc-900 p-6 md:p-8">

      <h2 className="mb-8 text-2xl font-bold text-white">
        🎯 End of Day Summary
      </h2>

      <div className="grid gap-8 lg:grid-cols-2">

        {/* Calories */}

        <div className="rounded-2xl bg-zinc-800 p-6">

          <h3 className="mb-5 text-xl font-semibold text-white">
            🔥 Calories
          </h3>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span className="text-zinc-400">Goal</span>
              <span className="font-semibold text-white">
                {goalData.calorieGoal} kcal
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Consumed</span>
              <span className="font-semibold text-emerald-400">
                {goalData.calories} kcal
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Remaining</span>
              <span className="font-semibold text-orange-400">
                {calorieRemaining} kcal
              </span>
            </div>

          </div>

          <div className="mt-6 h-3 w-full rounded-full bg-zinc-700">

            <div
              className="h-3 rounded-full bg-emerald-500 transition-all"
              style={{
                width: `${caloriePercent}%`,
              }}
            />

          </div>

          <p className="mt-4 text-sm text-zinc-300">
            {goalData.calories >= goalData.calorieGoal
              ? "✅ Calorie Goal Achieved"
              : "❌ Calorie Goal Missed"}
          </p>

        </div>

        {/* Protein */}

        <div className="rounded-2xl bg-zinc-800 p-6">

          <h3 className="mb-5 text-xl font-semibold text-white">
            💪 Protein
          </h3>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span className="text-zinc-400">Goal</span>
              <span className="font-semibold text-white">
                {goalData.proteinGoal} g
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Consumed</span>
              <span className="font-semibold text-emerald-400">
                {goalData.protein} g
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Remaining</span>
              <span className="font-semibold text-orange-400">
                {proteinRemaining} g
              </span>
            </div>

          </div>

          <div className="mt-6 h-3 w-full rounded-full bg-zinc-700">

            <div
              className="h-3 rounded-full bg-blue-500 transition-all"
              style={{
                width: `${proteinPercent}%`,
              }}
            />

          </div>

          <p className="mt-4 text-sm text-zinc-300">
            {goalData.protein >= goalData.proteinGoal
              ? "✅ Protein Goal Achieved"
              : "❌ Protein Goal Missed"}
          </p>

        </div>

      </div>

    </div>
  );
}


















// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { useDashboard } from "@/contexts/DashboardContext";

// interface GoalData {
//   goal: number;
//   consumed: number;
// }

// export default function GoalProgress() {
//   const [goalData, setGoalData] = useState<GoalData>({
//     goal: 2000,
//     consumed: 0,
//   });

//   const { refresh } = useDashboard();

//   useEffect(() => {
//     loadGoal();
//   }, [refresh]);

//   async function loadGoal() {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) return;

//     // Load calorie goal
//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("calorie_goal")
//       .eq("id", user.id)
//       .single();

//     // Load today's meals
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const { data: meals } = await supabase
//       .from("meal_logs")
//       .select(
//         `
//         meal_items(
//           calories
//         )
//       `
//       )
//       .eq("user_id", user.id)
//       .gte("created_at", today.toISOString());

//     let totalCalories = 0;

//     meals?.forEach((meal: any) => {
//       meal.meal_items?.forEach((item: any) => {
//         totalCalories += item.calories || 0;
//       });
//     });

//     setGoalData({
//       goal: profile?.calorie_goal || 2000,
//       consumed: totalCalories,
//     });
//   }

//   const remaining = Math.max(
//     goalData.goal - goalData.consumed,
//     0
//   );

//   const percentage =
//     goalData.goal > 0
//       ? Math.min(
//           (goalData.consumed / goalData.goal) * 100,
//           100
//         )
//       : 0;

//   return (
//     <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg">

//       <div className="mb-6 flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-white">
//           🎯 Daily Goal
//         </h2>

//         <span className="rounded-full bg-emerald-500/20 px-4 py-1 text-sm font-medium text-emerald-400">
//           {percentage.toFixed(0)}%
//         </span>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

//         <div className="rounded-2xl bg-zinc-800 p-5">
//           <p className="text-sm text-zinc-400">
//             Goal
//           </p>

//           <h3 className="mt-2 text-3xl font-bold text-white">
//             {goalData.goal}
//           </h3>

//           <p className="text-zinc-500">
//             kcal
//           </p>
//         </div>

//         <div className="rounded-2xl bg-zinc-800 p-5">
//           <p className="text-sm text-zinc-400">
//             Consumed
//           </p>

//           <h3 className="mt-2 text-3xl font-bold text-emerald-400">
//             {goalData.consumed}
//           </h3>

//           <p className="text-zinc-500">
//             kcal
//           </p>
//         </div>

//         <div className="rounded-2xl bg-zinc-800 p-5">
//           <p className="text-sm text-zinc-400">
//             Remaining
//           </p>

//           <h3 className="mt-2 text-3xl font-bold text-orange-400">
//             {remaining}
//           </h3>

//           <p className="text-zinc-500">
//             kcal
//           </p>
//         </div>

//       </div>

//       {/* Progress */}
//       <div className="mt-8">

//         <div className="h-4 overflow-hidden rounded-full bg-zinc-700">

//           <div
//             className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-700"
//             style={{
//               width: `${percentage}%`,
//             }}
//           />

//         </div>

//         <div className="mt-3 flex justify-between text-sm text-zinc-400">
//           <span>0 kcal</span>
//           <span>{goalData.goal} kcal</span>
//         </div>

//       </div>

//     </section>
//   );
// }


























// // "use client";

// // import { useEffect, useState } from "react";
// // import { supabase } from "@/lib/supabase";

// // interface GoalData {
// //   goal: number;
// //   consumed: number;
// // }

// // export default function GoalProgress() {
// //   const [goalData, setGoalData] = useState<GoalData>({
// //     goal: 0,
// //     consumed: 0,
// //   });

// //   useEffect(() => {
// //     loadGoal();
// //   }, []);

// //   async function loadGoal() {
// //     const {
// //       data: { user },
// //     } = await supabase.auth.getUser();

// //     if (!user) return;

// //     // Get calorie goal
// //     const { data: profile } = await supabase
// //       .from("profiles")
// //       .select("calorie_goal")
// //       .eq("id", user.id)
// //       .single();

// //     // Get today's meals
// //     const today = new Date();
// //     today.setHours(0, 0, 0, 0);

// //     const { data: meals } = await supabase
// //       .from("meal_logs")
// //       .select(`
// //         meal_items (
// //           calories
// //         )
// //       `)
// //       .eq("user_id", user.id)
// //       .gte("created_at", today.toISOString());

// //     let totalCalories = 0;

// //     meals?.forEach((meal: any) => {
// //       meal.meal_items?.forEach((item: any) => {
// //         totalCalories += item.calories || 0;
// //       });
// //     });

// //     setGoalData({
// //       goal: profile?.calorie_goal || 2000,
// //       consumed: totalCalories,
// //     });
// //   }

// //   const remaining = Math.max(goalData.goal - goalData.consumed, 0);

// //   const percentage =
// //     goalData.goal > 0
// //       ? Math.min((goalData.consumed / goalData.goal) * 100, 100)
// //       : 0;

// //   return (
// //     <div className="mt-8 rounded-3xl bg-zinc-900 p-8">

// //       <h2 className="mb-6 text-2xl font-bold text-white">
// //         🎯 Daily Goal
// //       </h2>

// //       <div className="grid grid-cols-3 gap-6">

// //         <div>
// //           <p className="text-zinc-400">Goal</p>
// //           <h3 className="text-2xl font-bold text-white">
// //             {goalData.goal} kcal
// //           </h3>
// //         </div>

// //         <div>
// //           <p className="text-zinc-400">Consumed</p>
// //           <h3 className="text-2xl font-bold text-emerald-400">
// //             {goalData.consumed} kcal
// //           </h3>
// //         </div>

// //         <div>
// //           <p className="text-zinc-400">Remaining</p>
// //           <h3 className="text-2xl font-bold text-orange-400">
// //             {remaining} kcal
// //           </h3>
// //         </div>

// //       </div>

// //       <div className="mt-8">

// //         <div className="h-4 w-full rounded-full bg-zinc-700">

// //           <div
// //             className="h-4 rounded-full bg-emerald-500 transition-all duration-500"
// //             style={{
// //               width: `${percentage}%`,
// //             }}
// //           />

// //         </div>

// //         <p className="mt-3 text-right text-zinc-400">
// //           {percentage.toFixed(0)}%
// //         </p>

// //       </div>

// //     </div>
// //   );
// // }
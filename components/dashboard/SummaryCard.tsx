"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/contexts/DashboardContext";

interface NutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function SummaryCards() {
  const [summary, setSummary] = useState<NutritionSummary>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const { refresh } = useDashboard();

  useEffect(() => {
    loadSummary();
  }, [refresh]);

  async function loadSummary() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("meal_logs")
      .select(
        `
        id,
        meal_items (
          calories,
          protein,
          carbs,
          fat
        )
      `
      )
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    if (error || !data) return;

    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    data.forEach((meal: any) => {
      meal.meal_items?.forEach((item: any) => {
        calories += item.calories || 0;
        protein += item.protein || 0;
        carbs += item.carbs || 0;
        fat += item.fat || 0;
      });
    });

    setSummary({
      calories,
      protein,
      carbs,
      fat,
    });
  }

  const cards = [
    {
      title: "Calories",
      value: `${summary.calories} kcal`,
      emoji: "🔥",
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Protein",
      value: `${summary.protein} g`,
      emoji: "💪",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Carbs",
      value: `${summary.carbs} g`,
      emoji: "🍚",
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Fat",
      value: `${summary.fat} g`,
      emoji: "🥑",
      color: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-emerald-500/10"
        >
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${card.color} text-3xl`}
          >
            {card.emoji}
          </div>

          <p className="mt-6 text-sm font-medium text-zinc-400">
            {card.title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            {card.value}
          </h2>
        </div>
      ))}
    </section>
  );
}






// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { useDashboard } from "@/contexts/DashboardContext";


// interface NutritionSummary {
//   calories: number;
//   protein: number;
//   carbs: number;
//   fat: number;
// }

// export default function SummaryCards() {
//   const [summary, setSummary] = useState<NutritionSummary>({
//     calories: 0,
//     protein: 0,
//     carbs: 0,
//     fat: 0,
//   });

// const { refresh } = useDashboard();

// useEffect(() => {
//     loadSummary();
// }, [refresh]);

//   async function loadSummary() {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) return;

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const { data, error } = await supabase
//       .from("meal_logs")
//       .select(`
//         id,
//         meal_items (
//           calories,
//           protein
//         )
//       `)
//       .eq("user_id", user.id)
//       .gte("created_at", today.toISOString());

//     if (error || !data) return;

//     let calories = 0;
//     let protein = 0;

//     data.forEach((meal: any) => {
//       meal.meal_items?.forEach((item: any) => {
//         calories += item.calories || 0;
//         protein += item.protein || 0;
//       });
//     });

//     setSummary({
//       calories,
//       protein,
//       carbs: 0,
//       fat: 0,
//     });
//   }

//   const cards = [
//     {
//       title: "Calories",
//       value: `${summary.calories} kcal`,
//       emoji: "🔥",
//     },
//     {
//       title: "Protein",
//       value: `${summary.protein} g`,
//       emoji: "💪",
//     },
//     {
//       title: "Carbs",
//       value: `${summary.carbs} g`,
//       emoji: "🍚",
//     },
//     {
//       title: "Fat",
//       value: `${summary.fat} g`,
//       emoji: "🥑",
//     },
//   ];

//   return (
//     <div className="grid gap-6 md:grid-cols-4">

//       {cards.map((card) => (
//         <div
//           key={card.title}
//           className="rounded-2xl bg-zinc-900 p-6"
//         >
//           <div className="text-4xl">
//             {card.emoji}
//           </div>

//           <h2 className="mt-4 text-zinc-400">
//             {card.title}
//           </h2>

//           <p className="mt-2 text-3xl font-bold text-white">
//             {card.value}
//           </p>
//         </div>
//       ))}

//     </div>
//   );
// }
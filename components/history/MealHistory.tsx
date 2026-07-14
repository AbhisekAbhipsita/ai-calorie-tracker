"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface MealItem {
  id: string;
  food_name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  id: string;
  meal_type: string;
  raw_text: string;
  created_at: string;
  meal_items: MealItem[];
}
export default function MealHistory() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);


  useEffect(() => {
    loadMeals();
  }, []);

  async function loadMeals() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("meal_logs")
      .select(`
        *,
        meal_items(
          id,
          food_name,
          quantity,
          unit,
          calories,
          protein,
          carbs,
          fat
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setMeals((data as Meal[]) || []);
  }

  async function deleteMeal(id: string) {
    if (!confirm("Delete this meal?")) return;

    await fetch(`/api/meals/${id}`, {
      method: "DELETE",
    });

    loadMeals();
  }

  const groupedMeals = useMemo(() => {
    const today = new Date();

const filtered = meals.filter((meal) => {
  const mealDate = new Date(meal.created_at);

  const matchesSearch =
    meal.raw_text.toLowerCase().includes(search.toLowerCase());

  let matchesFilter = true;

  if (filter === "today") {
    matchesFilter =
      mealDate.toDateString() === today.toDateString();
  }

  if (filter === "week") {
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    matchesFilter = mealDate >= weekAgo;
  }

  if (filter === "month") {
    matchesFilter =
      mealDate.getMonth() === today.getMonth() &&
      mealDate.getFullYear() === today.getFullYear();
  }

  return matchesSearch && matchesFilter;
})
    

    const groups: Record<string, Meal[]> = {};

    filtered.forEach((meal) => {
      const date = new Date(meal.created_at).toLocaleDateString();

      if (!groups[date]) groups[date] = [];

      groups[date].push(meal);
    });

    return groups;
  }, [meals, search]);

  return (
    <div className="space-y-8">

      <div className="relative">

        <Search
          className="absolute left-4 top-4 text-zinc-500"
          size={18}
        />

        <input
          placeholder="Search meals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-zinc-900 py-4 pl-12 pr-4 text-white outline-none"
        />

      </div>

      <div className="flex flex-wrap gap-3">

  {["all", "today", "week", "month"].map((item) => (

    <button
      key={item}
      onClick={() => setFilter(item)}
      className={`rounded-xl px-4 py-2 font-medium transition ${
        filter === item
          ? "bg-emerald-500 text-white"
          : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
      }`}
    >
      {item === "all"
        ? "All"
        : item === "today"
        ? "Today"
        : item === "week"
        ? "This Week"
        : "This Month"}
    </button>

  ))}

</div>

      {Object.entries(groupedMeals).map(([date, meals]) => {

        let calories = 0;
        let protein = 0;
        let carbs = 0;
        let fat = 0;

        meals.forEach((meal) => {
          meal.meal_items?.forEach((item) => {
            calories += item.calories || 0;
            protein += Number(item.protein || 0);
            carbs += Number(item.carbs || 0);
            fat += Number(item.fat || 0);
          });
        });

        return (

          <div key={date} className="space-y-4">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-white">
                  {date}
                </h2>

                <p className="text-zinc-400">
                  {meals.length} meal(s)
                </p>

              </div>

              <div className="rounded-2xl bg-zinc-900 p-4 text-right">

                <p className="text-orange-400 font-semibold">
                  🔥 {calories} kcal
                </p>

                <p className="text-emerald-400">
                  💪 {protein.toFixed(1)} g
                </p>

                <p className="text-blue-400">
                  🍚 {carbs.toFixed(1)} g
                </p>

                <p className="text-yellow-400">
                  🥑 {fat.toFixed(1)} g
                </p>

              </div>

            </div>

            {meals.map((meal) => (

              <div
  key={meal.id}
  className="rounded-2xl border border-white/10 bg-zinc-900"
>

  {/* Header */}

  <div className="flex items-center justify-between p-6">

    <div>

      <h3 className="text-lg font-semibold text-white">
        {meal.meal_type}
      </h3>

      <p className="mt-2 text-zinc-300">
        {meal.raw_text}
      </p>

      <p className="mt-3 text-xs text-zinc-500">
        {new Date(meal.created_at).toLocaleTimeString()}
      </p>

    </div>

    <div className="flex gap-2">

      <button
        onClick={() =>
          setExpandedMeal(
            expandedMeal === meal.id
              ? null
              : meal.id
          )
        }
        className="rounded-xl bg-zinc-800 p-2 hover:bg-zinc-700"
      >
        {expandedMeal === meal.id ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}
      </button>

      <button
        onClick={() => deleteMeal(meal.id)}
        className="rounded-xl bg-red-500/10 p-2 hover:bg-red-500/20"
      >
        <Trash2
          className="text-red-400"
          size={18}
        />
      </button>

    </div>

  </div>

  {/* Expanded Details */}

  {expandedMeal === meal.id && (

    <div className="border-t border-white/10 p-6">

      <h4 className="mb-4 text-lg font-semibold text-white">
        Food Items
      </h4>

      <div className="space-y-4">

        {meal.meal_items.map((item) => (

          <div
            key={item.id}
            className="rounded-xl bg-zinc-800 p-4"
          >

            <div className="flex items-center justify-between">

              <div>

                <h5 className="font-semibold text-white">
                  {item.food_name}
                </h5>

                <p className="text-sm text-zinc-400">
                  {item.quantity} {item.unit}
                </p>

              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">

                <div>🔥 {item.calories} kcal</div>

                <div>💪 {item.protein} g</div>

                <div>🍚 {item.carbs} g</div>

                <div>🥑 {item.fat} g</div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  )}

</div>

            ))}

          </div>

        );
      })}

    </div>
  );
}












// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";

// interface Meal {
//   id: string;
//   meal_type: string;
//   raw_text: string;
//   created_at: string;
// }

// export default function MealHistory() {
//   const [meals, setMeals] = useState<Meal[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadMeals();
//   }, []);

//   async function loadMeals() {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) return;

//     const { data, error } = await supabase
//       .from("meal_logs")
//       .select("*")
//       .eq("user_id", user.id)
//       .order("created_at", {
//         ascending: false,
//       });

//     if (!error && data) {
//       setMeals(data);
//     }

//     setLoading(false);
//   }

//   if (loading) {
//     return (
//       <p className="text-white">
//         Loading...
//       </p>
//     );
//   }

//   return (
//     <div className="space-y-5">

//       {meals.length === 0 && (
//         <p className="text-zinc-400">
//           No meals found.
//         </p>
//       )}

//       {meals.map((meal) => (
//         <div
//           key={meal.id}
//           className="rounded-2xl bg-zinc-900 p-6"
//         >
//           <div className="flex justify-between">

//             <div>

//               <h2 className="text-xl font-bold text-white">
//                 {meal.meal_type}
//               </h2>

//               <p className="mt-3 text-zinc-400">
//                 {meal.raw_text}
//               </p>

//             </div>

//             <div className="text-sm text-zinc-500">
//               {new Date(meal.created_at).toLocaleDateString()}
//             </div>

//           </div>
//         </div>
//       ))}

//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  Trash2,
  UtensilsCrossed,
  Clock3,
} from "lucide-react";

interface Meal {
  id: string;
  meal_type: string;
  raw_text: string;
  created_at: string;
}

export default function TodayMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  const { refresh, triggerRefresh } = useDashboard();

  useEffect(() => {
    loadMeals();
  }, [refresh]);

  async function loadMeals() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("meal_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString())
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setMeals(data || []);
    }

    setLoading(false);
  }

  async function deleteMeal(id: string) {
    const ok = confirm(
      "Delete this meal?"
    );

    if (!ok) return;

    const response = await fetch(
      `/api/meals/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      alert("Unable to delete meal.");
      return;
    }

    triggerRefresh();
  }

  if (loading) {
    return (
      <section className="mt-8 rounded-3xl border border-white/10 bg-zinc-900 p-8 text-center">

        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>

        <p className="text-zinc-400">
          Loading today's meals...
        </p>

      </section>
    );
  }

  return (
    <section className="mt-8 rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg">

      <div className="mb-8 flex items-center gap-3">

        <div className="rounded-2xl bg-emerald-500/20 p-3">
          <UtensilsCrossed
            className="text-emerald-400"
            size={24}
          />
        </div>

        <div>

          <h2 className="text-2xl font-bold text-white">
            Today's Meals
          </h2>

          <p className="text-sm text-zinc-400">
            {meals.length} meal
            {meals.length !== 1 && "s"} logged today
          </p>

        </div>

      </div>

      {meals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">

          <UtensilsCrossed
            size={48}
            className="mx-auto text-zinc-600"
          />

          <h3 className="mt-4 text-xl font-semibold text-white">
            No meals yet
          </h3>

          <p className="mt-2 text-zinc-500">
            Analyze and save your first meal.
          </p>

        </div>
      ) : (
        <div className="space-y-5">

          {meals.map((meal) => (
            <div
              key={meal.id}
              className="rounded-2xl border border-white/10 bg-zinc-950 p-6 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg"
            >

              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                <div className="flex-1">

                  <div className="flex flex-wrap items-center gap-3">

                    <span className="rounded-full bg-emerald-500/20 px-4 py-1 text-sm font-medium text-emerald-400">
                      {meal.meal_type}
                    </span>

                    <div className="flex items-center gap-1 text-sm text-zinc-500">

                      <Clock3 size={15} />

                      {new Date(
                        meal.created_at
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}

                    </div>

                  </div>

                  <p className="mt-5 whitespace-pre-wrap leading-7 text-zinc-300">
                    {meal.raw_text}
                  </p>

                </div>

                <button
                  onClick={() =>
                    deleteMeal(meal.id)
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </section>
  );
}







// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { useDashboard } from "@/contexts/DashboardContext";
// import { Trash2 } from "lucide-react";

// interface Meal {
//   id: string;
//   meal_type: string;
//   raw_text: string;
//   created_at: string;
// }

// export default function TodayMeals() {
//   const [meals, setMeals] = useState<Meal[]>([]);
//   const [loading, setLoading] = useState(true);

//   const { refresh, triggerRefresh } = useDashboard();

//   useEffect(() => {
//     loadMeals();
//   }, [refresh]);

//   async function loadMeals() {
//     setLoading(true);

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       setLoading(false);
//       return;
//     }

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const { data, error } = await supabase
//       .from("meal_logs")
//       .select("*")
//       .eq("user_id", user.id)
//       .gte("created_at", today.toISOString())
//       .order("created_at", { ascending: false });

//     if (error) {
//       console.error(error);
//     } else {
//       setMeals(data || []);
//     }

//     setLoading(false);
//   }

//   async function deleteMeal(id: string) {
//     const ok = confirm("Delete this meal?");

//     if (!ok) return;

//     const response = await fetch(`/api/meals/${id}`, {
//       method: "DELETE",
//     });

//     if (!response.ok) {
//       alert("Unable to delete meal.");
//       return;
//     }

//     // Refresh Dashboard Components
//     triggerRefresh();
//   }

//   if (loading) {
//     return (
//       <div className="mt-8 text-white">
//         Loading today's meals...
//       </div>
//     );
//   }

//   return (
//     <div className="mt-8 rounded-3xl bg-zinc-900 p-8">
//       <h2 className="mb-6 text-2xl font-bold text-white">
//         Today's Meals
//       </h2>

//       {meals.length === 0 ? (
//         <p className="text-zinc-400">
//           No meals logged today.
//         </p>
//       ) : (
//         <div className="space-y-4">
//           {meals.map((meal) => (
//             <div
//               key={meal.id}
//               className="rounded-xl border border-white/10 p-5"
//             >
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h3 className="font-semibold text-white">
//                     {meal.meal_type}
//                   </h3>

//                   <p className="mt-2 text-zinc-400">
//                     {meal.raw_text}
//                   </p>

//                   <p className="mt-3 text-xs text-zinc-500">
//                     {new Date(meal.created_at).toLocaleTimeString()}
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => deleteMeal(meal.id)}
//                   className="rounded-lg p-2 text-red-500 transition hover:bg-red-500/10 hover:text-red-400"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
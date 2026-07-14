"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Salad,
  Flame,
  Beef,
  Wheat,
  Droplets,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/contexts/DashboardContext";

interface FoodItem {
  name: string;
  quantity: string;

  calories: number;
  protein: number;
  carbs: number;
  fat: number;

  fiber: number;
  sugar: number;
  sodium: number;
  calcium: number;
  iron: number;
  vitamin_c: number;
}

interface NutritionResult {
  items: FoodItem[];

  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;

  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  totalCalcium: number;
  totalIron: number;
  totalVitaminC: number;
}

export default function MealInput() {
  const [meal, setMeal] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [result, setResult] =
    useState<NutritionResult | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { triggerRefresh } = useDashboard();

  async function analyzeMeal() {
    if (!meal.trim()) return;

    setLoading(true);
    setError("");
    setSuccess("");
    setResult(null);

    try {
      const response = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meal,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("API Error:", error);
        throw new Error(error);
       }

      const data = await response.json();

      setResult(data.data);
    } catch (err: any) {
      console.error("Analyze Meal Error:", err);
      setError(err.message || "Unable to analyze meal.");
    } finally {
      setLoading(false);
    }
  }

  async function saveMeal() {
    if (!result) return;

    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please login first.");
        return;
      }

      const response = await fetch("/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          mealType: "General",
          rawText: meal,
          nutrition: result,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      triggerRefresh();

      setSuccess("Meal saved successfully.");

      setMeal("");
      setResult(null);

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-xl">

      <div className="flex items-center gap-3">

        <div className="rounded-2xl bg-emerald-500/20 p-3">
          <Sparkles
            className="text-emerald-400"
            size={26}
          />
        </div>

        <div>

          <h2 className="text-2xl font-bold text-white">
            AI Meal Logger
          </h2>

          <p className="text-sm text-zinc-400">
            Describe your meal and let AI estimate the nutrition.
          </p>

        </div>

      </div>

      <textarea
        rows={6}
        value={meal}
        onChange={(e) => setMeal(e.target.value)}
        placeholder={`Example:

2 Rotis
1 Bowl Dal
200g Chicken Curry
1 Apple`}
        className="mt-8 w-full rounded-2xl border border-white/10 bg-zinc-950 p-5 text-white outline-none transition focus:border-emerald-500"
      />

      {error && (
        <div className="mt-6 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-300">
          {success}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">

        <button
          onClick={analyzeMeal}
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-emerald-500 py-4 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles />
              Analyze Meal
            </>
          )}
        </button>
                {result && (
          <div className="mt-10 space-y-6">

            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">

              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
                <Salad className="text-emerald-400" />
                AI Nutrition Analysis
              </h3>

              <div className="space-y-4">

                {result.items.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-zinc-900 p-5 transition hover:border-emerald-500/40"
                  >

                    <div className="flex flex-col justify-between gap-4 md:flex-row">

                      <div>

                        <h4 className="text-lg font-semibold text-white">
                          {item.name}
                        </h4>

                        <p className="mt-1 text-sm text-zinc-400">
                          {item.quantity}
                        </p>

                      </div>

                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">

  <div className="rounded-xl bg-orange-500/10 p-3 text-center">
    <Flame className="mx-auto mb-2 text-orange-400" size={20} />
    <p className="text-sm text-zinc-400">Calories</p>
    <p className="font-bold text-white">{item.calories} kcal</p>
  </div>

  <div className="rounded-xl bg-green-500/10 p-3 text-center">
    <Beef className="mx-auto mb-2 text-green-400" size={20} />
    <p className="text-sm text-zinc-400">Protein</p>
    <p className="font-bold text-white">{item.protein} g</p>
  </div>

  <div className="rounded-xl bg-yellow-500/10 p-3 text-center">
    <Wheat className="mx-auto mb-2 text-yellow-400" size={20} />
    <p className="text-sm text-zinc-400">Carbs</p>
    <p className="font-bold text-white">{item.carbs} g</p>
  </div>

  <div className="rounded-xl bg-cyan-500/10 p-3 text-center">
    <Droplets className="mx-auto mb-2 text-cyan-400" size={20} />
    <p className="text-sm text-zinc-400">Fat</p>
    <p className="font-bold text-white">{item.fat} g</p>
  </div>

  <div className="rounded-xl bg-lime-500/10 p-3 text-center">
    <p className="text-2xl">🌾</p>
    <p className="text-sm text-zinc-400">Fiber</p>
    <p className="font-bold text-white">{item.fiber} g</p>
  </div>

  <div className="rounded-xl bg-pink-500/10 p-3 text-center">
    <p className="text-2xl">🍬</p>
    <p className="text-sm text-zinc-400">Sugar</p>
    <p className="font-bold text-white">{item.sugar} g</p>
  </div>

  <div className="rounded-xl bg-slate-500/10 p-3 text-center">
    <p className="text-2xl">🧂</p>
    <p className="text-sm text-zinc-400">Sodium</p>
    <p className="font-bold text-white">{item.sodium} mg</p>
  </div>

  <div className="rounded-xl bg-indigo-500/10 p-3 text-center">
    <p className="text-2xl">🦴</p>
    <p className="text-sm text-zinc-400">Calcium</p>
    <p className="font-bold text-white">{item.calcium} mg</p>
  </div>

  <div className="rounded-xl bg-red-500/10 p-3 text-center">
    <p className="text-2xl">⚙️</p>
    <p className="text-sm text-zinc-400">Iron</p>
    <p className="font-bold text-white">{item.iron} mg</p>
  </div>

  <div className="rounded-xl bg-emerald-500/10 p-3 text-center">
    <p className="text-2xl">🍊</p>
    <p className="text-sm text-zinc-400">Vitamin C</p>
    <p className="font-bold text-white">{item.vitamin_c} mg</p>
  </div>

</div>

                    </div>

                  </div>
                ))}

              </div>

            </div>

            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">

              <h3 className="mb-6 text-xl font-bold text-white">
                Total Nutrition
              </h3>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">

  <div className="rounded-2xl bg-zinc-900 p-5 text-center">
    <Flame className="mx-auto mb-2 text-orange-400" />
    <p className="text-sm text-zinc-400">Calories</p>
    <p className="text-2xl font-bold text-white">
      {result.totalCalories}
    </p>
  </div>

  <div className="rounded-2xl bg-zinc-900 p-5 text-center">
    <Beef className="mx-auto mb-2 text-green-400" />
    <p className="text-sm text-zinc-400">Protein</p>
    <p className="text-2xl font-bold text-white">
      {result.totalProtein} g
    </p>
  </div>

  <div className="rounded-2xl bg-zinc-900 p-5 text-center">
    <Wheat className="mx-auto mb-2 text-yellow-400" />
    <p className="text-sm text-zinc-400">Carbs</p>
    <p className="text-2xl font-bold text-white">
      {result.totalCarbs} g
    </p>
  </div>

  <div className="rounded-2xl bg-zinc-900 p-5 text-center">
    <Droplets className="mx-auto mb-2 text-cyan-400" />
    <p className="text-sm text-zinc-400">Fat</p>
    <p className="text-2xl font-bold text-white">
      {result.totalFat} g
    </p>
  </div>

  <div className="rounded-2xl bg-zinc-900 p-5 text-center">
    🌾
    <p className="text-sm text-zinc-400">Fiber</p>
    <p className="text-2xl font-bold text-white">
      {result.totalFiber} g
    </p>
  </div>

  <div className="rounded-2xl bg-zinc-900 p-5 text-center">
    🍬
    <p className="text-sm text-zinc-400">Sugar</p>
    <p className="text-2xl font-bold text-white">
      {result.totalSugar} g
    </p>
  </div>

  <div className="rounded-2xl bg-zinc-900 p-5 text-center">
    🧂
    <p className="text-sm text-zinc-400">Sodium</p>
    <p className="text-2xl font-bold text-white">
      {result.totalSodium} mg
    </p>
  </div>

  <div className="rounded-2xl bg-zinc-900 p-5 text-center">
    🦴
    <p className="text-sm text-zinc-400">Calcium</p>
    <p className="text-2xl font-bold text-white">
      {result.totalCalcium} mg
    </p>
  </div>

  <div className="rounded-2xl bg-zinc-900 p-5 text-center">
    ⚙️
    <p className="text-sm text-zinc-400">Iron</p>
    <p className="text-2xl font-bold text-white">
      {result.totalIron} mg
    </p>
  </div>

  <div className="rounded-2xl bg-zinc-900 p-5 text-center">
    🍊
    <p className="text-sm text-zinc-400">Vitamin C</p>
    <p className="text-2xl font-bold text-white">
      {result.totalVitaminC} mg
    </p>
  </div>

</div>

              <button
                onClick={saveMeal}
                disabled={saving}
                className="mt-8 w-full rounded-2xl bg-emerald-500 py-4 text-lg font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="animate-spin" />
                    Saving Meal...
                  </div>
                ) : (
                  "Save Meal"
                )}
              </button>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}










// "use client";

// import { useState } from "react";
// import { Sparkles, Loader2 } from "lucide-react";
// import { supabase } from "@/lib/supabase";
// import { useDashboard } from "@/contexts/DashboardContext";


// interface FoodItem {
//   name: string;
//   quantity: string;
//   calories: number;
//   protein: number;
//   carbs: number;
//   fat: number;
// }

// interface NutritionResult {
//   items: FoodItem[];
//   totalCalories: number;
//   totalProtein: number;
//   totalCarbs: number;
//   totalFat: number;
// }

// export default function MealInput() {
//   const [meal, setMeal] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const { refresh, triggerRefresh } = useDashboard();

//   const [result, setResult] = useState<NutritionResult | null>(null);
//   const [error, setError] = useState("");

//   // ------------------------
//   // Analyze Meal
//   // ------------------------

//   const analyzeMeal = async () => {
//     if (!meal.trim()) return;

//     setLoading(true);
//     setError("");
//     setResult(null);

//     try {
//       const response = await fetch("/api/analyze-meal", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           meal,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to analyze meal");
//       }

//       const data = await response.json();

//       setResult(data.data);
//     } catch (err) {
//       console.error(err);
//       setError("Unable to analyze meal.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ------------------------
//   // Save Meal
//   // ------------------------

//   const saveMeal = async () => {
//     if (!result) return;

//     setSaving(true);

//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) {
//         alert("Please login first.");
//         return;
//       }

//       const response = await fetch("/api/meals", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId: user.id,
//           mealType: "General",
//           rawText: meal,
//           nutrition: result,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to save meal");
//       }

//       alert("✅ Meal saved successfully!");
//       triggerRefresh();

//       setMeal("");
//       setResult(null);
//       setError("");

//     } catch (err: any) {
//       console.error(err);
//       alert(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="mt-8 rounded-3xl border border-white/10 bg-zinc-900 p-8">

//       <div className="flex items-center gap-3">
//         <Sparkles className="text-emerald-400" />

//         <h2 className="text-2xl font-bold text-white">
//           AI Meal Logger
//         </h2>
//       </div>

//       <p className="mt-2 text-zinc-400">
//         Tell AI what you ate today.
//       </p>

//       <textarea
//         rows={6}
//         value={meal}
//         onChange={(e) => setMeal(e.target.value)}
//         placeholder={`Example:

// 2 rotis
// 1 bowl dal
// Chicken curry 200g`}
//         className="mt-6 w-full rounded-2xl border border-white/10 bg-zinc-950 p-4 text-white outline-none"
//       />

//       <button
//         onClick={analyzeMeal}
//         disabled={loading}
//         className="mt-6 flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:scale-105 disabled:opacity-50"
//       >
//         {loading ? (
//           <>
//             <Loader2 className="animate-spin" />
//             Analyzing...
//           </>
//         ) : (
//           <>
//             <Sparkles />
//             Analyze Meal
//           </>
//         )}
//       </button>

//       {error && (
//         <div className="mt-6 rounded-xl bg-red-500/20 p-4 text-red-300">
//           {error}
//         </div>
//       )}

//       {result && (
//         <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-6">

//           <h3 className="mb-6 text-xl font-bold text-white">
//             🍛 AI Nutrition Analysis
//           </h3>

//           <div className="space-y-4">

//             {result.items.map((item, index) => (
//               <div
//                 key={index}
//                 className="rounded-xl border border-white/10 p-4"
//               >
//                 <h4 className="font-semibold text-white">
//                   {item.name}
//                 </h4>

//                 <p className="text-zinc-400">
//                   Quantity: {item.quantity}
//                 </p>

//                 <div className="mt-2 grid grid-cols-2 gap-2 text-sm">

//                   <div>🔥 {item.calories} kcal</div>

//                   <div>💪 {item.protein} g</div>

//                   <div>🍚 {item.carbs} g</div>

//                   <div>🥑 {item.fat} g</div>

//                 </div>

//               </div>
//             ))}

//           </div>

//           <div className="mt-8 rounded-xl bg-emerald-500/20 p-5">

//             <h3 className="mb-4 text-lg font-bold text-white">
//               Total Nutrition
//             </h3>

//             <div className="grid grid-cols-2 gap-4">

//               <div>
//                 🔥 Calories
//                 <br />
//                 <span className="font-bold text-white">
//                   {result.totalCalories}
//                 </span>
//               </div>

//               <div>
//                 💪 Protein
//                 <br />
//                 <span className="font-bold text-white">
//                   {result.totalProtein} g
//                 </span>
//               </div>

//               <div>
//                 🍚 Carbs
//                 <br />
//                 <span className="font-bold text-white">
//                   {result.totalCarbs} g
//                 </span>
//               </div>

//               <div>
//                 🥑 Fat
//                 <br />
//                 <span className="font-bold text-white">
//                   {result.totalFat} g
//                 </span>
//               </div>

//             </div>

//             <button
//               onClick={saveMeal}
//               disabled={saving}
//               className="mt-6 w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
//             >
//               {saving ? "Saving Meal..." : "Save Meal"}
//             </button>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// }
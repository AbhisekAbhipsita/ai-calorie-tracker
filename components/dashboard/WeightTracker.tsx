"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Scale } from "lucide-react";

export default function WeightTracker() {
  const [weight, setWeight] = useState("");
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadLatestWeight();
  }, []);

  async function loadLatestWeight() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("weight_logs")
      .select("weight_kg")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setLatestWeight(Number(data.weight_kg));
    }
  }

  async function saveWeight() {
  if (!weight) {
    setMessage("Please enter your weight.");
    return;
  }

  setLoading(true);
  setMessage("");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setLoading(false);
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  // Check if today's weight already exists
  const { data: existing } = await supabase
    .from("weight_logs")
    .select("id")
    .eq("user_id", user.id)
    .eq("logged_at", today)
    .maybeSingle();

  let error = null;

  if (existing) {
    // Update today's weight
    const { error: updateError } = await supabase
      .from("weight_logs")
      .update({
        weight_kg: Number(weight),
      })
      .eq("id", existing.id);

    error = updateError;
  } else {
    // Insert new record
    const { error: insertError } = await supabase
      .from("weight_logs")
      .insert({
        user_id: user.id,
        weight_kg: Number(weight),
        logged_at: today,
      });

    error = insertError;
  }

  setLoading(false);

  if (error) {
    console.error(error);
    setMessage("Unable to save weight.");
    return;
  }

  await loadLatestWeight();

  setMessage("✅ Weight saved successfully!");

  setWeight("");
}

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg">

      <div className="flex items-center gap-3">

        <div className="rounded-2xl bg-blue-500/20 p-3">
          <Scale className="text-blue-400" size={24} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Weight Tracker
          </h2>

          <p className="text-sm text-zinc-400">
            Record today's body weight
          </p>
        </div>

      </div>

      {latestWeight !== null && (
        <div className="mt-6 rounded-2xl bg-zinc-800 p-5">

          <p className="text-sm text-zinc-400">
            Latest Recorded Weight
          </p>

          <h3 className="mt-2 text-4xl font-bold text-emerald-400">
            {latestWeight} kg
          </h3>

        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 md:flex-row">

        <input
          type="number"
          step="0.1"
          placeholder="Enter weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="flex-1 rounded-2xl border border-white/10 bg-zinc-950 p-4 text-white outline-none transition focus:border-emerald-500"
        />

        <button
          onClick={saveWeight}
          disabled={loading}
          className="rounded-2xl bg-emerald-500 px-8 py-4 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Weight"}
        </button>

      </div>

      {message && (
        <div className="mt-5 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-400">
          {message}
        </div>
      )}

    </section>
  );
}
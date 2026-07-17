"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BMICard() {
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("height_cm, weight")
      .eq("id", user.id)
      .single();

    // Latest weight
    const { data: latest } = await supabase
      .from("weight_logs")
      .select("weight_kg")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .limit(1)
      .single();

    setHeight(Number(profile?.height_cm) || 0);

    setWeight(
      Number(latest?.weight_kg) ||
      Number(profile?.weight) ||
      0
    );
  }

  const bmi =
    height > 0
      ? weight / Math.pow(height / 100, 2)
      : 0;

  function getStatus() {
    if (bmi === 0) return "--";

    if (bmi < 18.5)
      return "Underweight";

    if (bmi < 25)
      return "Healthy";

    if (bmi < 30)
      return "Overweight";

    return "Obese";
  }

  function getColor() {
    if (bmi < 18.5)
      return "text-blue-400";

    if (bmi < 25)
      return "text-green-400";

    if (bmi < 30)
      return "text-yellow-400";

    return "text-red-400";
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg">

      <h2 className="mb-6 text-2xl font-bold text-white">
        BMI Calculator
      </h2>

      <div className="space-y-5">

        <div className="flex justify-between">
          <span className="text-zinc-400">
            Height
          </span>

          <span className="font-semibold text-white">
            {height || "--"} cm
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-400">
            Weight
          </span>

          <span className="font-semibold text-white">
            {weight || "--"} kg
          </span>
        </div>

        <div className="border-t border-zinc-700 pt-5">

          <p className="text-sm text-zinc-400">
            Body Mass Index
          </p>

          <h1 className="mt-2 text-5xl font-bold text-white">
            {bmi ? bmi.toFixed(1) : "--"}
          </h1>

          <p className={`mt-3 text-lg font-semibold ${getColor()}`}>
            {getStatus()}
          </p>

        </div>

      </div>

    </div>
  );
}
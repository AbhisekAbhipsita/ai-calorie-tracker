"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface WeightData {
  logged_at: string;
  weight_kg: number;
}

export default function WeightHistory() {
  const [weights, setWeights] = useState<WeightData[]>([]);

  useEffect(() => {
    loadWeights();
  }, []);

  async function loadWeights() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("weight_logs")
      .select("weight_kg, logged_at, created_at")
      .eq("user_id", user.id)
      .order("logged_at");

    const rows = (data || []) as any[];
    setWeights(
      rows.map((r) => ({
        weight_kg: r.weight_kg,
        // prefer logged_at, fall back to created_at if present
        logged_at: r.logged_at ?? r.created_at,
      }))
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">

      <h2 className="mb-6 text-2xl font-bold text-white">
        Weight Trend
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={weights}>

          <CartesianGrid stroke="#3f3f46" />

          <XAxis
            dataKey="logged_at"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="weight_kg"
            stroke="#10b981"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}
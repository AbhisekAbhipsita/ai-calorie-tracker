"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

async function login() {
  setLoading(true);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("LOGIN DATA:", data);
  console.log("LOGIN ERROR:", error);

  setLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Login Success");

  router.push("/dashboard");
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">

      <div className="w-full max-w-md rounded-3xl bg-zinc-900 p-8">

        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          Login
        </h1>

        <input
          className="mb-4 w-full rounded-xl bg-zinc-800 p-4 text-white"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          className="mb-6 w-full rounded-xl bg-zinc-800 p-4 text-white"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full rounded-xl bg-emerald-500 p-4 text-white"
        >
          {loading ? "Signing In..." : "Login"}
        </button>

      </div>

    </div>
  );
}
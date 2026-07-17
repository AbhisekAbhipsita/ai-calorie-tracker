"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SignupPage() {

  const router = useRouter();

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const [loading,setLoading]=useState(false);

  async function signup(){

    setLoading(true);

    const {error}=await supabase.auth.signUp({

      email,

      password,

    });

    setLoading(false);

    if(error){

      alert(error.message);

      return;

    }

    alert("Account created successfully.");

    router.push("/login");

  }

  return(

    <div className="flex min-h-screen items-center justify-center bg-zinc-950">

      <div className="w-full max-w-md rounded-3xl bg-zinc-900 p-8">

        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          Create Account
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
          onClick={signup}
          disabled={loading}
          className="w-full rounded-xl bg-emerald-500 p-4 text-white"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

      </div>

    </div>

  );



}
  <div className="mt-8 border-t border-white/10 pt-6 text-center">
  <p className="text-sm text-zinc-400">
    Already have an account?{" "}
    <Link
      href="/login"
      className="font-semibold text-emerald-400 transition hover:text-emerald-300"
    >
      Sign In
    </Link>
  </p>
</div>
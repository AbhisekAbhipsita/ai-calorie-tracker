"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    full_name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    activity_level: "",
    calorie_goal: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
const {
  data: { session },
} = await supabase.auth.getSession();

console.log("SESSION:", session);

const user = session?.user;

if (!user) {
  alert("No user found");
  return;
}

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile({
        full_name: data.full_name || "",
        age: data.age || "",
        gender: data.gender || "",
        height: data.height || "",
        weight: data.weight || "",
        activity_level: data.activity_level || "",
        calorie_goal: data.calorie_goal || "",
      });
    }
  }

async function saveProfile() {
  console.log("Save button clicked");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("User:", user);

  if (!user) {
    alert("No user found");
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: profile.full_name,
      age: Number(profile.age),
      gender: profile.gender,
      height: Number(profile.height),
      weight: Number(profile.weight),
      activity_level: profile.activity_level,
      calorie_goal: Number(profile.calorie_goal),
    })
    .eq("id", user.id)
    .select();

  console.log("Data:", data);
  console.log("Error:", error);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Profile updated successfully!");
}

  return (
    <main className="min-h-screen bg-zinc-950 p-8">

      <h1 className="mb-8 text-4xl font-bold text-white">
        My Profile
      </h1>

      <div className="space-y-5 rounded-3xl bg-zinc-900 p-8">

        <input
          placeholder="Full Name"
          value={profile.full_name}
          onChange={(e) =>
            setProfile({
              ...profile,
              full_name: e.target.value,
            })
          }
          className="w-full rounded-xl bg-zinc-950 p-4 text-white"
        />

        <input
          type="number"
          placeholder="Age"
          value={profile.age}
          onChange={(e) =>
            setProfile({
              ...profile,
              age: e.target.value,
            })
          }
          className="w-full rounded-xl bg-zinc-950 p-4 text-white"
        />

        <input
          placeholder="Gender"
          value={profile.gender}
          onChange={(e) =>
            setProfile({
              ...profile,
              gender: e.target.value,
            })
          }
          className="w-full rounded-xl bg-zinc-950 p-4 text-white"
        />

        <input
          type="number"
          placeholder="Height (cm)"
          value={profile.height}
          onChange={(e) =>
            setProfile({
              ...profile,
              height: e.target.value,
            })
          }
          className="w-full rounded-xl bg-zinc-950 p-4 text-white"
        />

        <input
          type="number"
          placeholder="Weight (kg)"
          value={profile.weight}
          onChange={(e) =>
            setProfile({
              ...profile,
              weight: e.target.value,
            })
          }
          className="w-full rounded-xl bg-zinc-950 p-4 text-white"
        />

        <input
          placeholder="Activity Level"
          value={profile.activity_level}
          onChange={(e) =>
            setProfile({
              ...profile,
              activity_level: e.target.value,
            })
          }
          className="w-full rounded-xl bg-zinc-950 p-4 text-white"
        />

        <input
          type="number"
          placeholder="Daily Calorie Goal"
          value={profile.calorie_goal}
          onChange={(e) =>
            setProfile({
              ...profile,
              calorie_goal: e.target.value,
            })
          }
          className="w-full rounded-xl bg-zinc-950 p-4 text-white"
        />

        <button
          onClick={saveProfile}
          className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white"
        >
          Save Profile
        </button>

      </div>

    </main>
  );
}
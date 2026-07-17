"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileForm from "@/components/profile/ProfileForm";

import {
  Trophy,
  Flame,
  Target,
  HeartPulse,
} from "lucide-react";

export default function ProfilePage() {
  const [email, setEmail] = useState("");

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
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setEmail(user.email || "");

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!data) return;

    setProfile({
      full_name: data.full_name || "",
      age: data.age?.toString() || "",
      gender: data.gender || "",
      height: data.height?.toString() || "",
      weight: data.weight?.toString() || "",
      activity_level: data.activity_level || "",
      calorie_goal: data.calorie_goal?.toString() || "",
    });
  }

  async function saveProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
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
      .eq("id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Profile Updated Successfully");
  }

  const bmi =
    Number(profile.height) > 0 &&
    Number(profile.weight) > 0
      ? (
          Number(profile.weight) /
          Math.pow(Number(profile.height) / 100, 2)
        ).toFixed(1)
      : "--";

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 md:px-8">

      <div className="mx-auto max-w-7xl space-y-8">

        <ProfileHeader
          name={profile.full_name}
          email={email}
        />

        <ProfileStats
          height={Number(profile.height)}
          weight={Number(profile.weight)}
          calorieGoal={Number(profile.calorie_goal)}
          activity={profile.activity_level}
        />

        {/* Health Summary */}

        <section className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">

            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-white">

              <HeartPulse className="text-pink-500" />

              Health Summary

            </h2>

            <div className="space-y-5">

              <div className="flex justify-between">

                <span className="text-zinc-400">
                  BMI
                </span>

                <span className="font-bold text-white">
                  {bmi}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-zinc-400">
                  Daily Goal
                </span>

                <span className="font-bold text-white">
                  {profile.calorie_goal} kcal
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-zinc-400">
                  Activity
                </span>

                <span className="font-bold text-white">
                  {profile.activity_level}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-zinc-400">
                  Weight
                </span>

                <span className="font-bold text-white">
                  {profile.weight} kg
                </span>

              </div>

            </div>

          </div>

          {/* Achievements */}

          <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">

            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-white">

              <Trophy className="text-yellow-400" />

              Achievements

            </h2>

            <div className="space-y-4">

              <div className="rounded-xl bg-zinc-800 p-4">

                <div className="flex items-center gap-3">

                  <Flame className="text-orange-400" />

                  <div>

                    <p className="font-semibold text-white">
                      Nutrition Starter
                    </p>

                    <p className="text-sm text-zinc-400">
                      Completed your profile
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-xl bg-zinc-800 p-4">

                <div className="flex items-center gap-3">

                  <Target className="text-emerald-400" />

                  <div>

                    <p className="font-semibold text-white">
                      Goal Setter
                    </p>

                    <p className="text-sm text-zinc-400">
                      Daily calorie goal configured
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-xl bg-zinc-800 p-4">

                <div className="flex items-center gap-3">

                  <HeartPulse className="text-pink-500" />

                  <div>

                    <p className="font-semibold text-white">
                      Health Tracker
                    </p>

                    <p className="text-sm text-zinc-400">
                      Monitoring your BMI & weight
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        <ProfileForm
          profile={profile}
          setProfile={setProfile}
          saveProfile={saveProfile}
        />

      </div>

    </main>
  );
}







// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";

// export default function ProfilePage() {
//   const [profile, setProfile] = useState({
//     full_name: "",
//     age: "",
//     gender: "",
//     height: "",
//     weight: "",
//     activity_level: "",
//     calorie_goal: "",
//   });

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   async function loadProfile() {
// const {
//   data: { session },
// } = await supabase.auth.getSession();

// console.log("SESSION:", session);

// const user = session?.user;

// if (!user) {
//   alert("No user found");
//   return;
// }

//     if (!user) return;

//     const { data } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("id", user.id)
//       .single();

//     if (data) {
//       setProfile({
//         full_name: data.full_name || "",
//         age: data.age || "",
//         gender: data.gender || "",
//         height: data.height || "",
//         weight: data.weight || "",
//         activity_level: data.activity_level || "",
//         calorie_goal: data.calorie_goal || "",
//       });
//     }
//   }

// async function saveProfile() {
//   console.log("Save button clicked");

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   console.log("User:", user);

//   if (!user) {
//     alert("No user found");
//     return;
//   }

//   const { data, error } = await supabase
//     .from("profiles")
//     .update({
//       full_name: profile.full_name,
//       age: Number(profile.age),
//       gender: profile.gender,
//       height: Number(profile.height),
//       weight: Number(profile.weight),
//       activity_level: profile.activity_level,
//       calorie_goal: Number(profile.calorie_goal),
//     })
//     .eq("id", user.id)
//     .select();

//   console.log("Data:", data);
//   console.log("Error:", error);

//   if (error) {
//     alert(error.message);
//     return;
//   }

//   alert("Profile updated successfully!");
// }

//   return (
//     <main className="min-h-screen bg-zinc-950 p-8">

//       <h1 className="mb-8 text-4xl font-bold text-white">
//         My Profile
//       </h1>

//       <div className="space-y-5 rounded-3xl bg-zinc-900 p-8">

//         <input
//           placeholder="Full Name"
//           value={profile.full_name}
//           onChange={(e) =>
//             setProfile({
//               ...profile,
//               full_name: e.target.value,
//             })
//           }
//           className="w-full rounded-xl bg-zinc-950 p-4 text-white"
//         />

//         <input
//           type="number"
//           placeholder="Age"
//           value={profile.age}
//           onChange={(e) =>
//             setProfile({
//               ...profile,
//               age: e.target.value,
//             })
//           }
//           className="w-full rounded-xl bg-zinc-950 p-4 text-white"
//         />

//         <input
//           placeholder="Gender"
//           value={profile.gender}
//           onChange={(e) =>
//             setProfile({
//               ...profile,
//               gender: e.target.value,
//             })
//           }
//           className="w-full rounded-xl bg-zinc-950 p-4 text-white"
//         />

//         <input
//           type="number"
//           placeholder="Height (cm)"
//           value={profile.height}
//           onChange={(e) =>
//             setProfile({
//               ...profile,
//               height: e.target.value,
//             })
//           }
//           className="w-full rounded-xl bg-zinc-950 p-4 text-white"
//         />

//         <input
//           type="number"
//           placeholder="Weight (kg)"
//           value={profile.weight}
//           onChange={(e) =>
//             setProfile({
//               ...profile,
//               weight: e.target.value,
//             })
//           }
//           className="w-full rounded-xl bg-zinc-950 p-4 text-white"
//         />

//         <input
//           placeholder="Activity Level"
//           value={profile.activity_level}
//           onChange={(e) =>
//             setProfile({
//               ...profile,
//               activity_level: e.target.value,
//             })
//           }
//           className="w-full rounded-xl bg-zinc-950 p-4 text-white"
//         />

//         <input
//           type="number"
//           placeholder="Daily Calorie Goal"
//           value={profile.calorie_goal}
//           onChange={(e) =>
//             setProfile({
//               ...profile,
//               calorie_goal: e.target.value,
//             })
//           }
//           className="w-full rounded-xl bg-zinc-950 p-4 text-white"
//         />

//         <button
//           onClick={saveProfile}
//           className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white"
//         >
//           Save Profile
//         </button>

//       </div>

//     </main>
//   );
// }
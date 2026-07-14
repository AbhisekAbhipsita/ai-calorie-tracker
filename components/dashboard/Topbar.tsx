// "use client";

// import { Bell, Search, Moon, Sun, ChevronDown } from "lucide-react";
// import { useState } from "react";

// export default function Topbar() {
//   const [darkMode, setDarkMode] = useState(true);

//   return (
//     <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-zinc-950/80 px-8 backdrop-blur-xl">

//       {/* Left */}
//       <div>
//         <h1 className="text-2xl font-bold text-white">
//           Good Morning 👋
//         </h1>

//         <p className="text-sm text-zinc-400">
//           Welcome back to AI Nutrition Coach
//         </p>
//       </div>

//       {/* Right */}
//       <div className="flex items-center gap-5">

//         {/* Search */}
//         <div className="hidden lg:flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2">

//           <Search className="text-zinc-400" size={18} />

//           <input
//             placeholder="Search meals..."
//             className="bg-transparent outline-none text-white placeholder:text-zinc-500"
//           />

//         </div>

//         {/* Theme Button */}

//         <button
//           onClick={() => setDarkMode(!darkMode)}
//           className="rounded-xl border border-white/10 bg-zinc-900 p-3 transition hover:bg-zinc-800"
//         >
//           {darkMode ? (
//             <Sun className="text-yellow-400" size={18} />
//           ) : (
//             <Moon className="text-white" size={18} />
//           )}
//         </button>

//         {/* Notification */}

//         <button className="relative rounded-xl border border-white/10 bg-zinc-900 p-3 transition hover:bg-zinc-800">

//           <Bell className="text-white" size={18} />

//           <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>

//         </button>

//         {/* Profile */}

//         <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 transition hover:bg-zinc-800">

//           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-bold text-white">
//             A
//           </div>

//           <div className="hidden text-left lg:block">

//             <p className="text-sm font-semibold text-white">
//               Abhisek
//             </p>

//             <p className="text-xs text-zinc-400">
//               Premium
//             </p>

//           </div>

//           <ChevronDown
//             size={18}
//             className="text-zinc-400"
//           />

//         </button>

//       </div>

//     </header>
//   );
// }

"use client";

import { Bell, Search, Moon, Sun, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Topbar() {
  const [darkMode, setDarkMode] = useState(true);
  const [name, setName] = useState("User");

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (data?.full_name) {
      setName(data.full_name);
    }
  }

  const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning ☀️";
    if (hour < 17) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/90 backdrop-blur">

      <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">

        {/* Left */}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-white">
            {greeting()}
          </h1>

          <p className="mt-1 text-sm text-zinc-400">
            Welcome back, {name}
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Search */}
          <div className="hidden lg:flex w-72 items-center gap-3 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2">

            <Search
              size={18}
              className="text-zinc-500"
            />

            <input
              type="text"
              placeholder="Search meals..."
              className="w-full bg-transparent text-white placeholder:text-zinc-500 outline-none"
            />

          </div>

          {/* Theme */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-xl border border-white/10 bg-zinc-900 p-3 hover:bg-zinc-800"
          >
            {darkMode ? (
              <Sun
                size={18}
                className="text-yellow-400"
              />
            ) : (
              <Moon
                size={18}
                className="text-white"
              />
            )}
          </button>

          {/* Notification */}
          <button className="relative rounded-xl border border-white/10 bg-zinc-900 p-3 hover:bg-zinc-800">

            <Bell
              size={18}
              className="text-white"
            />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>

          </button>

          {/* Profile */}
          <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 hover:bg-zinc-800">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white font-bold">
              {name.charAt(0).toUpperCase()}
            </div>

            <div className="hidden md:block text-left">

              <p className="text-sm font-semibold text-white">
                {name}
              </p>

              <p className="text-xs text-zinc-400">
                AI Tracker
              </p>

            </div>

            <ChevronDown
              size={18}
              className="text-zinc-400"
            />

          </button>

        </div>

      </div>

    </header>
  );
}
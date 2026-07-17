// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   LayoutDashboard,
//   UtensilsCrossed,
//   ChartColumn,
//   Weight,
//   History,
//   Settings,
//   LogOut,
//   Sparkles,
// } from "lucide-react";

// const menu = [
//   {
//     title: "Dashboard",
//     icon: LayoutDashboard,
//     href: "/dashboard",
//   },
//   {
//     title: "Meals",
//     icon: UtensilsCrossed,
//     href: "/dashboard/meals",
//   },
//   {
//     title: "Analytics",
//     icon: ChartColumn,
//     href: "/dashboard/analytics",
//   },
//   {
//     title: "Weight",
//     icon: Weight,
//     href: "/dashboard/weight",
//   },
//   {
//     title: "History",
//     icon: History,
//     href: "/dashboard/history",
//   },
//   {
//     title: "Settings",
//     icon: Settings,
//     href: "/dashboard/settings",
//   },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <aside className="hidden md:flex h-screen w-72 flex-col border-r border-white/10 bg-zinc-950">
//       {/* Logo */}
//       <div className="flex items-center gap-3 border-b border-white/10 p-6">
//         <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 p-2">
//           <Sparkles className="h-6 w-6 text-white" />
//         </div>

//         <div>
//           <h1 className="text-lg font-bold text-white">
//             AI Nutrition
//           </h1>

//           <p className="text-xs text-zinc-400">
//             Coach
//           </p>
//         </div>
//       </div>

//       {/* Navigation */}
//       <div className="flex-1 p-4 space-y-2">
//         {menu.map((item) => {
//           const Icon = item.icon;

//           const active = pathname === item.href;

//           return (
//             <Link
//               key={item.title}
//               href={item.href}
//               className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
//                 active
//                   ? "bg-emerald-500 text-white shadow-lg"
//                   : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
//               }`}
//             >
//               <Icon size={20} />

//               <span>{item.title}</span>
//             </Link>
//           );
//         })}
//       </div>

//       {/* User Section */}
//       <div className="border-t border-white/10 p-5">
//         <div className="mb-5 flex items-center gap-3">
//           <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 font-bold text-white">
//             A
//           </div>

//           <div>
//             <p className="text-sm font-semibold text-white">
//               Abhisek
//             </p>

//             <p className="text-xs text-zinc-400">
//               Premium User
//             </p>
//           </div>
//         </div>

//         <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-white transition hover:bg-red-600">
//           <LogOut size={18} />
//           Logout
//         </button>
//       </div>
//     </aside>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  ChartColumn,
  Weight,
  History,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "History",
    icon: History,
    href: "/history",
  },
  {
    title: "Analytics",
    icon: ChartColumn,
    href: "/analytics",
  },
  {
    title: "Weight",
    icon: Weight,
    href: "/weight",
  },
  {
    title: "Profile",
    icon: Settings,
    href: "/profile",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
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

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-4 z-[60] rounded-xl bg-zinc-900 p-2 text-white shadow-lg md:hidden"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden ${
          open
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col
          border-r border-white/10
          bg-zinc-950
          shadow-2xl

          transform transition-transform duration-300 ease-in-out

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">

          <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-400 p-3">

            <Sparkles className="h-6 w-6 text-white" />

          </div>

          <div>

            <h1 className="text-xl font-bold text-white">
               Nutrixgenix 
            </h1>

            <p className="text-sm text-zinc-400">
              AI Nutrition Coach 
            </p>

          </div>

        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <div className="space-y-2">

            {menu.map((item) => {

              const Icon = item.icon;

              const active = pathname === item.href;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-3 font-medium transition-all duration-200 ${
                    active
                      ? "bg-emerald-500 text-white shadow-lg"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <Icon size={20} />

                  <span>{item.title}</span>

                </Link>
              );
            })}

          </div>

        </nav>

        {/* User */}
        <div className="border-t border-white/10 p-5">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">

              <p className="truncate font-semibold text-white">
                {name}
              </p>

              <p className="text-xs text-zinc-400">
                AI Nutrition Tracker
              </p>

            </div>

          </div>

          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-3 font-medium text-white transition hover:bg-red-600"
          >
            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>
    </>
  );
}
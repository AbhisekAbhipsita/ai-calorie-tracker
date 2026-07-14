"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import {
  LayoutDashboard,
  History,
  BarChart3,
  User,
  Scale,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "History",
      href: "/history",
      icon: History,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Weight",
      href: "/weight",
      icon: Scale,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-emerald-400">
          AI Tracker
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-emerald-500 text-white"
                  : "text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-white hover:bg-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

    </aside>
  );
}
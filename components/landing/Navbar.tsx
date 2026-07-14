"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { title: "Features", href: "#features" },
    { title: "How it Works", href: "#demo" },
    { title: "Pricing", href: "#pricing" },
    { title: "FAQ", href: "#faq" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-xl bg-gradient-to-r from-emerald-400 to-green-600 p-2 shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">
              AI Nutrition
            </h1>
            <p className="text-xs text-gray-400">
              Powered by Gemini
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm font-medium text-gray-300 transition hover:text-white"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl border border-white/20 px-5 py-2 text-sm text-white transition hover:bg-white/10"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white md:hidden"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/10 bg-black/80 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-4 p-6">
            {navItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-gray-300 transition hover:text-white"
              >
                {item.title}
              </Link>
            ))}

            <Link
              href="/login"
              className="rounded-xl border border-white/20 px-4 py-2 text-center text-white"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2 text-center font-semibold text-white"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
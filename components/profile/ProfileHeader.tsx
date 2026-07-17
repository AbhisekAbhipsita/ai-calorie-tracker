"use client";

import { User, Mail, Calendar, BadgeCheck } from "lucide-react";

interface Props {
  name: string;
  email: string;
}

export default function ProfileHeader({
  name,
  email,
}: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl">

      {/* Banner */}

      <div className="h-36 bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-500" />

      <div className="relative px-8 pb-8">

        {/* Avatar */}

        <div className="-mt-16 flex flex-col items-center md:flex-row md:items-end md:justify-between">

          <div className="flex flex-col items-center gap-4 md:flex-row">

            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-zinc-900 bg-emerald-500 text-5xl font-bold text-white shadow-xl">
              {name
                ? name.charAt(0).toUpperCase()
                : <User size={50} />}
            </div>

            <div className="text-center md:text-left">

              <div className="flex items-center justify-center gap-2 md:justify-start">

                <h1 className="text-3xl font-bold text-white">
                  {name || "Your Name"}
                </h1>

                <BadgeCheck
                  size={22}
                  className="text-emerald-400"
                />

              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-400 md:justify-start">

                <div className="flex items-center gap-2">

                  <Mail size={16} />

                  {email}

                </div>

                <div className="flex items-center gap-2">

                  <Calendar size={16} />

                  Nutrition Tracker User

                </div>

              </div>

            </div>

          </div>

          <button className="mt-6 rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600 md:mt-0">
            Edit Profile
          </button>

        </div>

      </div>

    </section>
  );
}
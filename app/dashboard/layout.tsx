"use client";

import { DashboardProvider } from "@/contexts/DashboardContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <DashboardProvider>

      <div className="flex min-h-screen bg-zinc-950">


        <main className="ml-64 flex-1 p-8">

          {children}

        </main>

      </div>

    </DashboardProvider>
  );
}
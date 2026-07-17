"use client";

import {
  Ruler,
  Weight,
  Flame,
  Activity,
  Target,
  HeartPulse,
} from "lucide-react";

interface Props {
  height: number;
  weight: number;
  calorieGoal: number;
  activity: string;
}

export default function ProfileStats({
  height,
  weight,
  calorieGoal,
  activity,
}: Props) {
  const bmi =
    height > 0 && weight > 0
      ? weight / Math.pow(height / 100, 2)
      : 0;

  function bmiStatus() {
    if (!bmi) return "--";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Healthy";
    if (bmi < 30) return "Overweight";
    return "Obese";
  }

  const cards = [
    {
      title: "Height",
      value: `${height || "--"} cm`,
      icon: Ruler,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Current Weight",
      value: `${weight || "--"} kg`,
      icon: Weight,
      color: "from-emerald-500 to-green-500",
    },
    {
      title: "Daily Calories",
      value: `${calorieGoal || "--"} kcal`,
      icon: Flame,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "BMI",
      value: bmi ? bmi.toFixed(1) : "--",
      subtitle: bmiStatus(),
      icon: HeartPulse,
      color: "from-pink-500 to-red-500",
    },
    {
      title: "Activity",
      value: activity || "--",
      icon: Activity,
      color: "from-violet-500 to-purple-500",
    },
    {
      title: "Goal Status",
      value:
        bmi && bmi < 25
          ? "Healthy"
          : "In Progress",
      icon: Target,
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-emerald-500/40"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${card.color}`}
            >
              <Icon className="text-white" size={26} />
            </div>

            <p className="mt-6 text-sm text-zinc-400">
              {card.title}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white break-words">
              {card.value}
            </h2>

            {card.subtitle && (
              <p className="mt-2 text-emerald-400">
                {card.subtitle}
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

import { DashboardProvider } from "@/contexts/DashboardContext";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

import SummaryCards from "@/components/dashboard/SummaryCard";
import GoalProgress from "@/components/dashboard/GoalProgress";
import DailyGoal from "@/components/dashboard/DailyGoal";
import WeightTracker from "@/components/dashboard/WeightTracker";
import MealInput from "@/components/dashboard/MealInput";
import TodayMeals from "@/components/dashboard/TodayMeals";
import WeightChart from "@/components/dashboard/WeightChart";
import AICoach from "@/components/dashboard/AICoach";
import GoalPace from "@/components/dashboard/GoalPace";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="animate-pulse text-lg text-white">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-zinc-950">

        <Sidebar />

        <div className="md:ml-72">

          <Topbar />

          <main className="min-h-screen overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">

            <div className="space-y-6">

              <SummaryCards />

              <GoalProgress />

              <AICoach />

              <DailyGoal />

              <WeightTracker />

              <GoalPace />

              <WeightChart />

              <MealInput />

              <TodayMeals />

            </div>

          </main>

        </div>

      </div>
    </DashboardProvider>
  );
}




// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../hooks/useAuth";

// import { DashboardProvider } from "@/contexts/DashboardContext";

// import Sidebar from "@/components/dashboard/Sidebar";
// import Topbar from "@/components/dashboard/Topbar";

// import SummaryCards from "@/components/dashboard/SummaryCard";
// import GoalProgress from "@/components/dashboard/GoalProgress";
// import DailyGoal from "@/components/dashboard/DailyGoal";
// import WeightTracker from "@/components/dashboard/WeightTracker";
// import MealInput from "@/components/dashboard/MealInput";
// import TodayMeals from "@/components/dashboard/TodayMeals";
// import WeightChart from "@/components/dashboard/WeightChart";
// import AICoach from "@/components/dashboard/AICoach";
// import GoalPace from "@/components/dashboard/GoalPace";
// // WeightHistory component unavailable; removed import to avoid module resolution error




// export default function DashboardPage() {
//   const router = useRouter();
//   const { user, loading } = useAuth();

//   useEffect(() => {
//     if (!loading && !user) {
//       router.replace("/login");
//     }
//   }, [loading, user, router]);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
//         Loading...
//       </div>
//     );
//   }

//   return (
//   <DashboardProvider>
//     <div className="flex min-h-screen bg-zinc-950">

//       <Sidebar />

//       <div className="flex flex-1 flex-col overflow-hidden">

//         <Topbar />

//         <main className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8">

//           <div className="mx-auto max-w-7xl space-y-8">

//             <SummaryCards />

//             <GoalProgress />

//             <AICoach />

//             <DailyGoal />

//             <WeightTracker />

//             <GoalPace />

//             <WeightChart />

//             <MealInput />

//             <TodayMeals />

//           </div>

//         </main>

//       </div>

//     </div>
//   </DashboardProvider>
// );
// }

//   return (
//     <DashboardProvider>
//       <div className="min-h-screen bg-zinc-950">

//         <Sidebar />

//         <div className="md:ml-72">

//           <Topbar />

//           <main className="space-y-8 p-4 md:p-8">

//             <SummaryCards />

//             <GoalProgress />

//             <DailyGoal />

//             <WeightTracker />

//             <MealInput />

//             <TodayMeals />

//           </main>

//         </div>

//       </div>
//     </DashboardProvider>
//   );
// }













// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../hooks/useAuth";

// import Sidebar from "@/components/layout/Sidebar";
// import Topbar from "@/components/dashboard/Topbar";
// import MealInput from "@/components/dashboard/MealInput";
// import TodayMeals from "@/components/dashboard/TodayMeals";
// import SummaryCards from "@/components/dashboard/SummaryCard";
// import { DashboardProvider } from "@/contexts/DashboardContext";
// import DailyGoal from "@/components/dashboard/DailyGoal";
// import WeightTracker from "@/components/dashboard/WeightTracker";
// import GoalProgress from "@/components/dashboard/GoalProgress";





// export default function DashboardPage() {
//   const router = useRouter();
//   const { user, loading } = useAuth();

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/login");
//     }
//   }, [loading, user, router]);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
//         Loading...
//       </div>
//     );
//   }
//---------------------------------
//   return (
//     <DashboardProvider>
//       <main className="min-h-screen bg-zinc-950 p-8">

//         <h1 className="mb-8 text-4xl font-bold text-white">
//            Dashboard
//         </h1>

//         <SummaryCards />

//         <GoalProgress />

//         <DailyGoal />

//         <WeightTracker />

//         <MealInput />

//         <TodayMeals />

//       </main>
//     </DashboardProvider>
//   );
// }

//the above return is original if any error occure take it as source
// return (
//     <DashboardProvider>
//       <main className="min-h-screen bg-zinc-950 p-8">
//         <Sidebar />
//         <h1 className="mb-8 text-4xl font-bold text-white">
//           Dashboard
//         </h1>

//         <SummaryCards />

//         <GoalProgress />

//         <DailyGoal />

//         <WeightTracker />

//         <MealInput />

//         <TodayMeals />

//       </main>
//     </DashboardProvider>
//   );
// }

//    return (
//     <DashboardProvider>
//       <div className="flex min-h-screen bg-zinc-950">

//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main Area */}
//         <div className="flex-1 ml-64">

//           {/* Topbar */}
//           <Topbar />

//           {/* Dashboard Content */}
//           <main className="p-8">

//             <h1 className="mb-8 text-4xl font-bold text-white">
//               Dashboard
//             </h1>

//             <SummaryCards />

//             <GoalProgress />

//             <DailyGoal />

//             <WeightTracker />

//             <MealInput />

//             <TodayMeals />

//           </main>

//         </div>

//       </div>
//     </DashboardProvider>
//   );
// }































































// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useAuth } from "../hooks/useAuth";


// import Sidebar from "@/components/dashboard/Sidebar";
// import Topbar from "@/components/dashboard/Topbar";
// import SummaryCard from "@/components/dashboard/SummaryCard";
// import MealInput from "@/components/dashboard/MealInput";








// import {
//   Flame,
//   Beef,
//   Weight,
//   Trophy,
// } from "lucide-react";



// export default function Dashboard() {
//     const router = useRouter();

// const { user, loading } = useAuth();

// useEffect(() => {
//   if (!loading && !user) {
//     router.push("/login");
//   }
// }, [loading, user, router]);

// if (loading) {
//   return (
//     <div className="flex min-h-screen items-center justify-center">
//       Loading...
//     </div>
//   );
// }    
//   return (
//     <div className="flex min-h-screen bg-[#09090B]">

//       <Sidebar />

//       <div className="flex-1">

//         <Topbar />

//         <main className="p-8">

//           {/* Summary Cards */}
//           <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

//             <SummaryCard
//               title="Calories"
//               value="0 kcal"
//               target="2200 kcal"
//               percent={0}
//               color="bg-orange-500"
//               icon={<Flame className="text-white" />}
//             />

//             <SummaryCard
//               title="Protein"
//               value="0 g"
//               target="150 g"
//               percent={0}
//               color="bg-green-500"
//               icon={<Beef className="text-white" />}
//             />

//             <SummaryCard
//               title="Weight"
//               value="74.2 kg"
//               target="70 kg"
//               percent={58}
//               color="bg-blue-500"
//               icon={<Weight className="text-white" />}
//             />

//             <SummaryCard
//               title="Goal"
//               value="0%"
//               target="Daily Goal"
//               percent={0}
//               color="bg-purple-500"
//               icon={<Trophy className="text-white" />}
//             />

//           </div>

//           {/* AI Meal Input */}
//           <MealInput />

//         </main>

//       </div>

//     </div>
//   );
// }
//---------------------------------------


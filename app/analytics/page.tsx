"use client";

import CaloriesChart from "@/components/analytics/CaloriesChart";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-zinc-950 overflow-hidden">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col md:ml-64">
        <Topbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-3xl font-bold text-white">
              Nutrition Analytics
            </h1>

            <CaloriesChart />
          </div>
        </main>
      </div>
    </div>
  );
}





// "use client";

// import CaloriesChart from "@/components/analytics/CaloriesChart";

// export default function AnalyticsPage() {
//   return (
//     <main className="min-h-screen overflow-x-hidden bg-zinc-950 p-4 md:p-8">
//       <div className="mx-auto w-full max-w-7xl">

//         <h1 className="mb-8 text-4xl font-bold text-white">
//           Nutrition Analytics
//         </h1>

//         <CaloriesChart />

//       </div>
//     </main>
//   );
// }
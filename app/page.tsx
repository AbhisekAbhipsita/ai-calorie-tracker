// import Navbar from "@/components/landing/Navbar";


// export default function Home() {
//   return (
//     <main className="min-h-screen bg-[#09090B]">
//       <Navbar />

//       <section className="flex min-h-screen items-center justify-center">
//         <h1 className="text-5xl font-bold text-white">
//           AI Nutrition Coach
//         </h1>
//       </section>
//     </main>
//   );
// }
//the above is original code any error back to that
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }

    checkUser();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      Loading...
    </div>
  );
}
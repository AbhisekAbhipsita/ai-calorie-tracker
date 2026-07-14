import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const router = useRouter();

async function logout() {
  await supabase.auth.signOut();
  router.push("/login");
}

<button
  onClick={logout}
  className="rounded-xl bg-red-500 px-4 py-2 text-white"
>
  Logout
</button>
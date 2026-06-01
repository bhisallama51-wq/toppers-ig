import { auth } from "@clerk/nextjs/server";
import { supabase } from "../lib/supabase";

export default async function DashboardPage() {
  const { userId } = await auth();

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!data) {
    return <h1>Profile not found</h1>;
  }

  if (!data.is_verified) {
    return (
      <main>
        <h1>Pending Approval</h1>
        <p>Your account is waiting for admin approval.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Welcome to Toppers IG</h1>

      <p>Email: {data.email}</p>
      <p>Role: {data.role}</p>
      <p>Verified: Yes</p>
    </main>
  );
}
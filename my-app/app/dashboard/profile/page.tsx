import { auth } from "@clerk/nextjs/server";
import { supabase } from "../../lib/supabase";

export default async function ProfilePage() {
  const { userId } = await auth();

  // safety check
  if (!userId) {
    return <h1>Please sign in</h1>;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return (
      <main>
        <h1>Profile not found</h1>
        <p>Check Supabase user_id match</p>
      </main>
    );
  }

  return (
    <main>
      <h1>My Profile</h1>

      <p>Name: {data.full_name}</p>
      <p>Email: {data.email}</p>
      <p>Role: {data.role}</p>
      <p>Verified: {data.is_verified ? "Yes" : "No"}</p>
    </main>
  );
}
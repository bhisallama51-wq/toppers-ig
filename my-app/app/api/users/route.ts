import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: Request) {
  const { userId } = await req.json();

  const { error } = await supabase
    .from("profiles")
    .update({ is_verified: true })
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error });
  }

  return NextResponse.json({ success: true });
}
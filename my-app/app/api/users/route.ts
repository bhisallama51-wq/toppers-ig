import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function GET() {
  const users = await clerkClient.users.getUserList();

  return NextResponse.json(users);
}
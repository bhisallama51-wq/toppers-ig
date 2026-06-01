"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ClerkUser = {
  id: string;
  fullName: string;
  email: string;
  image: string;
};

type Profile = {
  id: string;
  role: string;
  is_verified: boolean;
};

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  // 🔐 ADMIN CHECK
  useEffect(() => {
    async function checkAdmin() {
      if (!isLoaded) return;

      if (!user) {
        router.push("/");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (data?.role !== "admin") {
        router.push("/");
        return;
      }

      setAllowed(true);
    }

    checkAdmin();
  }, [isLoaded, user]);

  // 👥 FETCH REAL USERS (CLERK + SUPABASE MERGE)
  async function fetchUsers() {
    const clerkRes = await fetch("/api/users");
    const clerkUsers = await clerkRes.json();

    const { data: profiles } = await supabase.from("profiles").select("*");

    const merged = clerkUsers.map((cu: any) => {
      const profile = profiles?.find((p: any) => p.id === cu.id);

      return {
        id: cu.id,
        name: cu.fullName,
        email: cu.emailAddresses?.[0]?.emailAddress,
        image: cu.imageUrl,
        role: profile?.role || "student",
        is_verified: profile?.is_verified || false,
      };
    });

    setUsers(merged);
  }

  useEffect(() => {
    if (allowed) fetchUsers();
  }, [allowed]);

  // ⚙️ UPDATE SUPABASE ONLY
  async function updateUser(id: string, updates: Partial<Profile>) {
    await supabase.from("profiles").update(updates).eq("id", id);
    fetchUsers();
  }

  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        Checking permissions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* USERS TABLE */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gray-800">

                {/* USER */}
                <td className="p-3 flex items-center gap-3">
                  <img src={u.image} className="w-10 h-10 rounded-full" />

                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-sm text-gray-400">{u.email}</p>
                  </div>
                </td>

                {/* ROLE */}
                <td className="p-3 capitalize">{u.role}</td>

                {/* STATUS */}
                <td className="p-3">
                  {u.is_verified ? (
                    <span className="text-green-400">Verified</span>
                  ) : (
                    <span className="text-red-400">Not Verified</span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="p-3 flex gap-2">

                  {!u.is_verified && (
                    <button
                      onClick={() =>
                        updateUser(u.id, { is_verified: true })
                      }
                      className="bg-green-600 px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                  )}

                  {u.role === "student" && (
                    <button
                      onClick={() =>
                        updateUser(u.id, { role: "professor" })
                      }
                      className="bg-blue-600 px-3 py-1 rounded"
                    >
                      Promote
                    </button>
                  )}

                  {u.role === "professor" && (
                    <button
                      onClick={() =>
                        updateUser(u.id, { role: "admin" })
                      }
                      className="bg-purple-600 px-3 py-1 rounded"
                    >
                      Make Admin
                    </button>
                  )}

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
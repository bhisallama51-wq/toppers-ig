import { supabase } from "../../../lib/supabase";

export default async function UsersPage() {
  const { data: users, error } = await supabase
    .from("profiles")
    .select("*");

  return (
    <main style={{ padding: "20px" }}>
      <h1>Users Management</h1>

      {error && <p>Error loading users</p>}

      {users?.map((user) => (
        <div
          key={user.user_id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>
            Verified: {user.is_verified ? "Yes" : "No"}
          </p>
        </div>
      ))}
    </main>
  );
}
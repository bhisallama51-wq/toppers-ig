import { supabase } from "../../../lib/supabase";

export default async function UsersPage() {
  const { data: users, error } = await supabase
    .from("profiles")
    .select("*");

  return (
    <main style={{ padding: "20px" }}>
      <h1>Users Management</h1>

      {error && <p>Error loading users</p>}

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Verified</th>
          </tr>
        </thead>

        <tbody>
          {users?.map((user) => (
            <tr key={user.user_id}>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.is_verified ? "✅ Yes" : "❌ No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
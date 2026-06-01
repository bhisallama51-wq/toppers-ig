import Link from "next/link";

export default function Sidebar() {
  return (
    <div style={{ width: "250px", padding: "20px" }}>
      <h2>Toppers IG</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/profile">Profile</Link>
        <Link href="/dashboard/resources">Resources</Link>
        <Link href="/dashboard/community">Community</Link>
        <Link href="/dashboard/settings">Settings</Link>
        <Link href="/dashboard/admin">Admin</Link>
        <Link href="/dashboard/admin/users">Users</Link>
      </nav>
    </div>
  );
}
export default function EditProfilePage() {
  return (
    <main style={{ padding: "20px" }}>
      <h1>Edit Profile</h1>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "500px",
        }}
      >
        <input
          type="text"
          placeholder="Full Name"
          style={{ padding: "10px" }}
        />

        <input
          type="text"
          placeholder="Username"
          style={{ padding: "10px" }}
        />

        <textarea
          placeholder="Bio"
          rows={5}
          style={{ padding: "10px" }}
        />

        <button type="submit">
          Save Profile
        </button>
      </form>
    </main>
  );
}
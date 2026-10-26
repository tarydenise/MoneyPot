import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setName(snap.data().name);
        }
      } catch {
        setError("Could not load your profile.");
      }
      setLoading(false);
    }
    loadProfile();
  }, [user.uid]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name can't be empty.");
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { name: trimmed });
      await updateProfile(user, { displayName: trimmed });
      setName(trimmed);
      setMessage("Profile updated.");
    } catch {
      setError("Could not save your profile. Please try again.");
    }
    setSaving(false);
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Your Profile</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" value={user.email} disabled />
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
import { useState } from "react";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";

// Makes a random 6-character code like "K7M2QX"
function makeGroupCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function CreateGroupForm() {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState("");
  const [weeklyContribution, setWeeklyContribution] = useState("");
  const [numberOfMembers, setNumberOfMembers] = useState("");
  const [startDate, setStartDate] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const weekly = Number(weeklyContribution);
    const members = Number(numberOfMembers);

    if (weekly <= 0) {
      setError("Weekly contribution must be greater than 0.");
      return;
    }
    if (!Number.isInteger(members) || members < 2) {
      setError("A group needs at least 2 members.");
      return;
    }

    setSaving(true);
    try {
      const groupRef = doc(collection(db, "groups")); // creates a new ID
      await setDoc(groupRef, {
        groupId: groupRef.id,
        groupName,
        groupCode: makeGroupCode(),
        weeklyContribution: weekly,
        numberOfMembers: members,
        totalAmount: weekly * members,
        startDate: new Date(startDate + "T00:00:00"),
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        status: "active",
        currentPayoutIndex: 0,
      });
      setGroupName("");
      setWeeklyContribution("");
      setNumberOfMembers("");
      setStartDate("");
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  return (
    <div>
      <h2>Create a Group</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Weekly contribution ($)"
            value={weeklyContribution}
            onChange={(e) => setWeeklyContribution(e.target.value)}
            min="1"
            step="any"
            required
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Number of members"
            value={numberOfMembers}
            onChange={(e) => setNumberOfMembers(e.target.value)}
            min="2"
            required
          />
        </div>
        <div>
          <label>Start date: </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Create Group"}
        </button>
      </form>
    </div>
  );
}
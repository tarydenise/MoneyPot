import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../AuthContext";
import CreateGroupForm from "../components/CreateGroupForm";

export default function Dashboard() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "groups"), where("createdBy", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGroups(snapshot.docs.map((d) => d.data()));
    });
    return unsubscribe;
  }, [user.uid]);

  return (
    <div>
      <h1>MoneyPot</h1>
      <p>Welcome, {user.displayName || user.email}!</p>
      <button onClick={() => signOut(auth)}>Log Out</button>

      <CreateGroupForm />

      <h2>Your Groups</h2>
      {groups.length === 0 && <p>No groups yet.</p>}
      {groups.map((g) => (
        <div key={g.groupId} style={{ border: "1px solid gray", margin: "8px 0", padding: "8px" }}>
          <strong>{g.groupName}</strong>
          <div>Code: {g.groupCode}</div>
          <div>
            ${g.weeklyContribution}/week × {g.numberOfMembers} members = ${g.totalAmount} pot
          </div>
          <div>Starts: {g.startDate.toDate().toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
}
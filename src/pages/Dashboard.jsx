import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1>MoneyPot</h1>
      <p>Welcome, {user.displayName || user.email}!</p>
      <button onClick={() => signOut(auth)}>Log Out</button>
    </div>
  );
}
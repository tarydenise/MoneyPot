import { NavLink, Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Layout() {
  return (
    <div>
      <nav className="nav">
        <span className="brand">MoneyPot</span>
        <div className="nav-links">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <button className="link-button" onClick={() => signOut(auth)}>
            Log Out
          </button>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
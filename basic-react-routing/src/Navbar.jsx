import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/home" className="nav-link">
        Home
      </NavLink>
      <NavLink to="/aboutus" className="nav-link">
        About Us
      </NavLink>
      <NavLink to="/todos" className="nav-link">
        Todos
      </NavLink>
    </nav>
  );
}

export default Navbar;

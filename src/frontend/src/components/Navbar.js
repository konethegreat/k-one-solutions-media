import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from  '../utils/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to the login page
  };

  const links = [
    { to: "/", label: "Feed" },
    { to: "/profile", label: "Profile" },
    { to: "/notifications", label: "Notifications" },
    { to: "/messages", label: "Messages" },
    { to: "/search", label: "Search" } // Added Search link
  ];

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <ul className="navbar-list">
        {links.map((link, index) => (
          <li key={index}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
        {user ? (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};


export default Navbar;
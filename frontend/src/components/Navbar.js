import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

/**
 * Component for the navbar
 * @component shows a navbar that updates links based on userstatus
 */
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutAndRedirectHome = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <nav>
      <Link to="/profile">Profile</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign Up</Link>{" "}
      <button type="button" onClick={logoutAndRedirectHome}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;

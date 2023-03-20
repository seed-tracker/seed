import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { selectError } from "../store/authSlice";
/**
  The Login component is used for Login
**/
const Login = () => {
  const error = useSelector(selectError);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSubmit = async (evt) => {
    evt.preventDefault();
    await dispatch(login({ username, password }));
  };

  const redirect = () => {
    navigate("/profile");
  };

  return (
    <form onSubmit={handleLoginSubmit}>
      <div>
        <label htmlFor="username">
          <small>Username</small>
        </label>
        <input
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">
          <small>Password</small>
        </label>
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" onSubmit={redirect}>
        Login
      </button>
      {error && <div> {error} </div>}
    </form>
  );
};

export default Login;

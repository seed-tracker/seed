import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../store/authSlice";

/**
  The Login component is used for Login
**/
const Signup = () => {
  const { error } = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (evt) => {
    evt.preventDefault();
    await dispatch(
      signup({ username, password, email, name: fullName, birthdate })
    );
    navigate("/profile");
  };

  return (
    <form onSubmit={handleRegisterSubmit}>
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
      <div>
        <label htmlFor="email">
          <small>Email</small>
        </label>
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="fullName">
          <small>Full Name</small>
        </label>
        <input
          name="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="birthdate">
          <small>Birthdate</small>
        </label>
        <input
          name="birthdate"
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
      </div>
      <button type="submit">Signup</button>
      {error && <div> {error} </div>}
    </form>
  );
};

export default Signup;

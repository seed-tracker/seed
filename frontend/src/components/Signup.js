import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../store/authSlice";
import { selectError } from "../store/authSlice";

/**
  The Login component is used for Login
**/
const Signup = () => {
  const error = useSelector(selectError);
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
  };

  const redirect = () => {
    navigate("/profile");
  };

  return (
    <form onSubmit={handleRegisterSubmit}>
      <div>
        <label>
          <small>Username</small>
          <input
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          <small>
            Password <br />8 characters <br />
            at least 1 number <br />1 uppercase character <br />1 special
            character !@#$%^&*()
          </small>

          <input
            name="password"
            type="password"
            pattern="^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*()]).{8,}$"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          <small>Email</small>
          <input
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          <small>Full Name</small>
          <input
            name="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          <small>Birthdate</small>
          <input
            name="birthdate"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
        </label>
      </div>
      <button type="submit" onSubmit={redirect}>
        Create Account
      </button>
      {error && <div> {error} </div>}
    </form>
  );
};

export default Signup;

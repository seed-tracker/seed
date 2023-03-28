import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../store/authSlice";
import { selectError } from "../store/authSlice";
import Inputs from "./nextUI/Inputs";

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
      <Inputs
        type={"text"}
        required={true}
        label={"Username:"}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        helperText={"required"}
      />
      <Inputs
        type={"password"}
        required={true}
        label={"Password:"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        helperText={`required & format: 8 characters, at least 1 number, 1 uppercase character, 1 special character !@#$%^&*()`}
      />
      <Inputs
        type={"email"}
        required={true}
        label={"Email:"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        helperText={"required"}
      />
      <Inputs
        type={"text"}
        required={true}
        label={"Full Name:"}
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        helperText={"required"}
      />
      <Inputs
        type={"date"}
        label={"Date of Birth:"}
        value={birthdate}
        onChange={(e) => setBirthdate(e.target.value)}
      />
      <button type="submit" onSubmit={redirect}>
        Create Account
      </button>
      {error && <div> {error.toString()} </div>}
    </form>
  );
};

export default Signup;

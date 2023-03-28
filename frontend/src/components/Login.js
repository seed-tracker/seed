import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { selectError } from "../store/authSlice";
import { UserForm } from "./nextUI";
/**
  The Login component is used for Login
**/
const Login = () => {
  const error = useSelector(selectError);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSubmit = async () => {
    if (!username.length || !password.length) return;
    await dispatch(login({ username, password }));
  };

  const redirect = () => {
    navigate("/profile");
  };

  const inputs = [
    {
      name: "username",
      required: true,
      value: username,
      onChange: (e) => setUsername(e.target.value),
      helperText: "Username",
    },
    {
      name: "password",
      type: "password",
      required: true,
      value: password,
      onChange: (e) => setPassword(e.target.value),
      helperText: "Password",
    },
  ];

  return (
    <UserForm
      title="Login"
      inputs={inputs}
      description="Login form"
      onSubmit={handleLoginSubmit}
      error={error ? error.toString() : null}
    />
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { selectError, resetError } from "../store/authSlice";
import { UserForm } from "./nextUI";
/**
  The Login component is used for Login
**/
const Login = () => {
  const error = useSelector(selectError);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(login({ username, password }));
  };

  useEffect(() => {
    if (error && loading) setLoading(false);
  }, [error, loading]);

  const inputs = [
    {
      name: "username",
      required: true,
      value: username,
      onChange: (e) => setUsername(e.target.value),
      label: "Username",
    },
    {
      name: "password",
      type: "password",
      required: true,
      value: password,
      onChange: (e) => setPassword(e.target.value),
      label: "Password",
    },
  ];

  return (
    <UserForm
      title="Login"
      inputs={inputs}
      description="Login form"
      onSubmit={handleLoginSubmit}
      error={error ? error.toString() : null}
      loading={loading}
    />
  );
};

export default Login;

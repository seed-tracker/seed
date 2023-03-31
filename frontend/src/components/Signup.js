import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signup } from "../store/authSlice";
import { selectError } from "../store/authSlice";
import { UserForm } from "./nextUI";

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
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleRegisterSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    dispatch(signup({ username, password, email, name: fullName, birthdate }));
  };

  useEffect(() => {
    setUsername("");
    setPassword("");
    setEmail("");
    setBirthdate("");
    setFullName("");
    setLoading(false);
  }, []);

  useEffect(() => {
    if (error && loading) setLoading(false);
  }, [error, loading]);

  const inputs = [
    {
      name: "username",
      type: "text",
      required: true,
      value: username,
      onChange: (e) => setUsername(e.target.value),
      helperText: "required",
      label: "Username",
    },
    {
      name: "password",
      type: "password",
      required: true,
      value: password,
      onChange: (e) => setPassword(e.target.value),
      helperText: `8 characters, 1 number, 1 uppercase character, 1 special character`,
      label: "Password",
    },
    {
      name: "email",
      type: "email",
      required: true,
      value: email,
      onChange: (e) => setEmail(e.target.value),
      helperText: "required",
      label: "Email",
    },
    {
      name: "name",
      type: "text",
      required: true,
      value: fullName,
      onChange: (e) => setFullName(e.target.value),
      helperText: "required",
      label: "Full Name",
    },
    {
      name: "birthdate",
      type: "date",
      required: false,
      value: birthdate,
      onChange: (e) => setBirthdate(e.target.value),
      label: "Date of Birth",
    },
  ];

  return (
    <UserForm
      title="Sign up"
      inputs={inputs}
      description="Sign up form"
      onSubmit={handleRegisterSubmit}
      error={error}
      loading={loading}
    />
  );
};

export default Signup;

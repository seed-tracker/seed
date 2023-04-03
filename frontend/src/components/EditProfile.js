import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserForm } from "./nextUI";
import { me } from "../store/authSlice";
import apiClient from "../client";

// form for editing a user's name, email, and password
function EditProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { me: user } = useSelector((state) => state.auth);

  //validate and send a request to the server
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmationPassword) return;

    if (name.length && email.length) {
      setLoading(true);
      const newUserData = { name, email };
      if (password.length && newPassword.length) {
        newUserData.password = password;
        newUserData.newPassword = newPassword;
      }

      try {
        await apiClient.put("users/editProfile", newUserData);

        dispatch(me());

        navigate("/profile");
      } catch (err) {
        if (err.response.data.error) {
          setError(err.response.data.error);
        } else setError("Something went wrong");

        setLoading(false);
      }
    }
  };

  //update the form
  useEffect(() => {
    if (user && user.name) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  //inputs to pass as props to the user form template
  const inputs = [
    {
      name: "name",
      type: "text",
      required: true,
      value: name,
      onChange: (e) => setName(e.target.value),
      label: "Edit your name",
    },
    {
      name: "email",
      type: "email",
      required: true,
      value: email,
      onChange: (e) => setEmail(e.target.value),
      label: "Edit your email",
    },
    {
      name: "verify password",
      type: "password noregex",
      value: password,
      required: newPassword.length > 1,
      onChange: (e) => setPassword(e.target.value),
      label: "Current Password",
    },
    {
      name: "verify password",
      type: "password",
      value: newPassword,
      required: password.length > 1,
      onChange: (e) => setNewPassword(e.target.value),
      label: "New Password",
      helperText: `8 characters, 1 number, 1 uppercase character, 1 special character`,
    },
    {
      name: "verify password",
      type: "password",
      required: password.length > 1,
      value: confirmationPassword,
      onChange: (e) => setConfirmationPassword(e.target.value),
      label: "Confirm New Password",
      helperText:
        confirmationPassword === newPassword ? "" : "Passwords must match",
    },
  ];

  return (
    <UserForm
      title="Edit Profile"
      inputs={inputs}
      description="Form to edit profile details"
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
    />
  );
}

export default EditProfile;

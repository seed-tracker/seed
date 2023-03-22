import React, { useState } from "react";
import { editProfile } from "../store/entrySlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuthUser } from "../store";
import Sidebar from "./Sidebar";

function EditProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectAuthUser);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await dispatch(
      editProfile({ username: user.username, name, email, password })
    );
    navigate("/profile");
  };

  return (
    <main>
      <Sidebar />
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            required
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button type="submit">Save</button>
      </form>
    </main>
  );
}

export default EditProfile;

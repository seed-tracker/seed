import React, { useState } from "react";
import { editProfile } from "./entrySlice";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../store";

function EditProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const user = useSelector(selectAuthUser);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(editProfile({ username: user.username, name, email, password }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <button type="submit">Save</button>
    </form>
  );
}

export default EditProfile;
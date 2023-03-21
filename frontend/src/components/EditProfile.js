import React, { useState } from "react";
import { editProfile } from "./entrySlice";
import { useDispatch } from "react-redux";

function EditProfile({ username }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(editProfile({ username, name, email, password }));
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
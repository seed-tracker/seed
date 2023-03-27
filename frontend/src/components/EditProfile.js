
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { editProfile } from "../store/entrySlice";
import { selectAuthUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import apiClient from "../config";


function EditProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.me);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name.length && email.length) {
      const newUserData = { name, email };
      if (password.length) newUserData.password = password;
      await apiClient.put("users/editProfile", newUserData);

      navigate("/profile");
    }
  };

  useEffect(() => {
    if (user && user.name) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

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

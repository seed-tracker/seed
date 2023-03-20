import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { me } from "../store/authSlice";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Profile from "../components/Profile";
import SymptomForm from "../components/SymptomForm";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => !!state.auth.me.username);

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  return (
    <main>
      {isLoggedIn ? (
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/entry/add/symptom" element={<SymptomForm />} />
          <Route path="/*" />
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" />
        </Routes>
      )}
    </main>
  );
};

export default AppRoutes;

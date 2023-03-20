import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { me } from "../store/authSlice";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Profile from "../components/Profile";
<<<<<<< HEAD
import SymptomForm from "../components/SymptomForm";
=======
import Home from "../components/Home";
>>>>>>> 2b54fdc675909e2716b675a052a689dd3c77cf0b

const AppRoutes = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => !!state.auth.me._id);

  useEffect(() => {
    dispatch(me());
  }, []);

  return (
    <main>
      {isLoggedIn ? (
        <Routes>
          <Route path="/profile" element={<Profile />} />
<<<<<<< HEAD
          <Route path="/entry/add/symptom" element={<SymptomForm />} />
          <Route path="/*" />
=======
          <Route path="/*" element={<Home />} />
>>>>>>> 2b54fdc675909e2716b675a052a689dd3c77cf0b
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      )}
    </main>
  );
};

export default AppRoutes;

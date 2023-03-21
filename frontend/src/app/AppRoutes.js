import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { me } from "../store/authSlice";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Profile from "../components/Profile";
import Home from "../components/Home";
import Entry from "../components/MealForm";
import EditProfile from "../components/EditProfile";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => !!state.auth.me._id);

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  return (
    <main>
      {isLoggedIn ? (
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/*" element={<Home />} />
          <Route path="/user/addFood" element={<Entry />}></Route>
          <Route path="/user/editProfile" element={<EditProfile />}></Route>
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

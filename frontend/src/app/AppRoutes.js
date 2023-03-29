import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { me } from "../store/authSlice";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Profile from "../components/Profile";
import Home from "../components/Home";
import SymptomForm from "../components/SymptomForm";
import MealForm from "../components/MealForm";
import EditProfile from "../components/EditProfile";
import MealEntryOverview from "../components/MealEntryOverview";
import SymptomEntryOverview from "../components/SymtomEntryOverview";
import Dashboard from "../components/Dashboard";
import TopSymptoms from "../components/graph/TopSymptoms";
import Sidebar from "../components/Sidebar";
import { Container } from "@nextui-org/react";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => !!state.auth.me._id);

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  return (
    <main>
      {isLoggedIn ? (
        <Container
          display={"flex"}
          wrap
          justify={"space-between"}
          css={{ margin: 0, padding: 0 }}
        >
          <Sidebar />
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add/symptom" element={<SymptomForm />} />
            <Route path="/user/addFood" element={<MealForm />}></Route>
            <Route path="/user/edit-profile" element={<EditProfile />}></Route>
            <Route path="/user/meal-entries" element={<MealEntryOverview />} />
            <Route
              path="/user/symptom-entries"
              element={<SymptomEntryOverview />}
            />
            <Route path="/*" element={<Profile />} />
          </Routes>
        </Container>
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

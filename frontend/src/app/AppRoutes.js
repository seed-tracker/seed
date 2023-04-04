import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { me, logout } from "../store/authSlice";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Profile from "../components/Profile";
import Home from "../components/Home";
import SymptomForm from "../components/SymptomForm";
import MealForm from "../components/MealForm";
import EditProfile from "../components/EditProfile";
import MealEntryOverview from "../components/MealEntryOverview";
import SymptomEntryOverview from "../components/SymtomEntryOverview";
import Sidebar from "../components/Sidebar";
import Demo from "../components/Demo";
import { Container } from "@nextui-org/react";
import apiClient from "../client";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { me: user, error } = useSelector((state) => state.auth);
  const [hasUpdated, setHasUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  useEffect(() => {
    if (user.username) {
      if (!hasUpdated) {
        updateCorrelations();
        setHasUpdated(true);
      }
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      setLoading(false);
      logout();
    }
  }, [error]);

  const updateCorrelations = async () => {
    await apiClient.put("users/correlations/update");
  };

  return (
    <>
      {loading && !user.username ? (
        <Home />
      ) : (
        <>
          {user.username ? (
            <Container
              className="bookend"
              fluid
              responsive="false"
              display="flex"
              css={{
                margin: 0,
                padding: 0,
                minHeight: "100vh",
                width: "100vw",
              }}
            >
              <Sidebar />
              <Routes>
                <Route path="/profile" element={<Profile />} />
                <Route path="/demo/login" element={<Demo />} />
                <Route path="/add/symptom" element={<SymptomForm />} />
                <Route path="/user/addFood" element={<MealForm />}></Route>
                <Route
                  path="/user/edit-profile"
                  element={<EditProfile />}
                ></Route>
                <Route
                  path="/user/meal-entries"
                  element={<MealEntryOverview />}
                />

                <Route
                  path="/user/symptom-entries"
                  element={<SymptomEntryOverview />}
                />
                <Route path="/*" element={<Profile />} />
              </Routes>
            </Container>
          ) : (
            <Container
              fluid
              responsive={"false"}
              css={{ margin: 0, padding: 0 }}
              className="bookend"
            >
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/demo/login" element={<Demo />} />
                <Route path="/*" element={<Home />} />
              </Routes>
            </Container>
          )}
        </>
      )}
    </>
  );
};

export default AppRoutes;

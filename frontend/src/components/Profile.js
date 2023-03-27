import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { me } from "../store/authSlice";
import BubbleChart from "./graph/BubbleChart";
import Sidebar from "./Sidebar";
import ScatterPlot from "./graph/ScatterPlot";

/**
 * Placeholder component for the userprofile page
 * @component shows "profile"
 */
const Profile = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  return (
    <main>
      <Sidebar />
      <h2>PROFILE INFO WOULD GO HERE</h2>
      <section>
        <BubbleChart />
        <ScatterPlot />
      </section>
    </main>
  );
};

export default Profile;

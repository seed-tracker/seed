import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { me } from "../store/authSlice";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import ScatterPlot from "./graph/ScatterPlot";
import StatsAndFacts from "./StatsAndFacts";
import {
  fetchUserCorrelations,
  selectUserCorrelations,
} from "../store/correlationsSlice";
import CirclePacking from "./graph/CirclePacking";
import Beeswarm from "./graph/Beeswarm";

/**
 * Placeholder component for the userprofile page
 * @component shows "profile"
 */
const Profile = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserCorrelations());
  }, []);

  const correlationsLoaded = useSelector(selectUserCorrelations);

  return (
    <main>
      <Sidebar />
      <section>
        <StatsAndFacts />
      </section>
      <section>
        <CirclePacking />
      </section>
      <section>
        <Beeswarm />
        <ScatterPlot />
      </section>
      <section>{!correlationsLoaded && <CirclePacking />}</section>
    </main>
  );
};

export default Profile;

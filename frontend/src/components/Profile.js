import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { me } from "../store/authSlice";
import { useSelector } from "react-redux";
import ScatterPlot from "./graph/ScatterPlot";
import StatsAndFacts from "./StatsAndFacts";
import {
  fetchUserCorrelations,
  selectUserCorrelations,
} from "../store/correlationsSlice";
import CirclePacking from "./graph/CirclePacking";

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
      {/* <Sidebar /> */}
      <StatsAndFacts />
      <section>
        <ScatterPlot />
      </section>
        <CirclePacking />
      <section>{!correlationsLoaded && <CirclePacking />}</section>
    </main>
  );
};

export default Profile;

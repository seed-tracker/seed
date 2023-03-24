import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import BubbleChart from "./graph/BubbleChart";
import Sidebar from "./Sidebar";
import StatsAndFacts from "./StatsAndFacts";
import {
  fetchUserCorrelations,
  selectUserCorrelations,
} from "../store/correlationsSlice";

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

      <section>{!!correlationsLoaded && <BubbleChart />}</section>
    </main>
  );
};

export default Profile;

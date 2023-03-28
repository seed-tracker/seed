import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ScatterPlot from "./graph/ScatterPlot";
import StatsAndFacts from "./StatsAndFacts";
import {
  fetchUserCorrelations,
  selectUserCorrelations,
} from "../store/correlationsSlice";
import TopFoods from "./graph/TopFoods";

/**
 * Placeholder component for the userprofile page
 * @component shows "profile"
 */
const Profile = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserCorrelations());
  }, [dispatch]);

  const correlationsLoaded = useSelector(selectUserCorrelations);
  console.log(correlationsLoaded);

  return (
    <main>
    {correlationsLoaded && correlationsLoaded.length > 0 ? (
      <>
        <ScatterPlot />
        <TopFoods />
        <section>{!correlationsLoaded && <TopFoods />}</section>
      </>
    ) : (
      <section>
        <StatsAndFacts />
      </section>
    )
    }
    </main>
  );
};

export default Profile;

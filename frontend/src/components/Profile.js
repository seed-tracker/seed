import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ScatterPlot from "./graph/ScatterPlot";
import CirclePacking from "./graph/CirclePacking";
import TopSymptoms from "./graph/TopSymptoms";
import TopFoods from "./graph/TopFoods";
import StatsAndFacts from "./StatsAndFacts";
import { fetchUserCorrelations } from "../store/correlationsSlice";

import { Container, Text } from "@nextui-org/react";
import { PageLoading, Dropdown } from "./nextUI";

/**
 * Placeholder component for the userprofile page
 * @component shows "profile" if the user has logged enough entries to have data to show, otherwise, shows a randomly generated quote from an API
 */
const Profile = () => {
  const [loading, setLoading] = useState(true);

  const graphArray = [
    <ScatterPlot />,
    <CirclePacking />,
    <TopSymptoms />,
    <TopFoods />,
  ];
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserCorrelations());
    setLoading(true);
  }, [dispatch]);

  const { data: correlationsLoaded, error } = useSelector(
    (state) => state.correlations
  );

  useEffect(() => {
    if (error || correlationsLoaded.length > 1) {
      setLoading(false);
    }
  }, [correlationsLoaded, error]);

  return (
    <Container
      display={"flex"}
      justify="center"
      align="center"
      css={{ margin: 0, padding: 0, maxWidth: "72vw" }}
    >
      {loading ? (
        <PageLoading text="Getting your results..." />
      ) : (
        <>
          {correlationsLoaded && correlationsLoaded.length > 0 ? (
            <>
              <h1>
                Need to add dropdown menu for users to select from other graph
                options
              </h1>
              {graphArray[Math.floor(Math.random() * 5)]}
            </>
          ) : (
            <Container
              display={"flex"}
              justify="center"
              align="center"
              css={{ margin: 0, padding: 0, maxWidth: "72vw" }}
            >
              {error === "No data found" && (
                <Text>
                  We don't have enough data to create associations yet, but keep
                  logging!
                </Text>
              )}
              <StatsAndFacts />
            </Container>
          )}
        </>
      )}
    </Container>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ScatterPlot from "./graph/ScatterPlot";
import StatsAndFacts from "./StatsAndFacts";
import {
  fetchUserCorrelations,
  selectUserCorrelations,
} from "../store/correlationsSlice";
import TopFoods from "./graph/TopFoods";
import { Loading, Container, Text } from "@nextui-org/react";
import { PageLoading } from "./nextUI";

/**
 * Placeholder component for the userprofile page
 * @component shows "profile" if the user has logged enough entries to have data to show, otherwise, shows a randomly generated quote from an API
 */
const Profile = () => {
  const [loading, setLoading] = useState(true);

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
    <Container fluid>
      {loading ? (
        <PageLoading text="Getting your results..." />
      ) : (
        <>
          {correlationsLoaded && correlationsLoaded.length > 0 ? (
            <>
              <ScatterPlot />
              <TopFoods />
              <section>{!correlationsLoaded && <TopFoods />}</section>
            </>
          ) : (
            <Container
              fluid
              justify="center"
              align="center"
              style={{ marginTop: "3rem" }}
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

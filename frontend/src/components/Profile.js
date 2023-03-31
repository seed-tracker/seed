import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ScatterPlot from "./graph/ScatterPlot";
import CirclePacking from "./graph/CirclePacking";
import TopSymptoms from "./graph/TopSymptoms";
import TopFoods from "./graph/TopFoods";
import StatsAndFacts from "./StatsAndFacts";
import { fetchUserCorrelations } from "../store/correlationsSlice";
import { Container, Text, Button } from "@nextui-org/react";
import { PageLoading, HeaderText } from "./nextUI";
import { fetchAllSymptoms } from "../store/symptomSlice";
import { fetchScatterData } from "../store/scatterSlice";
import { getUserStats } from "../store/statsSlice";
import { fetchAllFoodGroups } from "../store/foodGroupsSlice";
import { Card } from "@nextui-org/react";
/**
 * Placeholder component for the userprofile page
 * @component shows "profile" if the user has logged enough entries to have data to show, otherwise, shows a randomly generated quote from an API
 */
const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [graphIdx, setGraphIdx] = useState(0);

  const { data: scatterData, error: scatterError } = useSelector(
    (state) => state.scatter
  );
  const { data: correlationsLoaded, error } = useSelector(
    (state) => state.correlations
  );

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch(fetchUserCorrelations());
    dispatch(fetchAllSymptoms());
    dispatch(fetchScatterData());
    dispatch(getUserStats("all"));
    dispatch(fetchAllFoodGroups());
  }, [dispatch]);

  useEffect(() => {
    if (error || correlationsLoaded.length) {
      setLoading(false);
    }
  }, [correlationsLoaded, error]);

  const getDisplay = (idx) => {
    return idx === graphIdx ? "" : "none";
  };
  const buttonMargin = { marginRight: "0.5rem" };

  const getCss = (idx) => {
    if (idx === graphIdx) {
      return {
        backgroundColor: "#7a918d",
        color: "white",
      };
    } else {
      return {
        backgroundColor: "#7a918d",
        color: "white",
      };
    }
  };

  return (
    <Container
      display="flex"
      justify="center"
      align="center"
      css={{
        "@xs": {
          margin: 0,
          maxWidth: "100vw",
        },
        "@sm": {
          maxWidth: "80vw",
          margin: 0,
          alignContent: "flex-start",
        },
      }}
    >
      {loading ? (
        <PageLoading text="Getting your results..." />
      ) : (
        <>
          {correlationsLoaded && correlationsLoaded.length > 0 ? (
            <Container
              display="flex"
              direction="column"
              justify="center"
              align="center"
              css={{
                "@xs": {
                  margin: 0,
                  width: "100vw",
                },
                "@sm": { margin: "2rem 0", alignSelf: "flex-end" },
              }}
            >
              <Container
                display="flex"
                direction="row"
                justify="center"
                align="center"
              >
                {scatterData && scatterData.length > 0 && (
                  <Button
                    onClick={() => setGraphIdx(0)}
                    type="button"
                    aria-label="Button to show the top associations graph"
                    css={{ ...getCss(0), ...buttonMargin }}
                  >
                    Top Associations
                  </Button>
                )}
                <Button
                  onClick={() => setGraphIdx(1)}
                  type="button"
                  aria-label="Button to show the Food/Symptom Relationships graph"
                  css={{ ...getCss(1), ...buttonMargin }}
                >
                  Food/Symptom Relationships
                </Button>
                <Button
                  onClick={() => setGraphIdx(2)}
                  type="button"
                  aria-label="Button to show the top foods graph"
                  css={{ ...getCss(2), ...buttonMargin }}
                >
                  Top Foods
                </Button>
                <Button
                  onClick={() => setGraphIdx(3)}
                  type="button"
                  aria-label="Button to show the top symptoms graph"
                  css={{ ...getCss(3), ...buttonMargin }}
                >
                  Top Symptoms
                </Button>
              </Container>

              <Card
                className="glassmorpheus-graph"
                css={{
                  overflow: "auto",
                  width: "auto",
                  padding: "1rem",
                  marginTop: "1rem",
                }}
              >
                <section style={{ display: getDisplay(0) }}>
                  <ScatterPlot />
                </section>
                <section style={{ display: getDisplay(1) }}>
                  <CirclePacking />
                </section>
                <section style={{ display: getDisplay(2) }}>
                  <TopFoods />
                </section>
                <section style={{ display: getDisplay(3) }}>
                  <TopSymptoms />
                </section>
              </Card>
            </Container>
          ) : (
            <Container
              display={"flex"}
              justify="center"
              align="center"
              css={{ margin: "2rem", padding: 0, maxWidth: "72vw" }}
            >
              {error === "No data found" && (
                <HeaderText
                  text=" We don't have enough data to create associations yet, but keep
                logging!"
                />
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

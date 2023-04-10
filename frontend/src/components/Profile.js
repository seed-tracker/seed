import { Button, Card, Container } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserCorrelations } from "../store/correlationsSlice";
import { fetchAllFoodGroups } from "../store/foodGroupsSlice";
import { fetchScatterData } from "../store/scatterSlice";
import { getUserStats } from "../store/statsSlice";
import AssociationList from "./mobile/AssociationList";
import { fetchAllSymptoms } from "../store/symptomSlice";
import StatsAndFacts from "./StatsAndFacts";
import CirclePacking from "./graph/CirclePacking";
import ScatterPlot from "./graph/ScatterPlot";
import TopFoods from "./graph/TopFoods";
import TopSymptoms from "./graph/TopSymptoms";
import { HeaderText, PageLoading } from "./nextUI";

/**
 * Placeholder component for the userprofile page
 * @component shows "profile" if the user has logged enough entries to have data to show, otherwise, shows a randomly generated quote from an API
 */
const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [graphIdx, setGraphIdx] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  //keep track of window width for resizing the svg
  useEffect(() => {
    window.addEventListener("resize", updateSize);
    window.addEventListener("orientationchange", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("orientationchange", updateSize);
    };
  }, []);

  const updateSize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };

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
  const buttonMargin = { marginRight: "0.5rem", marginTop: "1vh" };

  const getCss = (idx) => {
    const isActive = idx === graphIdx;
    return {
      backgroundColor: isActive ? "#4c6357" : "#7a918d",
      color: "white",
      "&:active": {
        backgroundColor: isActive ? "#2d3b33" : "#4c6357",
      },
      marginRight: "0.5rem",
    };
  };

  return (
    <Container
      display="flex"
      align="flex-start"
      justify="flex-start"
      css={{
        "@xs": {
          margin: 0,
          maxWidth: "100vw",
          alignContent: "flex-start",
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
            <>
              {" "}
              {windowSize.width >= 750 ? (
                <Container
                  display="flex"
                  direction="column"
                  justify="center"
                  align="center"
                  css={{
                    "@xs": {
                      alignSelf: "flex-start",
                      margin: 0,
                      maxWidth: "100vw",
                    },
                    "@sm": {
                      margin: "2rem 0",
                      alignSelf: "flex-start",
                      maxWidth: "90vw",
                    },
                  }}
                >
                  <Container
                    display="flex"
                    direction="row"
                    wrap="wrap"
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
                      minWidth: "70vw",
                      maxWidth: "100vw",
                      display: "inline",
                      height: "fit-content",
                      width: "fit-content",
                      marginBottom: "2vw",
                    }}
                  >
                    <section style={{ display: getDisplay(0) }}>
                      <ScatterPlot windowSize={windowSize} />
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
                <AssociationList windowSize={windowSize} />
              )}
            </>
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

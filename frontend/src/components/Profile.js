import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ScatterPlot from "./graph/ScatterPlot";
import CirclePacking from "./graph/CirclePacking";
import TopSymptoms from "./graph/TopSymptoms";
import TopFoods from "./graph/TopFoods";
import StatsAndFacts from "./StatsAndFacts";
import { fetchUserCorrelations } from "../store/correlationsSlice";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Container, Text, Button } from "@nextui-org/react";
import { PageLoading, HeaderText } from "./nextUI";

/**
 * Placeholder component for the userprofile page
 * @component shows "profile" if the user has logged enough entries to have data to show, otherwise, shows a randomly generated quote from an API
 */
const Profile = () => {
  const [loading, setLoading] = useState(true);

  const graphArray = [
    "/scatter-plot",
    "/circle-packing",
    "/top-symptoms",
    "/top-foods",
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchUserCorrelations());
    setLoading(true);
  }, [dispatch]);

  const { data: correlationsLoaded, error } = useSelector(
    (state) => state.correlations
  );

  useEffect(() => {
    if (error || correlationsLoaded.length) {
      setLoading(false);
      if (correlationsLoaded.length) {
        const idx = Math.floor(Math.random() * 4);
        const graphToShow = graphArray[idx];
        navigate(`${graphToShow}`);
      }
    }
  }, [correlationsLoaded, error]);

  return (
    <Container
      display={"flex"}
      justify="center"
      align="center"
      wrap={"wrap"}
      css={{
        "@xs": {
          margin: 0,
          width: "100vw",
        },
        "@sm": {
          maxWidth: "67vw",
        },
      }}
    >
      {loading ? (
        <PageLoading text="Getting your results..." />
      ) : (
        <>
          {correlationsLoaded && correlationsLoaded.length > 0 ? (
            <Button.Group
              color="primary"
              bordered
              ghost
              css={{
                margin: "1rem",
                maxWidth: "67vw",
              }}
            >
              <Button
                onClick={() => navigate("/circle-packing")}
                type="button"
                aria-label="Button to show the Food/Symptom Relationships graph"
              >
                Food/Symptom Relationships
              </Button>
              <Button
                onClick={() => navigate("/scatter-plot")}
                type="button"
                aria-label="Button to show the top associations graph"
              >
                Top Associations
              </Button>
              <Button
                onClick={() => navigate("/top-foods")}
                type="button"
                aria-label="Button to show the top foods graph"
              >
                Top Foods
              </Button>
              <Button
                onClick={() => navigate("/top-symptoms")}
                type="button"
                aria-label="Button to show the top symptoms graph"
              >
                Top Symptoms
              </Button>
            </Button.Group>
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
      <Routes>
        <Route path="/circle-packing" element={<CirclePacking />} />
        <Route path="/scatter-plot" element={<ScatterPlot />} />
        <Route path="/top-foods" element={<TopFoods />} />
        <Route path="/top-symptoms" element={<TopSymptoms />} />
      </Routes>
    </Container>
  );
};

export default Profile;

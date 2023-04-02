import { useState, useEffect } from "react";
import { Grid, Switch, Text, Button, Spacer } from "@nextui-org/react";
import { HeaderText, PageLoading } from "../nextUI";
import { useSelector } from "react-redux";
import AssociationCard from "./AssociationCard";
import ScatterPlotMobile from "./ScatterMobile";

const AssociationList = () => {
  const { correlations } = useSelector((state) => state);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [showFoods, setShowFoods] = useState(true);
  const [showGroups, setShowGroups] = useState(false);
  const [data, setData] = useState([]);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  window.addEventListener("resize", () => setScreenHeight(window.innerHeight));
  //initialize once correlations load
  useEffect(() => {
    //if the correlations are empty or already showing, return
    if (
      !correlations ||
      !correlations.data.length > 0 ||
      currentSymptom.length > 0
    )
      return;

    setCurrentSymptom(correlations.data[0].symptom);

    if (!correlations.data[0].top_foods) {
      setShowFoods(null);
      setShowGroups(true);
    }

    if (!correlations.data[0].top_groups) {
      setShowGroups(null);
    }
  }, [correlations]);

  useEffect(() => {
    if (!currentSymptom.length) return;

    let updated = [];
    let symptomData = correlations.data.find(
      ({ symptom }) => symptom === currentSymptom
    );

    if (showFoods) updated = [...symptomData.top_foods];

    if (showGroups) updated = [...updated, ...symptomData.top_groups];

    updated = updated.sort((a, b) => b.lift - a.lift);

    setData(updated);
  }, [showFoods, showGroups]);

  useEffect(() => {
    if (!currentSymptom.length > 0) return;

    let newSymptomData = correlations.data.find(
      ({ symptom }) => symptom === currentSymptom
    );

    let temp = [];

    if (newSymptomData.top_foods) {
      setShowFoods(true);

      if (!newSymptomData.top_groups) setShowGroups(null);
      else setShowGroups(false);

      temp = [...newSymptomData.top_foods];
    } else {
      setShowFoods(null);
      setShowGroups(true);

      temp = [...newSymptomData.top_groups];
    }

    temp = temp.sort((a, b) => b.lift - a.lift);

    setData(temp);
  }, [currentSymptom]);

  return (
    <>
      {currentSymptom.length > 0 ? (
        <Grid.Container
          justify="center"
          align="center"
          gap={1.5}
          css={{ mb: "4rem", mt: "1rem" }}
        >
          <Grid>
            <HeaderText text="Your top associations" />
            <Text h4>Ordered by strongest relationship</Text>
            {screenHeight >= 600 && (
              <Text>Turn your device sideways to see more detail!</Text>
            )}
          </Grid>
          <Grid xs={12} justify="center" align="center">
            <Text>Symptoms:</Text>
          </Grid>
          {correlations.data?.map(({ symptom }) => (
            <Grid xs={7} md={6} justify="center" align="center">
              <Button
                color={symptom === currentSymptom ? "primary" : "white"}
                onPress={() => setCurrentSymptom(symptom)}
              >
                {symptom}
              </Button>
            </Grid>
          ))}
          {showFoods !== null && showGroups !== null && (
            <>
              <Grid xs={6} justify="center" align="center">
                <Switch
                  checked={showFoods}
                  onChange={() => setShowFoods(!showFoods)}
                />
                <Spacer x={0.5} />
                <Text>Show foods</Text>
              </Grid>
              <Grid xs={6} justify="center" align="center">
                <Switch
                  checked={showGroups}
                  onChange={() => setShowGroups(!showGroups)}
                />
                <Spacer x={0.5} />
                <Text>Show groups</Text>
              </Grid>
            </>
          )}
          {data.map((item) => {
            const { lift, avg_severity, total_count, name } = item;

            return (
              <Grid xs={11}>
                <AssociationCard
                  name={name}
                  count={total_count}
                  avg_severity={avg_severity}
                  symptom={currentSymptom}
                />
              </Grid>
            );
          })}
          <Text h5 css={{ mt: "2rem" }}>
            {screenHeight < 600 &&
              "Login on a larger device to see more detail!"}
          </Text>
        </Grid.Container>
      ) : null}
    </>
  );
};

export default AssociationList;
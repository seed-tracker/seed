import { useState, useEffect } from "react";
import { Grid, Switch, Text, Button, Spacer } from "@nextui-org/react";
import { HeaderText } from "../nextUI";
import { useSelector } from "react-redux";
import AssociationCard from "./AssociationCard";

// A list of foods that are most associated with top symptoms
//replaces graphs in mobile view, or any screens/browser under 750px in width
const AssociationList = ({ windowSize }) => {
  const { correlations } = useSelector((state) => state);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [showFoods, setShowFoods] = useState(true);
  const [showGroups, setShowGroups] = useState(false);
  const [data, setData] = useState([]);

  //detect whether it's a mobile device, used to update message to the user
  function detectMobile() {
    const devices = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];

    return devices.some((device) => navigator.userAgent.match(device));
  }

  const isMobile = detectMobile();

  //initialize once correlations load
  useEffect(() => {
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

  //update when the user toggles whether foods and/or groups are showing
  useEffect(() => {
    if (!currentSymptom.length) return;

    let updated = [];
    let symptomData = correlations.data.find(
      ({ symptom }) => symptom === currentSymptom
    );

    if (showFoods) updated = [...symptomData.top_foods];

    if (showGroups) updated = [...updated, ...symptomData.top_groups];
    if (!updated.length) return;
    updated = updated.sort((a, b) => b.lift - a.lift);

    setData(updated);
  }, [showFoods, showGroups]);

  //update when user changes the symptom
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
          </Grid>
          <Grid xs={12} justify="center" align="center">
            <Text>Symptoms:</Text>
          </Grid>
          {correlations.data?.map(({ symptom }, i) => (
            <Grid xs={7} md={6} justify="center" align="center" key={i}>
              <Button
                color={symptom === currentSymptom ? "primary" : "$white"}
                onPress={() => setCurrentSymptom(symptom)}
              >
                <Text color={symptom === currentSymptom ? "" : "black"}>
                  {symptom}
                </Text>
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
          {data.map((item, i) => {
            const { lift, avg_severity, total_count, name } = item;

            return (
              <Grid xs={11} key={i}>
                <AssociationCard
                  name={name}
                  count={total_count}
                  avg_severity={avg_severity}
                  symptom={currentSymptom}
                  windowSize={windowSize}
                />
              </Grid>
            );
          })}
          {!(windowSize.height >= 750 && isMobile) && (
            <Text h5 css={{ mt: "2rem" }}>
              {window.screen.width >= 750
                ? "Expand the browser to see more detail!"
                : "Log in on a larger device to see more detail!"}
            </Text>
          )}{" "}
          {windowSize.height >= 750 && isMobile && (
            <Text>Turn your device sideways to see more detail!</Text>
          )}
        </Grid.Container>
      ) : null}
    </>
  );
};

export default AssociationList;

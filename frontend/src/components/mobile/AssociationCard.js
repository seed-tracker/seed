import { Card, Grid, Text, Button } from "@nextui-org/react";
import ScatterPlotMobile from "./ScatterMobile";
import { useState } from "react";

//A card in the association list for mobile view, with details on the relationship between a given food and symptoms
//shows a collapsable, mini version of the connected scatter graph
const AssociationCard = ({
  name,
  count,
  avg_severity,
  symptom,
  windowSize,
}) => {
  return (
    <Card>
      <Card.Header>
        <Text h3 css={{ textAlign: "left" }}>
          {name}
        </Text>
      </Card.Header>
      <Card.Divider />
      <Card.Body>
        <Text>Recorded {count} times total</Text>
        <Text>
          Average severity of {symptom.toLowerCase()} when recorded after eating{" "}
          {name.toLowerCase()}: {avg_severity}
        </Text>
      </Card.Body>
      <Card.Divider />
      <ScatterPlotMobile
        currentSymptom={symptom}
        item={name}
        windowSize={windowSize}
      />
    </Card>
  );
};

export default AssociationCard;

import { Card, Grid, Text, Button } from "@nextui-org/react";
import ScatterPlotMobile from "./ScatterMobile";
import { useState } from "react";

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
          Average {symptom.toLowerCase()} severity after eating: {avg_severity}
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

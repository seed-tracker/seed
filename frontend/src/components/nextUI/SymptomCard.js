import { Card, Text } from "@nextui-org/react";
import { Button } from "./index";

const SymptomCard = ({ symptom, onPress }) => {
  const { datetime, symptom: name, severity, _id } = symptom;
  return (
    <Card isHoverable css={{
      background: "rgba(255, 255, 255, 0.7)",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      borderRadius: "16px",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(11.9px)",
      webkitBackdropFilter: "blur(11.9px)",
      border: "1px solid rgba(41, 124, 76, 0.26)",
      "@xs": {
        margin: 0,
        padding: 0,
      }}}>
      <Card.Header>
        <Text b>{name}</Text>
      </Card.Header>
      <Card.Divider />
      <Card.Body>
        <Text>
          {new Date(datetime).toLocaleString("en-US", {
            dateStyle: "full",
          })}
        </Text>
        <Text>
          <b>Severity:</b> {severity}
        </Text>
      </Card.Body>
      <Card.Divider />
      <Card.Footer>
        <Button
          text="Delete"
          color="error"
          size="xs"
          onPress={() => onPress(_id)}
        />
      </Card.Footer>
    </Card>
  );
};

export default SymptomCard;

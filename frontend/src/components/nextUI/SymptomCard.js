import { Card, Text } from "@nextui-org/react";
import { Button } from "./index";

const SymptomCard = ({ symptom, onPress }) => {
  const { datetime, symptom: name, severity, _id } = symptom;
  return (
    <Card isHoverable>
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

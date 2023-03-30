import { Card, Text } from "@nextui-org/react";
import { Button } from "./index";

const MealCard = ({ meal, onPress }) => {
  const { datetime, entry_name, groups, foods, _id } = meal;
  return (
    <Card isHoverable>
      <Card.Header>
        <Text b>{entry_name}</Text>
      </Card.Header>
      <Card.Divider />
      <Card.Body>
        <Text>
          {new Date(datetime).toLocaleString("en-US", {
            dateStyle: "full",
          })}
        </Text>
        <Text>
          <b>Foods:</b> {foods?.join(", ")}
        </Text>
        <Text>
          <b>Foods Groups:</b> {groups?.join(", ")}
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

export default MealCard;

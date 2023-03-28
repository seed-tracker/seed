import React from "react";
import { Card, Text, Container, Spacer, Row } from "@nextui-org/react";
import { Button } from "./nextUI";
import { useNavigate } from "react-router-dom";

//success message to show after successfully submitting the meal or symptom form
//title = card header
//message = card text
//type = "meal" or "symptom"
//onClick = function to call on first button
const SuccessMessage = ({ title, message, type, onClick }) => {
  const navigate = useNavigate();

  return (
    <Container css={{ padding: "4rem" }} justify="center" align="center">
      <Card css={{ maxWidth: "35rem", padding: "2rem" }}>
        <Card.Header>
          <Text h2>{title}</Text>
        </Card.Header>
        <Card.Header>
          <Text>{message}</Text>
        </Card.Header>

        <Card.Body>
          <Row>
            <Button
              ariaLabel={`Add another ${type}`}
              onPress={onClick}
              text={`Add another ${type}`}
              type="button"
            />
            <Spacer x={2} />
            <Button
              ariaLabel="Go to profile"
              onPress={() => navigate("/profile")}
              text="Check out your profile"
            />
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SuccessMessage;

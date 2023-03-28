/* Page template view for main area of the following pages
Login
Sign up
Edit Profile */
import { Card, Text, Row, Container, Spacer } from "@nextui-org/react";
import { Button } from "./index";

const UserForm = ({ title, inputs, description, onSubmit, error }) => {
  return (
    <Container fluid justify="center" align="center">
      <Spacer y={2} />
      <Card
        css={{ mw: "50%", padding: "3rem" }}
        color="neutral"
        aria-label={description}
      >
        <Text h1>{title}</Text>
        <Card.Body>
          {inputs.map(({ name, type, required, value, onChange }) => (
            <>
              <Row justify="center" align="center">
                <input
                  name={name}
                  type={type || "text"}
                  required={required}
                  value={value}
                  onChange={onChange}
                />
              </Row>
              <Spacer justify="center" align="center" y={1} />
            </>
          ))}
          <Row justify="center" align="center">
            <Button
              ariaLabel="Submit button"
              text="Submit"
              onPress={onSubmit}
              justify="center"
              align="center"
            />
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserForm;

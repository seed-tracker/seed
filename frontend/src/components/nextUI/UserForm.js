/* Page template view for main area of the following pages
Login
Sign up
Edit Profile */
import { Card, Text, Row, Container, Spacer } from "@nextui-org/react";
import { Button, Inputs } from "./index";

//inputs = {name, type, required, value, helperText, onChange}
const UserForm = ({ title, inputs, description, onSubmit, error }) => {
  return (
    <Container fluid justify="center" align="center">
      <Spacer y={2} />
      <Card css={{ mw: "50%", padding: "3rem" }} aria-label={description}>
        <Text h1>{title}</Text>
        <Card.Body>
          {inputs.map(
            ({ name, type, required, value, onChange, helperText }) => (
              <>
                <Row justify="center" align="center">
                  <Inputs
                    name={name}
                    type={type || "text"}
                    required={required}
                    value={value}
                    onChange={onChange}
                    helperText={helperText}
                  />
                </Row>
                <Spacer justify="center" align="center" y={1} />
              </>
            )
          )}
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
      <Spacer y={7} />
    </Container>
  );
};

export default UserForm;

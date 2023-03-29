/* Page template view for main area of the following pages
Login
Sign up
Edit Profile */
import { Card, Text, Row, Container, Spacer } from "@nextui-org/react";
import { Button, Inputs, HeaderText } from "./index";
import { Link } from "react-router-dom";

//inputs = {name, type, required, value, helperText, onChange}
const UserForm = ({
  title,
  inputs,
  description,
  onSubmit,
  error,
  loading,
  useRegex,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <Container fluid justify="center" align="center" aria-label={description}>
        <Spacer y={2} />
        <Card css={{ mw: "50%", padding: "3rem" }} aria-label={description}>
          <HeaderText text={title} />
          {title === "Login" && (
            <Text css={{ color: "gray" }}>
              Don't have an account yet? <Link to="/signup">Sign up here!</Link>
            </Text>
          )}
          {title === "Sign up" && (
            <Text css={{ color: "gray" }}>
              Have an account already? <Link to="/login">Log in here!</Link>
            </Text>
          )}
          <Card.Body>
            {inputs.map(
              (
                { name, type, required, value, onChange, helperText, label },
                i
              ) => (
                <>
                  <Row justify="center" align="center" key={i}>
                    <Inputs
                      name={name}
                      type={type || "text"}
                      required={required}
                      value={value}
                      onChange={onChange}
                      helperText={helperText}
                      useRegex={useRegex ? true : false}
                      label={label}
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
                justify="center"
                align="center"
                type="submit"
                loading={loading}
              />
            </Row>
            {error && (
              <Row align="center" justify="center">
                <Text color="error">
                  {typeof error === "string" ? error : "Something went wrong"}
                </Text>
              </Row>
            )}
          </Card.Body>
        </Card>
        <Spacer y={7} />
      </Container>
    </form>
  );
};

export default UserForm;

/* Page template view for main area of the following pages
Login
Sign up
Edit Profile */
import { useEffect } from "react";
import { Card, Text, Row, Container, Spacer } from "@nextui-org/react";
import { Button, Inputs, HeaderText } from "./index";
import { Link } from "react-router-dom";
import { resetError } from "../../store/authSlice";
import { useDispatch } from "react-redux";

//NOTE TO LESTER: I'm trying to follow your advice on creating templates for things like user form, table, etc -- but this feels like a very strange way of doing it...I tried to use nextUI's "styled" function, but it wasn't working...let me know if I should rework this (as in not use a template or do something completely different). That applies to user form, table, and dropdown especially. Thanks! - Leah

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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  return (
    <form onSubmit={onSubmit}>
      <Container justify="center" align="center" aria-label={description}>
        <Card
          css={{
            "@xs": {
              margin: 0,
              padding: 0,
              minWidth: "100vw",
            },
            "@sm": {
              margin: "2vw",
              minWidth: "50vw",
            },
          }}
          aria-label={description}
        >
          <Spacer y={2} />
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
                <section key={i}>
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
                  <Spacer justify="center" align="center" y={1.5} />
                </section>
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
          <Spacer y={2} />
        </Card>
      </Container>
    </form>
  );
};

export default UserForm;

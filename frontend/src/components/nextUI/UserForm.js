/* Page template view for main area of the following pages
Login
Sign up
Edit Profile */
import { useEffect, useState } from "react";
import { Card, Text, Row, Container, Spacer } from "@nextui-org/react";
import { Button, Inputs, HeaderText } from "./index";
import { Links } from "./index";
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
  const [validate, setValidate] = useState(false);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  return (
    <Container
      justify="center"
      align="center"
      aria-label={description}
      css={{ maxWidth: "50rem", padding: "4vh 0" }}
    >
      <form onSubmit={onSubmit}>
        <Card
          css={{
            background: "rgba(255, 255, 255, 0.7)",
            borderRadius: "16px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(11.9px)",
            webkitBackdropFilter: "blur(11.9px)",
            border: "1px solid rgba(41, 124, 76, 0.26)",
            maxWidth: "80vw",
            "@xs": {
              margin: 0,
              padding: 0,
            },
          }}
          aria-label={description}
        >
          <Spacer y={2} />
          <HeaderText text={title} />
          {title === "Login" && (
            <Text css={{ color: "gray" }}>
              Don't have an account yet?{" "}
              <Links href={"/signup"} text={"Sign up here!"}></Links>
            </Text>
          )}
          {title === "Sign up" && (
            <Text css={{ color: "gray" }}>
              Have an account already?{" "}
              <Links href={"/login"} text={"Log in here!"}></Links>
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
                      status={
                        required && validate && !value.length
                          ? "error"
                          : "default"
                      }
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
                onPress={() => setValidate(true)}
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
      </form>
    </Container>
  );
};

export default UserForm;

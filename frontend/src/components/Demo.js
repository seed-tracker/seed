import { useDispatch, useSelector } from "react-redux";
import { me } from "../store/authSlice";
import { useEffect, useState } from "react";
import { PageLoading, HeaderText, Button } from "./nextUI";
import { useNavigate } from "react-router-dom";
import { Text, Card, Spacer } from "@nextui-org/react";
import apiClient from "../client";

const Demo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { me: user, error: authError } = useSelector((state) => state.auth);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    const { data } = await apiClient.post("auth/demo");
    if (data && data.token) {
      localStorage.setItem("token", data.token);
      dispatch(me());
    } else {
      setError("There was an issue logging you in.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.username === process.env.REACT_APP_DEMO_USER) setLoading(false);
    else if (authError) {
      setError("There was an issue logging you in.");
      setLoading(false);
    }
  }, [user, authError]);

  const DemoLanding = () => {
    if (error) return <Text>{error}</Text>;

    return (
      <Card
        justify="center"
        align="center"
        css={{
          minWidth: "40vw",
          maxWidth: "70vw",
          maxWidth: "30rem",
          marginLeft: "9vw",
          marginRight: "5vw",
          padding: "3rem",
          marginTop: "3rem",
          marginBottom: "5rem",
          display: "inline-block",
          height: "fit-content",
        }}
      >
        <HeaderText text="Welcome to Seed!" />
        <Spacer y={1} />
        <Text css={{ fontSize: "17px" }}>
          Seed is a food tracker app that aims to help users identify
          connections between the foods they eat and the symptoms they
          experience.
        </Text>
        <Spacer y={1} />
        <Text css={{ fontSize: "17px" }}>
          In this demo, you can explore the app's functionality as a fake user,
          including adding foods and symptoms, and viewing insights created by
          analyzing the user's data.
        </Text>
        <Spacer y={1} />
        <Text>
          View our code on Github{" "}
          <a href="https://github.com/seed-tracker/seed">here.</a>
        </Text>
        <Spacer y={1} />
        <span>
          <Button
            ariaLabel="button for a demo user to start using the app"
            onPress={() => navigate("/")}
            text="Go to the user's profile"
          />
        </span>
      </Card>
    );
  };

  return (
    <>{loading ? <PageLoading text="Logging you in..." /> : <DemoLanding />}</>
  );
};

export default Demo;

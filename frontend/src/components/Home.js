import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { me } from "../store/authSlice";
import { Container, Spacer } from "@nextui-org/react";

/**
 * Component for the homepage
 * @component shows demo
 */
const Home = () => {
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  return (
    <main className="mainpage-center">
      <Container css={{ minHeight: "100vh", paddingTop: "12em" }}>
        {/* <h2>Welcome to Seed</h2> */}
        <Container
          className="glassmorpheus"
          css={{ maxWidth: "60%", padding: "2em", borderRadius: "2em" }}
        >
          <p className="description" style={{ marginTop: "1em" }}>
            A web app to track your food input and well-being. Track your
            symptoms and food intake to get insights that might help you
            identify patterns, and narrow down food-based triggers.
          </p>

          <Spacer y={2} />

          <p>
            <strong>
              Insights are associations/relations and are NOT medical advice.
            </strong>
          </p>
        </Container>
      </Container>
    </main>
  );
};

export default Home;

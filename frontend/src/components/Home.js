import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { me } from "../store/authSlice";
import { Button, Table, Inputs } from "./nextUI/index";
import { Card } from '@nextui-org/react';
import { Container, Row, Col, Spacer } from '@nextui-org/react';

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
    <Container css={{minHeight:"100vh", paddingTop: "12em"}}>
      {/* <h2>Welcome to Seed</h2> */}
      <Container  className="glassmorpheus" css={{maxWidth: "60%", padding: "2em",borderRadius: "2em"}}>

      {/* <Card className="glassmorpheus" css={{padding: "2em"}}> */}
        <p className="description" style={{ marginTop: "1em" }}>
          A web app to track your food input and well-being. Track your symptoms
          and food intake to get insights that might help you identify patterns,
          and narrow down food-based triggers.
        </p>
      {/* </Card>
      <Spacer y={2}></Spacer>
      <Card className="glassmorpheus" css={{padding: "1em 2em"}} > */}
      <br></br>
      <p>
        <strong >
          Insights are associations/relations and are NOT medical advice.
        </strong>
        </p>
      {/* </Card> */}
      </Container>
      </Container>
    </main>
  );
};

export default Home;

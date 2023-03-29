import React from "react";
import CirclePacking from "./graph/CirclePacking";
import TopSymptoms from "./graph/TopSymptoms";
import { Container } from "@nextui-org/react";

const Dashboard = () => {
  return (
    <main>
      <Container>
        <CirclePacking />
        <TopSymptoms />
      </Container>
    </main>
  );
};

export default Dashboard;
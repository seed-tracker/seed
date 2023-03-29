import React from "react";
import CirclePacking from "./graph/CirclePacking";
import TopSymptoms from "./graph/TopSymptoms";
import { Container } from "@nextui-org/react";

/**
 * Component for the user's Dashboard page
 * @component shows (1) the user's food group and symptom relationships (bubble chart), (2) the user's top 5 symptoms (lollipop chart)
 */
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
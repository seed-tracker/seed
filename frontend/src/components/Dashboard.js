import React from "react";
import CirclePacking from "./graph/CirclePacking";
import TopSymptoms from "./graph/TopSymptoms";

const Dashboard = () => {
  return (
    <main>
      <section>
        <CirclePacking />
        <TopSymptoms />
      </section>
    </main>
  );
};

export default Dashboard;
import React from "react";
import TopSymptoms from "./graph/TopSymptoms";
import TopFoods from "./graph/TopFoods";

const Dashboard = () => {
  return (
    <main>
      <section>
        <TopSymptoms />
        <TopFoods />
      </section>
    </main>
  );
};

export default Dashboard;
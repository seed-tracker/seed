import React from "react";

import { Links } from "./nextUI/index";
import { Container, Spacer } from "@nextui-org/react";

/**
 * Component for the sidebar
 * @component shows a sidebar that shows users different links
 */
const Sidebar = () => {
  return (
    <Container
      className="glassmorpheus-graph1"
      display={"flex"}
      css={{
        "@xs": {
          textAlign: "left",
          margin: 0,
          padding: "1vw",
          flexDirection: "row",
          textAlign: "left",
          maxWidth: "100vw",
        },
        "@sm": {
          marginTop: "4vh",
          padding: "2vw",
          flexDirection: "column",
          maxWidth: "18vw",
          height: "fit-content",
          position: "sticky",
          top: "7rem",
        },
      }}
    >
      <Links href={"/user/edit-profile"} text={"Edit Profile"} />
      <Spacer y={0.5} />
      <Links href={"/user/symptom-entries"} text={"Past Symptom Entries"} />
      <Spacer y={0.5} />
      <Links href={"/user/meal-entries"} text={"Past Meal Entries"} />
      <Spacer y={0.5} />

      <Links href={"/add/symptom"} text={"Add Symptom Entry"} />

      <Spacer y={0.5} />

      <Links href={"/user/addFood"} text={"Add Food Entry"} />
    </Container>
  );
};

export default Sidebar;

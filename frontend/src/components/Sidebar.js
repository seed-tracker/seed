import { Container } from "@nextui-org/react";
import React from "react";
import { Links } from "./nextUI/index";

/**
 * Component for the sidebar
 * @component shows a sidebar that shows users different links
 */
const Sidebar = () => {
  return (
    <Container
      className="glassmorpheus-graph1"
      display={"flex"}
      justify="space-around"
      css={{
        "@xs": {
          gap: "1rem",
          margin: 0,
          flexWrap: "wrap",
          flexDirection: "row",
          maxWidth: "100vw",
        },
        "@sm": {
          gap: "1rem",
          textAlign: "left",
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

      <Links href={"/user/symptom-entries"} text={"Past Symptom Entries"} />

      <Links href={"/user/meal-entries"} text={"Past Meal Entries"} />

      <Links href={"/add/symptom"} text={"Add Symptom Entry"} />

      <Links href={"/user/addFood"} text={"Add Food Entry"} />
    </Container>
  );
};

export default Sidebar;

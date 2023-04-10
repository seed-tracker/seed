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
          height: "fit-content",
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <span className="material-symbols-rounded">person</span>
        <Links href={"/user/edit-profile"} text={"Edit Profile"} />
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <span className="material-symbols-rounded">diagnosis</span>
        <Links href={"/user/symptom-entries"} text={"Past Symptom Entries"} />
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <span className="material-symbols-rounded">restaurant</span>
        <Links href={"/user/meal-entries"} text={"Past Meal Entries"} />
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          className="material-symbols-rounded"
          style={{ cursor: "pointer" }}
        >
          add
        </span>
        <Links href={"/add/symptom"} text={"Add Symptom Entry"} />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          className="material-symbols-rounded"
          style={{ cursor: "pointer" }}
        >
          add
        </span>
        <Links href={"/user/addFood"} text={"Add Food Entry"} />
      </div>
    </Container>
  );
};

export default Sidebar;

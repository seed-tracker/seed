import React from "react";

import { Links } from "./nextUI/index";
import { Container, Spacer } from "@nextui-org/react";

/**
 * Component for the sidebar
 * @component shows a sidebar that shows users different links
 */
const Sidebar = () => {
  return (
    <aside>
      <Container
        display={"flex"}
        direction={"column"}
        css={{ padding: "3rem", minWidth: "20rem", height: "80vh" }}
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
    </aside>
  );
};

export default Sidebar;

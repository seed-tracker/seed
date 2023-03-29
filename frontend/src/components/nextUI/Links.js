// NextUI component for all clickable links
import { Link as NextUILink } from "@nextui-org/react";
import { Link as Router } from "react-router-dom";

/*
My Profile
Everything on sidebar */

const Link = ({ href, text }) => {
  return (
    <NextUILink block color="success" underline>
      <Router style={{ textDecoration: "none", color: "inherit" }} to={href}>
        {text}
      </Router>
    </NextUILink>
  );
};

export default Link;

// NextUI component for all clickable links
import { Link as NextUILink } from "@nextui-org/react";

/*
My Profile
Everything on sidebar */

const Link = ({ href, text }) => {
  return (
      <NextUILink block href={href} color="success" underline>
        {text}
      </NextUILink>
  );
};

export default Link;

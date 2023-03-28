// NextUI component for all clickable links
import { Link as NextUILink } from "@nextui-org/react";
import Text from "./Inputs";

/* 
My Profile
Everything on sidebar */

const Link = ({ href, text }) => {
  return (
    <Text>
      <NextUILink block href={href} color="success" underline>
        {text}
      </NextUILink>
    </Text>
  );
};

export default Link;

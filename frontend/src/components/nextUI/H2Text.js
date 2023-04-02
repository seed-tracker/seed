// NextUI component: Text format for any headers
import { Text as NextUIText } from "@nextui-org/react";

/*
Usage:
Login
Signup
Edit Profile
Entries History
 */

const HeaderText = ({ text }) => {
  return (
    <NextUIText color="secondary" h2 css={{fontFamily: "Euclid Medium"}}>
      {text}
    </NextUIText>
  );
};

export default HeaderText;

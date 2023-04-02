// NextUI component: all buttons that requires a user submit something or calls on backend/route
import { Button as NextUIButton, Loading } from "@nextui-org/react";
//text (string) = text to display in the button
//color (string, optional) = color of the button (default is primary)
//ariaLabel (string) = aria-label for the button
//loading (boolean, optional) = whether the button is loading, default = false
//disabled (boolean, optional) = whether the button is disabled, default = false
//size (string, optional) = size of the button, default = "md"
//onPress (function) = function to call when the button is clicked
//type (string, optional) = type of the button (ex. submit), default = "button"
const Button = ({
  text,
  color,
  ariaLabel,
  loading,
  disabled,
  size,
  onPress,
  type,
}) => {
  return (
    <NextUIButton
      size={size || "md"}
      color={color || "primary"}
      aria-label={ariaLabel}
      disabled={disabled || loading}
      onPress={onPress}
      type={type || "button"}
      css={{ maxWidth: "10rem", background: "#7a918d", padding: "1rem" }}
    >
      {!loading ? (
        text
      ) : (
        <Loading type="spinner" color="currentColor" size="sm" />
      )}
    </NextUIButton>
  );
};

export default Button;

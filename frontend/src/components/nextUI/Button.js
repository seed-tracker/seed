// NextUI component: all buttons that requires a user submit something or calls on backend/route
import { Button as NextUIButton, Loading } from "@nextui-org/react";

/* 
edit history
login/sign up
edit profile
add symptom
add foods
logout
*/

//props: text, color, ariaLabel, loading, size, disabled
const Button = ({
  text,
  color,
  ariaLabel,
  loading,
  disabled,
  size,
  onPress,
}) => {
  return (
    <NextUIButton
      color={color || "primary"}
      size={size || "md"}
      aria-label={ariaLabel}
      disabled={disabled}
      onPress={onPress}
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

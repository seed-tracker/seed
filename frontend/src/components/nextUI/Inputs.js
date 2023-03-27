/* NextUI component: Any field that requires user to type/input. Will use NextUI Text component
date
time
regular text fields */

/*
Login
Sign up
Edit Profile
Add Symptom
Add Food
 */
import { Input as NextUiInput } from "@nextui-org/react";

function Inputs(inputProps) {
  const { required, type, label, helperText, value, onChange } = inputProps;

  if (type === "password") {
    return (
      <NextUiInput.Password
        bordered
        size="md"
        pattern="^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*()]).{8,}$"
        color={required ? "secondary" : "default"}
        type={type}
        required={required}
        label={label}
        helperText={helperText && helperText}
        value={value}
        onChange={onChange}
      />
    );
  } else {
    return (
      <NextUiInput
        bordered
        size="md"
        color={required ? "secondary" : "default"}
        type={type}
        required={required}
        label={label}
        helperText={helperText && helperText}
        value={value}
        onChange={onChange}
      />
    );
  }
}

export default Inputs;

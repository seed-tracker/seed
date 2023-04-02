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
import { Spacer, Input as NextUiInput } from "@nextui-org/react";

function Inputs(inputProps) {
  const { required, type, label, helperText, value, onChange, useRegex } =
    inputProps;

  if (type.split(" ")[0] === "password") {
    const pattern =
      type.split(" ")[1] === "noregex"
        ? ".{1,}"
        : "^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*()]).{8,}$";

    return (
      <>
        <NextUiInput.Password
          bordered
          color="secondary"
          size="md"
          width="20vw"
          pattern={pattern}
          type="password"
          required={required}
          label={label}
          helperText={helperText && helperText}
          value={value}
          onChange={onChange}
          css={{ minWidth: "15rem" }}
        />
        <Spacer y={1} />
      </>
    );
  } else {
    return (
      <>
        <NextUiInput
          bordered
          color="secondary"
          size="md"
          width="20vw"
          type={type}
          required={required}
          label={label}
          helperText={helperText && helperText}
          value={value}
          onChange={onChange}
          css={{ minWidth: "15rem" }}
        />
        <Spacer y={1} />
      </>
    );
  }
}

export default Inputs;

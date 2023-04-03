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
import { Input as NextUiInput, Spacer } from "@nextui-org/react";

function Inputs(inputProps) {
  const { required, type, label, helperText, value, onChange, status } =
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
          pattern={pattern}
          type="password"
          required={required}
          label={label}
          helperText={helperText && helperText}
          onChange={onChange}
          css={{
            "@xs": {
              width: "90vw",
            },
            "@sm": {
              width: "20vw",
            },
            maxWidth: "25rem",
            minWidth: "16rem",
          }}
          status={status}
          initialValue={value}
        />
        <Spacer y={1.5} />
      </>
    );
  } else {
    return (
      <>
        <NextUiInput
          bordered
          color="secondary"
          size="md"
          type={type}
          required={required}
          label={label}
          helperText={helperText && helperText}
          onChange={onChange}
          css={{
            "@xs": {
              width: "90vw",
            },
            "@sm": {
              width: "20vw",
            },
            maxWidth: "25rem",
            minWidth: "16rem",
          }}
          status={status}
          initialValue={value}
        />
        <Spacer y={1.5} />
      </>
    );
  }
}

export default Inputs;

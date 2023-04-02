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
<<<<<<< HEAD
          css={{ minWidth: "15rem" }}
=======
          css={{
            "@xs": {
              width: "90vw",
            },
            "@sm": {
              width: "20vw",
            },
          }}
>>>>>>> f5e474ac4c33f005a7ee41cc13a9327fa686d6a9
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
          type={type}
          required={required}
          label={label}
          helperText={helperText && helperText}
          value={value}
          onChange={onChange}
<<<<<<< HEAD
          css={{ minWidth: "15rem" }}
=======
          css={{
            "@xs": {
              width: "90vw",
            },
            "@sm": {
              width: "20vw",
            },
          }}
>>>>>>> f5e474ac4c33f005a7ee41cc13a9327fa686d6a9
        />
        <Spacer y={1.5} />
      </>
    );
  }
}

export default Inputs;

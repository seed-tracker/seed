// // NextUI component for all dropdowns
import { Dropdown as NextUIDropdown } from "@nextui-org/react";
import React, { useMemo } from "react";
// /*
// Autocomplete?
// Symptoms
//  */

//color (string) = default = "primary"
//selectedValue (useState variable),
//ariaLabel (description),
//selectionMode (single or multiple),
//onSelectionChange (function to call when the selection changes) typically setting a state variable for the parent component (ex. setValue)
//items (list of items to display in format [{name, key}, {name, key}, ...])
//defaultName (name to show on the button before any keys are set)
const Dropdown = ({
  color,
  selectedKeys,
  ariaLabel,
  selectionMode,
  onChange,
  items,
  defaultName,
}) => {
  //continuously update the dropdown text
  const chosenKeys = useMemo(() => Array.from(selectedKeys), [selectedKeys]);

  return (
    <NextUIDropdown>
      <NextUIDropdown.Button
        flat
        color={color || "primary"}
        css={{ tt: "capitalize" }}
      >
        {chosenKeys.length ? chosenKeys.join(", ") : defaultName}
      </NextUIDropdown.Button>
      <NextUIDropdown.Menu
        aria-label={ariaLabel}
        color={color || "primary"}
        disallowEmptySelection
        selectionMode={selectionMode || "single"}
        selectedKeys={selectedKeys}
        onSelectionChange={onChange}
        items={items}
      >
        {(item) => (
          <NextUIDropdown.Item key={item.key}>{item.name}</NextUIDropdown.Item>
        )}
      </NextUIDropdown.Menu>
    </NextUIDropdown>
  );
};

export default Dropdown;

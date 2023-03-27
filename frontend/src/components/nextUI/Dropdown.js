// // NextUI component for all dropdowns
import { Dropdown as NextUIDropdown } from "@nextui-org/react";
// /*
// Autocomplete?
// Symptoms
//  */

//props = color, selectedValue (useState variable), ariaLabel (description), selectionMode (single or multiple), onSelectionChange (function to call when the selection changes), items (list of items to display in format [{name, key}, {name, key}, ...]), defaultName (name to show on the button originally)
const Dropdown = ({
  color,
  selectedKeys,
  ariaLabel,
  selectionMode,
  onChange,
  items,
  defaultName,
}) => {
  return (
    <NextUIDropdown>
      <NextUIDropdown.Button
        flat
        color={color || "primary"}
        css={{ tt: "capitalize" }}
      >
        {selectedKeys.join(", ") || defaultName}
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

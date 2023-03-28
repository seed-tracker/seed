// // NextUI component for all dropdowns
import { Dropdown as NextUIDropdown } from "@nextui-org/react";
// /*
// Autocomplete?
// Symptoms
//  */

//props = color, selectedValue (useState variable), ariaLabel (description),
const Dropdown = ({
  color,
  selectedValue,
  ariaLabel,
  selectionMode,
  onSelectionChange,
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
        {selectedValue || defaultName}
      </NextUIDropdown.Button>
      <NextUIDropdown.Menu
        aria-label={ariaLabel}
        color={color || "$primary"}
        disallowEmptySelection
        selectionMode={selectionMode || "single"}
        selectedKeys={selectedValue}
        onSelectionChange={onSelectionChange}
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

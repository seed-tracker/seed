import { useState } from "react";
// import {useDispatch} from 'react-redux';
// import { autocompleteFood } from "../store/entrySlice";
import apiClient from "../config";
import { Card, Input, Row, Grid, Spacer, Popover } from "@nextui-org/react";
import { Button, Dropdown } from "./nextUI";

const Autocomplete = ({ addFood, allGroups }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [value, setValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [chosenGroup, setChosenGroup] = useState([]);

  const handleChange = async (e) => {
    const query = e.target.value;
    setValue(query);

    if (query.length < 1) return;

    const { data } = await apiClient.get(
      `foods/autocomplete?query=${query.toLowerCase()}`
    ); /* dispatch(autocompleteFood(query)) */

    //data = [{groups: [], name: ""}, ...]
    if (!data || !data.length) {
      setSuggestions([]);
      return;
    }

    setSuggestions(data);
  };

  const handleClick = (idx) => {
    addFood(suggestions[idx]);
    setSuggestions([]);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      if (suggestionIndex - 1 === suggestions.length) return;

      setSuggestionIndex(suggestionIndex + 1);
    } else if (e.key === "ArrowUp") {
      if (suggestionIndex === 0) {
        return;
      }
      setSuggestionIndex(suggestionIndex - 1);
    } else if (e.key === "Enter") {
      setValue(suggestions[suggestionIndex]);
      setSuggestionIndex(0);
    }
  };

  const changeGroup = ({ currentKey }) => {
    setChosenGroup([...chosenGroup, currentKey]);
  };

  const handleAddNewFood = () => {
    if (chosenGroup.length < 1) return;
    addFood({ name: value, groups: [chosenGroup] });
    setValue("");
    setShowDropdown(false);
    setChosenGroup([]);
  };

  const cancelNewFood = () => {
    setShowDropdown(false);
    setChosenGroup([]);
  };

  return (
    <Grid.Container css={{ maxWidth: "30rem" }} className="autocomplete">
      <Grid xs={12}>
        <Card css={{ marginTop: "0", minWidth: "20rem" }}>
          <Input
            placeholder="Search for a food"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            size="md"
            aria-label="food input"
            css={{ marginBottom: "0px", width: "100%" }}
          />
          <Card.Body css={{ padding: "0" }}>
            {value.length > 1 && !showDropdown ? (
              <>
                {suggestions.map((suggestion, idx) => (
                  <Row key={idx} onClick={() => handleClick(idx)}>
                    {suggestion.name}
                  </Row>
                ))}
              </>
            ) : null}
          </Card.Body>
        </Card>
        <Spacer y={1} />
        <Button
          onClick={() => setShowDropdown(true)}
          color="error"
          css={{ width: "100%" }}
          text="Add new food"
        >
          Add new food
        </Button>
      </Grid>

      {showDropdown && (
        <>
          <Dropdown
            selectedKeys={chosenGroup}
            selectionMode="multiple"
            ariaLabel="Dropdown to select a food group"
            onChange={changeGroup}
            defaultName="Choose a food group"
            items={allGroups.map(({ name }) => ({ name: name, key: name }))}
          />
          <Button
            size="xs"
            ariaLabel="Add a new food"
            text="Add food"
            onPress={handleAddNewFood}
          />
          <Button
            size="xs"
            ariaLabel="Cancel adding a new food"
            text="Cancel"
            color="error"
            onPress={cancelNewFood}
          />
        </>
      )}
    </Grid.Container>
  );
};

export default Autocomplete;

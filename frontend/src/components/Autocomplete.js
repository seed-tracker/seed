import React, { useMemo, useState } from "react";
import apiClient from "../client";
import { Card, Row, Grid, Spacer } from "@nextui-org/react";
import { Button, Dropdown, Inputs } from "./nextUI";

//autocomplete component for meal form
const Autocomplete = ({ addFood, allGroups }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [value, setValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const chosenGroups = useMemo(
    () => Array.from(selectedGroups),
    [selectedGroups]
  );

  //send a query to the server when the input value changes
  const handleChange = async (e) => {
    const query = e.target.value;
    setValue(query);

    if (query.length < 1) return;

    //data response = [{groups: [], name: ""}, ...]
    const { data } = await apiClient.get(
      `foods/autocomplete?query=${query.toLowerCase()}`
    );

    //if no suggestion, reset
    if (!data || !data.length) {
      setSuggestions([]);
      return;
    }

    //set the suggestions to show
    setSuggestions(data);
  };

  //add a food to the meal array when clicked and reset the state
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

  //add a new food (not found through the database)
  const handleAddNewFood = () => {
    if (chosenGroups.length < 1) return;
    addFood({ name: value, groups: chosenGroups });
    setValue("");
    setShowDropdown(false);
    setSelectedGroups([]);
  };

  //cancel adding a new food
  const cancelNewFood = () => {
    setShowDropdown(false);
    setSelectedGroups([]);
  };

  return (
    <Grid.Container className="autocomplete">
      <Grid xs={12}>
        <section
          css={{
            marginTop: "0",
            width: "20vw",
            backgroundColor: "transparent",
          }}
          variant="flat"
        >
          <Inputs
            label="Search for a food"
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required={false}
          />

          {value.length > 1 && !showDropdown ? (
            <Card css={{ backgroundColor: "transparent", padding: "0.5rem", cursor: "pointer" }}>
              {suggestions.map((suggestion, idx) => (
                <Row key={idx} onClick={() => handleClick(idx)} className="suggestion">
                  {" "}
                  {suggestion.name}
                </Row>
              ))}
              <Row onClick={() => setShowDropdown(true)} css={{ color: "red" }}>
                {" "}
                Add new food
              </Row>
            </Card>
          ) : null}
        </section>
        <Spacer y={1} />
      </Grid>

      {showDropdown && (
        <>
          <Spacer y={1} />
          <Grid xs={12}>
            <Dropdown
              selectedKeys={selectedGroups}
              selectionMode="multiple"
              ariaLabel="Dropdown to select a food group"
              onChange={setSelectedGroups}
              defaultName="Choose a food group"
              items={allGroups.map(({ name }) => ({ name: name, key: name }))}
            />
          </Grid>
          <Spacer y={1} />
          <Grid xs={12}>
            <Button
              size="sm"
              ariaLabel="Add a new food"
              text="Add food"
              onPress={handleAddNewFood}
              color="$warning"
              disabled={!chosenGroups.length || !value.length}
            />
            <Spacer x={1} />
            <Button
              size="sm"
              ariaLabel="Cancel adding a new food"
              text="Cancel"
              color="error"
              onPress={cancelNewFood}
            />
          </Grid>
        </>
      )}
    </Grid.Container>
  );
};

export default Autocomplete;

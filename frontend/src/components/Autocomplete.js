import React, { useMemo, useState } from "react";
import apiClient from "../client";
import {
  Card,
  Row,
  Grid,
  Spacer,
  Input,
  Button as NextUIButton,
} from "@nextui-org/react";
import { Button, Dropdown } from "./nextUI";

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
          <Card
            css={{
              backgroundColor: "transparent",
              padding: "0.5rem",
              cursor: "pointer",
              margin: "0",
            }}
          >
            <Input
              aria-label="Search for a food"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required={false}
              bordered
              color="secondary"
              size="md"
              css={{
                "@xs": {
                  width: "90vw",
                },
                "@sm": {
                  width: "25vw",
                },
                maxWidth: "25rem",
                minWidth: "13rem",
              }}
            />

            {value.length > 1 && !showDropdown ? (
              <NextUIButton.Group
                color="secondary"
                light
                vertical
                shadow
                css={{
                  margin: 0,
                  border: "1px solid rgba(200, 210, 200 0.6)",
                  borderBottom: "0px",
                  borderRadius: "0",
                  backgroundColor: "rgba(240, 255, 240, 0.3)",
                }}
              >
                {suggestions?.map((suggestion, idx) => (
                  <NextUIButton
                    css={{
                      padding: 0,
                      height: "1.8rem",
                      borderRadius: 0,
                      color: "#000000",
                    }}
                    key={idx}
                    onPress={() => handleClick(idx)}
                  >
                    {suggestion.name}
                  </NextUIButton>
                ))}
                <NextUIButton
                  css={{
                    padding: 0,
                    height: "1.8rem",

                    borderWidth: "0.1rem",
                    backgroundColor: "$primary",
                    opacity: "0.9",
                    color: "white",
                  }}
                  onClick={() => setShowDropdown(true)}
                >
                  Add new food
                </NextUIButton>
              </NextUIButton.Group>
            ) : null}
          </Card>
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
              color="#7A918D"
              css={{
                background: "#7a918d",
                padding: "1rem",
                maxWidth: "10rem",
              }}
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
      <Spacer x={2} />
    </Grid.Container>
  );
};

export default Autocomplete;

import React, { useMemo, useState, useRef } from "react";
import apiClient from "../client";
import {
  Card,
  Grid,
  Spacer,
  Input,
  Button as NextUIButton,
  Text,
} from "@nextui-org/react";
import { Button, Dropdown } from "./nextUI";

//autocomplete component for the meal form
const Autocomplete = ({ addFood, allGroups }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [value, setValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [error, setError] = useState("");

  const chosenGroups = useMemo(
    () => Array.from(selectedGroups),
    [selectedGroups]
  );

  const ref = useRef(null);

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
    if (ref.current) ref.current.value = "";
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
    if (chosenGroups.length < 1) {
      setError("Please choose at least one group");
      return;
    }
    setError("");
    addFood({ name: value, groups: chosenGroups });
    setValue("");
    setShowDropdown(false);
    setSelectedGroups([]);
    if (ref.current) ref.current.value = "";
  };

  //cancel adding a new food
  const cancelNewFood = () => {
    setShowDropdown(false);
    setSelectedGroups([]);
    setError("");
  };

  return (
    <Grid.Container className="autocomplete">
      <Grid xs={12}>
        <section
          css={{
            margin: "0",
            width: "20vw",
            backgroundColor: "transparent",
          }}
          variant="flat"
        >
          <Card
            css={{
              backgroundColor: "transparent",
              padding: "0.5rem 0.5rem 0.5rem 0.1rem",
              cursor: "pointer",
              margin: "0",
              border: "0",
            }}
            shadow={false}
          >
            <Input
              label="Search for a food"
              aria-label="Search for a food"
              initialValue={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required={false}
              bordered
              color="secondary"
              size="md"
              css={{
                margin: 0,
                padding: 0,
                "@xs": {
                  width: "90vw",
                },
                "@sm": {
                  width: "20vw",
                },
              }}
              ref={ref}
            />

            {value.length > 1 && !showDropdown ? (
              <NextUIButton.Group
                light
                vertical
                shadow
                ripple={true}
                css={{
                  margin: 0,
                  border: "1px solid rgba(200, 210, 200, 0.6)",
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
                      border: "0px",
                    }}
                    key={idx}
                    onPress={() => handleClick(idx)}
                  >
                    <Text color="black">{suggestion.name}</Text>
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
              defaultName="Choose one or more food groups"
              items={allGroups.map(({ name }) => ({ name: name, key: name }))}
              color="#7A918D"
              css={{
                background: "#7a918d",
                padding: "1rem",
                maxWidth: "10rem",
              }}
            />
          </Grid>
          {error && selectedGroups.length < 1 ? (
            <Text color="error" css={{ mb: "1rem" }}>
              Please choose a food group
            </Text>
          ) : (
            ""
          )}
          <Spacer y={1} />
          <Grid xs={12}>
            <NextUIButton
              size="sm"
              ariaLabel="Add a new food"
              onPress={handleAddNewFood}
              css={{
                maxWidth: "10rem",
                background: "#7a918d",
                padding: "1rem",
              }}
            >
              Add Food
            </NextUIButton>
            <Spacer x={1} />
            <Button
              size="sm"
              ariaLabel="Cancel adding a new food"
              text="Cancel"
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

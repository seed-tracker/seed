import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { me } from "../store/authSlice";
import Autocomplete from "./Autocomplete";
import apiClient from "../client";
import { Container, Spacer, Text, Collapse } from "@nextui-org/react";
import { Button, Table, Inputs, HeaderText } from "./nextUI/index";
import SuccessMessage from "./SuccessMessage";

//form for entering a meal
//includes options to add a meal name, date, time. Includes a table of the user's recent foods with buttons to add them to the current meal
function MealForm() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [entryName, setEntryName] = useState("");
  const [mealArray, setMealArray] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [allGroups, setAllGroups] = useState([]);
  const [recentFoods, setRecentFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validate, setValidate] = useState(false);

  const dispatch = useDispatch();

  // Dispatch to get user information
  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  //fetch food groups when the component mounts
  useEffect(() => {
    const today = new Date().toISOString();
    setTime(today.substring(11, 16));
    setDate(today.substring(0, 10));
    fetchGroups();
    fetchRecentFoods();
  }, []);

  //fetch groups from api
  const fetchGroups = async () => {
    try {
      const { data } = await apiClient.get("groups/");

      if (data && data["data"]) {
        setAllGroups(data["data"]);
      }
    } catch (err) {
      console.debug(err);
    }
  };

  //fetch the user's recent foods
  const fetchRecentFoods = async () => {
    try {
      const { data } = await apiClient.get("meals/recent");
      //[{name, groups}, {name, groups}, ...]
      if (data) setRecentFoods(data);
    } catch (err) {
      console.debug(err);
    }
  };

  //add a food to the meal array
  const addFood = (foodObj) => {
    setError("");
    if (!foodObj.groups || !foodObj.name) return;
    setMealArray([...mealArray, foodObj]);
  };

  //handle form changes
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const handleNameChange = (event) => {
    setEntryName(event.target.value);
  };

  //filter for unique values (helper function used before submitting the meal)
  const makeUnique = (array) => {
    return array.filter((item, idx) => array.indexOf(item) === idx);
  };

  //submit the meal
  const handleSubmit = async (e) => {
    try {
      setValidate(true);
      e.preventDefault();
      console.log("submit");

      //set an error if the user hasn't added a food
      if (!mealArray.length) {
        setError("Please add at least one food");
        return;
      }

      setLoading(true);

      //filter and format the foods and groups for mongoDB
      const foods = makeUnique(mealArray.map(({ name }) => name));
      const groups = mealArray.reduce((array, { groups }) => {
        groups.forEach((g) => {
          if (!array.includes(g)) array.push(g);
        });
        return array;
      }, []);

      //send the request
      const { status } = await apiClient.post("users/addMeal", {
        date,
        time,
        foods,
        groups,
        entry_name: entryName,
      });

      //if successful, reset the form and open the success message
      if (status === 201) {
        setSuccess(true);
        setError("");
        setEntryName("");
        setMealArray([]);
        const today = new Date().toISOString();
        setTime(today.substring(11, 16));
        setDate(today.substring(0, 10));
        setLoading(false);
        setValidate(false);
      } else {
        setError(
          "There was an issue adding your meal. Please try again later."
        );
      }
    } catch (error) {
      console.debug(error);
      setError("There was a problem adding your meal. Please try again later");
    }
  };

  //remove a food that's been added
  const removeFood = ({ key }) => {
    setMealArray([...mealArray.slice(0, key), ...mealArray.slice(key + 1)]);
  };

  //table containing the currently added foods
  //contains the headers, data, and an object used to create the button
  const AddedFoods = () => {
    return (
      <Table
        description="Added foods table"
        headers={[
          { key: "name", label: "CURRENT MEAL" },
          { key: "button", label: "" },
        ]}
        rows={mealArray}
        button={{
          buttonDescription: "Button to remove a food from the current meal",
          text: "Remove",
          onPress: removeFood,
        }}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className="entryForm">
      {!success ? (
        <Container
          display={"flex"}
          justify={"space-between"}
          wrap={"wrap"}
          css={{
            "@xs": {
              margin: 0,
              padding: 0,
              maxWidth: "100vw",
            },
            "@sm": {
              margin: "2vw",
              padding: 0,
              maxWidth: "90vw",
            },
          }}
        >
          <Container display={"flex"} justify={"center"}>
            <HeaderText text="Add a Meal" />
          </Container>
          <Container
            display={"flex"}
            direction="column"
            css={{
              "@xs": {
                margin: 0,
                padding: 0,
                width: "100vw",
              },
              "@sm": {
                flexDirection: "column",
                maxWidth: "20vw",
              },
            }}
          >
            <Inputs
              label="Entry Name"
              type="text"
              value={entryName}
              onChange={handleNameChange}
              required={true}
              helperText="Required"
              status={validate && !entryName.length ? "error" : "default"}
            />
            <Inputs
              label="Date"
              type="date"
              value={date}
              onChange={handleDateChange}
              required={true}
              helperText="Required"
              status={validate && !date.length ? "error" : "default"}
            />
            <Inputs
              label="Time"
              type="time"
              value={time}
              onChange={handleTimeChange}
              required={true}
              helperText="Required"
              status={validate && !time.length ? "error" : "default"}
            />
            <Autocomplete addFood={addFood} allGroups={allGroups} />
            <Container
              display={"flex"}
              direction={"column"}
              alignItems={"center"}
              css={{ margin: 0, padding: 0 }}
            >
              <Spacer y={2} />
              <AddedFoods />

              <Spacer y={1} />
              <Button
                color={"secondary"}
                text="Submit Meal"
                ariaLabel="Button to submit a meal"
                type="submit"
                loading={loading}
                onPress={() => setValidate(true)}
              />

              {error.length > 1 && <Text color="red">{error}</Text>}
              <Spacer y={2} />
            </Container>
          </Container>
          {recentFoods && recentFoods.length > 0 && (
            <Container
              display={"flex"}
              justify="flex-start"
              direction="column"
              css={{
                margin: 0,
                padding: 0,
                "@xs": {
                  alignContent: "center",
                  maxWidth: "100vw",
                },
                "@sm": {
                  maxWidth: "50vw",
                  alignContent: "flex-end",
                },
              }}
            >
              <Table
                description="Recent foods table"
                headers={[
                  { key: "name", label: "RECENT FOODS" },
                  { key: "button", label: "" },
                ]}
                rows={recentFoods}
                button={{
                  buttonDescription: "Button to add a recent food to the meal",
                  text: "Add",
                  onPress: addFood,
                }}
              />
              <Spacer y={1} />
            </Container>
          )}
        </Container>
      ) : (
        <Container display={"flex"} css={{ margin: "5vh 15vw" }}>
          <SuccessMessage
            title="Thanks for adding a meal!"
            message="Every meal you add makes our predictions better."
            type="meal"
            onClick={() => setSuccess(false)}
          />
        </Container>
      )}
    </form>
  );
}

export default MealForm;

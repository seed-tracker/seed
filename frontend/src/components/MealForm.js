import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { me } from "../store/authSlice";
import Autocomplete from "./Autocomplete";
import apiClient from "../client";
import { Container, Row, Col, Spacer, Text } from "@nextui-org/react";
import { Button, Table, Inputs, HeaderText } from "./nextUI/index";
import SuccessMessage from "./SuccessMessage";

//form for entering a meal
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

  const dispatch = useDispatch();

  // Dispatch to get user information
  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  //fetch food groups when the component mounts
  useEffect(() => {
    const today = new Date().toISOString();
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
      e.preventDefault();

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
        setTime("");
        setDate("");
        setLoading(false);
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
    <form onSubmit={handleSubmit}>
      {!success ? (
        <Container
          display={"flex"}
          justify={"space-between"}
          wrap={"wrap"}
          css={{ margin: "2vw", width: "65vw" }}
        >
          <Container display={"flex"} justify={"center"}>
            <HeaderText text="Add a meal" />
          </Container>
          <Container
            display={"flex"}
            direction="column"
            css={{
              "@xs": {
                margin: 0,
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
            />
            <Inputs
              label="Date"
              type="date"
              value={date}
              onChange={handleDateChange}
              required={true}
              helperText="Required"
            />
            <Inputs
              label="Time"
              type="time"
              value={time}
              onChange={handleTimeChange}
              required={true}
              helperText="Required"
            />
            <Autocomplete addFood={addFood} allGroups={allGroups} />
          </Container>
          {recentFoods && recentFoods.length > 0 && (
            <Container
              display={"flex"}
              direction="column"
              css={{ margin: 0, padding: 0, maxWidth: "30vw" }}
            >
              <Table
                description="Recent foods table"
                headers={[
                  { key: "name", label: "YOUR RECENT FOODS" },
                  { key: "button", label: "" },
                ]}
                rows={recentFoods}
                button={{
                  buttonDescription: "Button to add a recent food to the meal",
                  text: "Add food",
                  onPress: addFood,
                }}
              />
              <Spacer y={1} />
            </Container>
          )}

          <Container
            display={"flex"}
            direction={"column"}
            alignItems={"center"}
            css={{ margin: 0, padding: 0 }}
          >
            <AddedFoods />
            <Spacer y={1} />
            <Button
              color={"secondary"}
              text="Submit Meal"
              ariaLabel="Button to submit a meal"
              type="submit"
              loading={loading}
            />

            {error.length > 1 && <Text color="red">{error}</Text>}
          </Container>
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

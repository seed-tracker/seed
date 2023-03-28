import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { me } from "../store/authSlice";
import Autocomplete from "./Autocomplete";
import apiClient from "../config";
import { Grid, Row, Spacer, Text } from "@nextui-org/react";
import { Button, Table, Inputs } from "./nextUI/index";
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
      console.error(err);
    }
  };

  //fetch the user's recent foods
  const fetchRecentFoods = async () => {
    try {
      const { data } = await apiClient.get("meals/recent");

      //[{name, groups}, {name, groups}, ...]
      if (data) setRecentFoods(data);
    } catch (err) {
      console.error(err);
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
      console.error(error);
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
          { key: "name", label: "Current meal" },
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
        <Grid.Container direction="row" css={{ padding: "2rem" }}>
          <Grid.Container
            xs={6}
            css={{
              padding: "3rem",
              maxWidth: "40rem",
            }}
            gap={4}
          >
            <Grid xs={12}>
              <Inputs
                label="Entry Name"
                type="text"
                value={entryName}
                onChange={handleNameChange}
                required={true}
                helperText="Required"
              />
            </Grid>
            <Grid xs={12}>
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
            </Grid>

            <Grid xs={12}>
              <Autocomplete addFood={addFood} allGroups={allGroups} />
            </Grid>
            {recentFoods && recentFoods.length > 0 && (
              <Grid xs={12}>
                <Table
                  description="Recent foods table"
                  headers={[
                    { key: "name", label: "Your recent foods" },
                    { key: "button", label: "" },
                  ]}
                  rows={recentFoods}
                  button={{
                    buttonDescription:
                      "Button to add a recent food to the meal",
                    text: "Add food",
                    onPress: addFood,
                  }}
                />
              </Grid>
            )}
          </Grid.Container>
          <Grid>
            <Row css={{ minWidth: "35rem" }}>
              <AddedFoods />
            </Row>
            <Spacer y={1} />
            <Row>
              <Button
                text="Submit Meal"
                ariaLabel="Button to submit a meal"
                type="submit"
                loading={loading}
              />
            </Row>
            <Row>{error.length > 1 && <Text color="red">{error}</Text>}</Row>
          </Grid>
        </Grid.Container>
      ) : (
        <SuccessMessage
          title="Thanks for adding a meal!"
          message="Every meal you add makes our predictions better."
          type="meal"
          onClick={() => setSuccess(false)}
        />
      )}
    </form>
  );
}

export default MealForm;

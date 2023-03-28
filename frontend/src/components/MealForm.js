import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { me } from "../store/authSlice";
import Sidebar from "./Sidebar";
import Autocomplete from "./Autocomplete";
import apiClient from "../config";
import {
  Table as NextUITable,
  Button as NextUIButton,
  Grid,
  Input,
  Dropdown as NextUIDropdown,
  Text,
  Spacer,
} from "@nextui-org/react";

import { Button, Table } from "./nextUI/index";

function MealForm() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [entryName, setEntryName] = useState("");
  const [mealArray, setMealArray] = useState([]);
  const [validation, setValidation] = useState(false);
  const [allGroups, setAllGroups] = useState([]);
  const [recentFoods, setRecentFoods] = useState([]);

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

  const fetchRecentFoods = async () => {
    try {
      const { data } = await apiClient.get("meals/recent");

      //[{name, groups}, {name, groups}, ...]
      setRecentFoods(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addFood = (foodObj) => {
    setMealArray([...mealArray, foodObj]);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const handleNameChange = (event) => {
    setEntryName(event.target.value);
  };

  const makeUnique = (array) => {
    return array.filter((item, idx) => array.indexOf(item) === idx);
  };

  const handleSubmit = async () => {
    try {
      if (
        !mealArray.length ||
        !time.length ||
        !date.length ||
        !entryName.length ||
        !mealArray.length
      ) {
        setValidation(true);
        return;
      }

      const foods = makeUnique(mealArray.map(({ name }) => name));
      const groups = mealArray.reduce((array, { groups }) => {
        groups.forEach((g) => {
          if (!array.includes(g)) array.push(g);
        });
        return array;
      }, []);

      await apiClient.post("users/addMeal", {
        date,
        time,
        foods,
        groups,
        entry_name: entryName,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const removeFood = ({ button: idx }) => {
    setMealArray([...mealArray.slice(0, idx), ...mealArray.slice(idx + 1)]);
  };

  const AddedFoods = () => {
    return (
      <Table
        description="Added foods table"
        headers={[
          { key: "name", label: "Foods" },
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
    <Grid.Container direction="row">
      <Grid.Container
        xs={6}
        css={{
          padding: "3rem",
          maxWidth: "40rem",
        }}
        gap={4}
      >
        <Grid xs={12}>
          <Input
            label="Entry Name"
            type="text"
            value={entryName}
            onChange={handleNameChange}
            required
            css={{ minWidth: "30rem" }}
          />
        </Grid>
        <Grid xs={12}>
          <Input
            width="186px"
            label="Date"
            type="date"
            value={date}
            onChange={handleDateChange}
            required
            css={{ minWidth: "10rem" }}
          />
          <Spacer x={1} />
          <Input
            width="186px"
            label="Time"
            type="time"
            value={time}
            onChange={handleTimeChange}
            required
            css={{ minWidth: "10rem" }}
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
                { key: "name", label: "Food" },
                { key: "button", label: "" },
              ]}
              rows={recentFoods}
              button={{
                buttonDescription: "Button to add a recent food to the meal",
                text: "Add food",
                onPress: addFood,
              }}
            />
          </Grid>
        )}
      </Grid.Container>
      <Grid.Container xs={6}>
        <Grid xs={12}>
          <AddedFoods />
        </Grid>
        <Button
          text="Submit Meal"
          ariaLabel="Button to submit a meal"
          onPress={handleSubmit}
          disabled={mealArray.length < 1}
        />
      </Grid.Container>
    </Grid.Container>
  );
}

export default MealForm;

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { me } from "../store/authSlice";
import Sidebar from "./Sidebar";
import Autocomplete from "./Autocomplete";
import apiClient from "../config";
import { Table, Button, Grid, Input, Dropdown, Text } from "@nextui-org/react";

function MealForm() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [entryName, setEntryName] = useState("");
  const [mealArray, setMealArray] = useState([]);
  const [validation, setValidation] = useState(false);
  const [allGroups, setAllGroups] = useState([]);

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

      console.log(foods, groups);

      return;

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

  const removeFood = (idx) => {
    console.log(idx);
    setMealArray([...mealArray.slice(0, idx), ...mealArray.slice(idx + 1)]);
  };

  const AddedFoods = () => {
    return (
      <Table
        aria-label="Added foods table"
        css={{
          height: "auto",
          width: "150px",
          minWidth: "20%",
        }}
      >
        <Table.Header>
          <Table.Column key={1}>Foods</Table.Column>
          <Table.Column key={2}>Groups</Table.Column>
          <Table.Column key={3}></Table.Column>
        </Table.Header>
        <Table.Body>
          {mealArray.map((food, i) => (
            <Table.Row key={i}>
              <Table.Cell>{food.name}</Table.Cell>
              <Table.Cell>{food.groups.join(", ")}</Table.Cell>
              <Table.Cell>
                <Button
                  size="xs"
                  color="error"
                  auto
                  onPress={() => removeFood(i)}
                >
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  };

  return (
    <>
      <Grid.Container justify="center" css={{ marginTop: "5rem" }} gap={4}>
        <Grid>
          <Input
            label="Entry Name"
            type="text"
            value={entryName}
            onChange={handleNameChange}
            required
          />
        </Grid>
        <Grid>
          <Input
            width="186px"
            label="Date"
            type="date"
            value={date}
            onChange={handleDateChange}
            required
          />
        </Grid>
        <Grid>
          <Input
            width="186px"
            label="Time"
            type="time"
            value={time}
            onChange={handleTimeChange}
            required
          />
        </Grid>

        <Grid>
          <Autocomplete addFood={addFood} allGroups={allGroups} />
        </Grid>

        <Grid>
          <Button color="primary" auto rounded onPress={handleSubmit}>
            Submit Meal
          </Button>
        </Grid>
        {mealArray.length ? <AddedFoods /> : null}
      </Grid.Container>
    </>
  );
}

export default MealForm;



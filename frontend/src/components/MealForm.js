import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { me } from "../store/authSlice";
import Sidebar from "./Sidebar";
import apiClient from "../config";

function MealForm() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [currentGroup, setCurrentGroup] = useState("");
  const [currentFood, setCurrentFood] = useState("");
  const [allGroups, setAllGroups] = useState(null);
  const [foodArray, setFoodArray] = useState([]);
  const [groupArray, setGroupArray] = useState([]);
  const [entryName, setEntryName] = useState("");

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
  }, []);

  //fetch groups from api
  const fetchGroups = async () => {
    try {
      const { data } = await apiClient.get("groups/");

      if (data && data["data"]) {
        setAllGroups(data["data"]);
        setCurrentGroup(data["data"][0]["name"]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addFood = (e) => {
    e.preventDefault();
    if (currentFood.length && currentGroup.length) {
      const foods = foodArray;
      const groups = groupArray;
      setFoodArray([...foods, currentFood]);
      setGroupArray([...groups, currentGroup]);
      setCurrentFood("");
    }
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const handleFoodGroupChange = (event) => {
    setCurrentGroup(event.target.value);
  };

  const handleFoodItems = (event) => {
    setCurrentFood(event.target.value);
  };

  const handleNameChange = (event) => {
    setEntryName(event.target.value);
  };

  const makeUnique = (array) => {
    return array.filter((item, idx) => array.indexOf(item) === idx);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const foods = makeUnique([...foodArray]);
      const groups = makeUnique([...groupArray]);

      if (currentGroup.length && currentFood.length) {
        foods.push(currentFood);
        groups.push(currentGroup);
      }

      const res = await apiClient.post("users/addMeal", {
        date,
        time,
        foods,
        groups,
        entry_name: entryName,
      });

      console.log(res);

      //navigate somewhere
    } catch (error) {
      console.error(error);
    }
  };

  const AddedFoods = () => {
    return (
      <table>
        <tr>
          <th>Food</th>
          <th>Group</th>
        </tr>
        {foodArray.length &&
          foodArray.map((food, i) => (
            <tr key={i}>
              <td>{food}</td>
              <td>{groupArray[i]}</td>
            </tr>
          ))}
      </table>
    );
  };

  return (
    <main>
      <Sidebar />
      <form>
        <div>
          <div>
            <label>
              Date:
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                required
              />
            </label>
            <label>
              Time:
              <input
                type="time"
                value={time}
                onChange={handleTimeChange}
                required
              />
            </label>
            <label>
              Entry name:
              <input
                type="text"
                value={entryName}
                onChange={handleNameChange}
                required
              />
            </label>
          </div>
          <label>
            Food Group:
            <select value={currentGroup} onChange={handleFoodGroupChange}>
              {allGroups &&
                allGroups.length &&
                allGroups.map((group) => (
                  <option value={group["name"]} key={group["id"]}>
                    {group["name"]}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Food:
            <input type="text" value={currentFood} onChange={handleFoodItems} />
          </label>

          <button onClick={addFood}>Add Food</button>
          <button
            onClick={handleSubmit}
            disabled={
              !(
                foodArray.length &&
                time.length &&
                date.length &&
                entryName.length
              )
            }
          >
            Submit Meal
          </button>

          {foodArray.length ? (
            <div>
              <br></br>
              Added foods: <AddedFoods />
            </div>
          ) : null}
        </div>
      </form>
    </main>
  );
}

export default MealForm;

//need to figure out how to autopopulate the food entry
//slider is a component

// {/* for all items */}
// {props.foodEntries.length > 0 && sort === "all"
// ? props.foodEntries.map((item) => {
//     return (
//       <FoodItem
//         key={item.id}
//         item={item}
//         removeTodo={props.addFoodEntry}

//       />
//     );
//   })

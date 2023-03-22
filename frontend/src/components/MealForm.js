import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEntry } from "../store/entrySlice";
import { me } from "../store/authSlice";
import Sidebar from "./Sidebar";

function Entry() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [foodGroup, setFoodGroup] = useState([]); 
  const [foodItems, setFoodItems] = useState([]);

  const dispatch = useDispatch();

  // Dispatch to get user information
  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  // Get username from auth state
  const username =
    useSelector((state) => {
      console.log(state.auth.me);
      return state.auth.me.username;
    }) || "";

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const handleFoodGroupChange = (event) => {
    setFoodGroup(event.target.value);
  };

  const handleFoodItems = (event) => {
    setFoodItems(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(
        addEntry({
          username,
          entry: {
            date,
            time,
          // make sure to push the foodGroups & foodItems into the array state
            foodGroup,
            foodItems,
          }, 
        // entryName
        })
      );

      console.log({
        date,
        time,
        foodGroup,
        foodItems,
      });
      setDate("");
      setTime("");
      setFoodGroup("");
      setFoodItems("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <Sidebar />
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Date:
            <input type="date" value={date} onChange={handleDateChange} />
          </label>
          <label>
            Time:
            <input type="time" value={time} onChange={handleTimeChange} />
          </label>
          <label>
            Food Group:
            <select value={foodGroup} onChange={handleFoodGroupChange}>
              <option value="goat">Goat</option>
              <option value="fish">Fish</option>
              <option value="processed">Processed Foods</option>
              <option value="beans">Beans, Peas, and Soy </option>
              <option value="fruit">Fruit</option>
              <option value="pork">Pork</option>
              <option value="beef">Beef</option>
              <option value="dairy">Milk, Yogurt, and Cheese</option>
              <option value="nuts">Nuts and Seeds</option>
              <option value="starchveg">Vegetables, Starchy</option>
              <option value="glutenfree">Grains, Gluten-Free</option>
              <option value="shellfish">Shellfish</option>
              <option value="lamb">Lamb</option>
              <option value="sugar">Refined Sugars</option>
              <option value="nonstarchveg">Vegetables, Non-Starchy</option>
              <option value="eggs">Eggs</option>
              <option value="caffeine">Caffeinated Beverages</option>
              <option value="gluten">Grains, Gluten</option>
              <option value="otherseafoods">Other Seafoods</option>
              <option value="poultry">Poultry</option>
            </select>
          </label>
          <label>
            Food:
            <input type="text" value={foodItems} onChange={handleFoodItems} />
          </label>
          <button type="submit">Add Entry</button>
        </div>
      </form>
    </main>
  );
}

export default Entry;

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

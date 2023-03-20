import React, { useState } from "react";

function Entry() {
  const [entryName, setEntryName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [foodGroup, setFoodGroup] = useState(''); 
  const [foodItems, setFoodItems] = useState('');

  const handleNameChange = (event) => {
    setEntryName(event.target.value);
  }

  const handleDateChange = (event) => {
    setDate(event.target.value);
  }

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  }

  const handleFoodGroupChange = (event) => {
    setFoodGroup(event.target.value);
  }

  const handleFoodItems = (event) => {
    setFoodItems(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      entryName,
      date,
      time,
      foodGroup,
    });
  }
  return (
    <form onSubmit={handleSubmit}>
    <div>
      <label>
        Name:
        <input type="text" value={entryName} onChange={handleNameChange} />
      </label>
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
  );
}

export default Entry;

//need to figure out how to autopopulate the food entry
//slider is a component
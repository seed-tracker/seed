import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { fetchAllMealEntries, selectAllMeals } from "../store/allEntriesSlice";
import { v4 as uuidv4 } from "uuid";

function MealEntryOverview() {
  const [meals, setMeals] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const mealEntries = useSelector(selectAllMeals);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllMealEntries(page));
  }, [dispatch, page]);

  useEffect(() => {
    setCount(mealEntries.mealCount);
    setMeals(mealEntries.meals);
  }, [mealEntries]);

  return (
    <main>
      <Sidebar />
      <h1>Past Meal Entries</h1>
      <ul>
        {meals && meals.length
          ? meals.map((meal) => {
              return (
                <li key={uuidv4()}>
                  <p>
                    {new Date(meal.datetime).toLocaleString("en-US", {
                      dateStyle: "full",
                      timeStyle: "long",
                    })}
                  </p>
                  <p>{meal.entry_name}</p>
                  <p>Food Groups: {meal.groups?.join(", ")}</p>
                  <p>Foods: {meal.foods?.join(", ")}</p>
                  <button>Delete</button>
                </li>
              );
            })
          : "No entries to display"}
      </ul>
      Pagination still needs to be implemented
    </main>
  );
}

export default MealEntryOverview;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  fetchAllMealEntries,
  selectAllMeals,
  deleteMealEntry,
} from "../store/allEntriesSlice";
import { v4 as uuidv4 } from "uuid";

function MealEntryOverview() {
  const [meals, setMeals] = useState([]);
  const [count, setCount] = useState(0);
  const mealEntries = useSelector(selectAllMeals);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const maxPages = Math.ceil(count / 20);

  const [searchParams] = useSearchParams();
  let { page } = Object.fromEntries([...searchParams]);
  page = Number(page);
  if (!page || isNaN(page)) page = 1;

  useEffect(() => {
    dispatch(fetchAllMealEntries(page));
    navigate(`/user/meal-entries?page=${page}`);
  }, [dispatch, page]);

  useEffect(() => {
    setCount(mealEntries.mealCount);
    setMeals(mealEntries.meals);
  }, [mealEntries]);

  const handlePageChange = (event) => {
    if (event.target.value === "previous") {
      page -= 1;
      navigate(`/user/meal-entries?page=${page}`);
    } else if (event.target.value === "next") {
      page += 1;
      navigate(`/user/meal-entries?page=${page}`);
    }
  };

  const handleEntryDelete = async (id) => {
    await dispatch(deleteMealEntry(id));
    await dispatch(fetchAllMealEntries(page));
  };

  return (
    <main>
      <h1>Past Meal Entries</h1>
      <aside>
        {count < 500 && (
          <p>
            You've logged {count} <strong>meal</strong> entries so far - keep
            tracking for better results!
          </p>
        )}
        {count >= 500 && (
          <p>
            You've logged {count} <strong>meal</strong> entries so far. Keep up
            the good work!
          </p>
        )}
      </aside>
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
                  <button onClick={() => handleEntryDelete(meal._id)}>
                    Delete
                  </button>
                </li>
              );
            })
          : "No entries to display"}
      </ul>

      <div>
        {page > 1 && (
          <button
            value="previous"
            onClick={(e) => handlePageChange(e, "previous")}
          >
            {`<<`}
          </button>
        )}
        <p>{page}</p>
        {page < maxPages && (
          <button value="next" onClick={(e) => handlePageChange(e, "next")}>
            {`>>`}
          </button>
        )}
      </div>
    </main>
  );
}

export default MealEntryOverview;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Sidebar from "./Sidebar";
import { fetchAllMealEntries, selectAllMeals } from "../store/allEntriesSlice";
import { v4 as uuidv4 } from "uuid";

function MealEntryOverview() {
  const [meals, setMeals] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const mealEntries = useSelector(selectAllMeals);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const maxPages = Math.ceil(count / 20);

  useEffect(() => {
    dispatch(fetchAllMealEntries(page));
    navigate(`/user/mealEntries?page=${page}`);
  }, [dispatch, page]);

  useEffect(() => {
    setCount(mealEntries.mealCount);
    setMeals(mealEntries.meals);
  }, [mealEntries]);

  const handlePageChange = (event) => {
    if (event.target.value === "previous") {
      const newPage = page - 1;
      setPage(newPage);
      navigate(`/user/mealEntries?page=${newPage}`);
    } else if (event.target.value === "next") {
      const newPage = page + 1;
      setPage(newPage);
      navigate(`/user/mealEntries?page=${newPage}`);
    }
  };

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

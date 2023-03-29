import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import {
  fetchAllMealEntries,
  resetError,
  deleteMealEntry,
} from "../store/allEntriesSlice";
import { v4 as uuidv4 } from "uuid";
import { HeaderText, MealCard, Pagination, PageLoading } from "./nextUI/index";
import { Grid, Container } from "@nextui-org/react";

function MealEntryOverview() {
  const [meals, setMeals] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { mealEntries, error } = useSelector((state) => state.allEntries);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const maxPages = Math.ceil(count / 20);

  const [searchParams] = useSearchParams();
  let { page } = Object.fromEntries([...searchParams]);
  page = Number(page);
  if (!page || isNaN(page)) page = 1;

  useEffect(() => {
    dispatch(resetError());
    dispatch(fetchAllMealEntries(page));
    navigate(`/user/meal-entries?page=${page}`);
  }, [dispatch, page]);

  useEffect(() => {
    setCount(mealEntries.mealCount);
    setMeals(mealEntries.meals);
    if (
      (mealEntries.meals && mealEntries.meals.length > 0) ||
      (error && error.length)
    )
      setLoading(false);
  }, [mealEntries, error]);

  const handlePageChange = (page) => {
    navigate(`/user/meal-entries?page=${page}`);
    window.scrollTo(0, 0);
  };

  const handleEntryDelete = async (id) => {
    dispatch(deleteMealEntry(id));
    dispatch(fetchAllMealEntries(page));
  };

  return (
    <Container
      fluid
      justify="flex-start"
      align="flex-start"
      css={{ padding: "3rem" }}
    >
      {loading ? (
        <PageLoading text="Loading..." />
      ) : (
        <>
          <HeaderText text="Past Meal Entries" />
          <aside>
            {count < 500 && count > 0 && (
              <p>
                You've logged <strong>{count} meals</strong> so far - keep
                tracking for better results!
              </p>
            )}
            {count >= 500 && (
              <p>
                You've logged <strong>{count} meals</strong> so far. Keep up the
                good work!
              </p>
            )}
          </aside>
          {meals && meals.length ? (
            <>
              <Grid.Container gap={3}>
                {meals.map((meal) => {
                  return (
                    <Grid xs={4} key={uuidv4()} css={{ minWidth: "20rem" }}>
                      <MealCard meal={meal} onPress={handleEntryDelete} />
                    </Grid>
                  );
                })}
              </Grid.Container>
              {maxPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={maxPages}
                  onChange={handlePageChange}
                />
              )}
            </>
          ) : (
            "No entries to display"
          )}
        </>
      )}
    </Container>
  );
}

export default MealEntryOverview;

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

//list of all of the user's previous meals
//includes button to delete each meal
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
    ) {
      setLoading(false);
      if (error && error.length) {
        setCount(0);
      }
    }
  }, [mealEntries, error, meals, count]);

  const handlePageChange = (page) => {
    navigate(`/user/meal-entries?page=${page}`);
    window.scrollTo(0, 0);
  };

  const handleEntryDelete = async (id) => {
    await dispatch(deleteMealEntry(id));
    dispatch(fetchAllMealEntries(page));
  };

  return (
    <Container
      css={{
        "@xs": {
          margin: 0,
          padding: "3vw",
          textAlign: "center",
          maxWidth: "100vw",
        },
        "@sm": {
          margin: 0,
          padding: "3vw",
          flexDirection: "column",
          maxWidth: "80vw",
        },
        padding: "3vw",
      }}
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
              <Grid.Container gap={3} justify="flex-start" align="flex-end">
                {meals.map((meal) => {
                  return (
                    <Grid xs={12} sm={6} md={4} key={uuidv4()}>
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
            <Container
              display={"flex"}
              justify="center"
              align="center"
              className="glassmorpheus-graph"
              css={{ margin: "2rem", padding: "2rem", maxWidth: "72vw" }}
            >
              {error === "No meals found" && (
                <HeaderText text="We don't have any meals recorded, start tracking!" />
              )}
            </Container>
          )}
        </>
      )}
    </Container>
  );
}

export default MealEntryOverview;

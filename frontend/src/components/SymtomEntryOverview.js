import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import {
  HeaderText,
  SymptomCard,
  Pagination,
  PageLoading,
} from "./nextUI/index";
import {
  fetchAllSymptomEntries,
  resetError,
  deleteSymptomEntry,
} from "../store/allEntriesSlice";
import { v4 as uuidv4 } from "uuid";
import { Grid, Container } from "@nextui-org/react";

function SymptomEntryOverview() {
  const [symptoms, setSymptoms] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { symptomEntries, error } = useSelector((state) => state.allEntries);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const maxPages = Math.ceil(count / 20);

  const [searchParams] = useSearchParams();
  let { page } = Object.fromEntries([...searchParams]);
  page = Number(page);
  if (!page || isNaN(page)) page = 1;

  useEffect(() => {
    dispatch(resetError());
    dispatch(fetchAllSymptomEntries(page));
    navigate(`/user/symptom-entries?page=${page}`);
  }, [dispatch, page]);

  useEffect(() => {
    setCount(symptomEntries.symptomCount);
    setSymptoms(symptomEntries.symptoms);
    if (
      (symptomEntries.symptoms && symptomEntries.symptoms.length > 0) ||
      (error && error.length)
    ) {
      setLoading(false);
      if (error && error.length) {
        setCount(0);
      }
    }
  }, [symptomEntries, error, symptoms, count]);

  const handlePageChange = (page) => {
    navigate(`/user/symptom-entries?page=${page}`);
    window.scrollTo(0, 0);
  };

  const handleEntryDelete = async (id) => {
    await dispatch(deleteSymptomEntry(id));
    dispatch(fetchAllSymptomEntries(page));
  };

  return (
    <Container
      css={{
        "@xs": {
          margin: 0,
          padding: "1vw",
          textAlign: "center",
          maxWidth: "100vw",
        },
        "@sm": {
          margin: 0,
          padding: "3vw",
          flexDirection: "column",
          maxWidth: "69vw",
        },
      }}
    >
      {loading ? (
        <PageLoading text="We're fetching your symptoms..." />
      ) : (
        <>
          <HeaderText text="Past Symptom Entries" />
          <aside>
            {count < 500 && count > 0 && (
              <p>
                You've logged <strong>{count} symptoms</strong> so far - keep
                tracking for better results!
              </p>
            )}
            {count >= 500 && (
              <p>
                You've logged <strong>{count} symptoms</strong> so far. Keep up
                the good work!
              </p>
            )}
          </aside>
          {symptoms && symptoms.length && !error ? (
            <>
              <Grid.Container gap={3} justify="flex-start" align="flex-end">
                {symptoms.map((symptom) => {
                  return (
                    <Grid xs={4} key={uuidv4()} css={{ minWidth: "16rem" }}>
                      <SymptomCard
                        symptom={symptom}
                        onPress={handleEntryDelete}
                      />
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
              {error === "No symptoms found" && (
                <HeaderText
                  text="We don't have any symptoms recorded, start
                  tracking!"
                />
              )}
            </Container>
          )}
        </>
      )}
    </Container>
  );
}

export default SymptomEntryOverview;

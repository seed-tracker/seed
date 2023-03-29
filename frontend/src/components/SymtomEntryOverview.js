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
    )
      setLoading(false);
  }, [symptomEntries, error]);

  const handlePageChange = (page) => {
    navigate(`/user/symptom-entries?page=${page}`);
    window.scrollTo(0, 0);
  };

  const handleEntryDelete = async (id) => {
    dispatch(deleteSymptomEntry(id));
    dispatch(fetchAllSymptomEntries(page));
  };

  return (
    <Container css={{ padding: "3rem", maxWidth: "65rem" }}>
      {loading ? (
        <PageLoading text="We're fetching your symptoms..." />
      ) : (
        <main>
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
          {symptoms && symptoms.length ? (
            <section>
              <Grid.Container gap={3}>
                {symptoms.map((symptom) => {
                  return (
                    <Grid
                      xs={2}
                      key={uuidv4()}
                      css={{ minWidth: "18rem", maxWidth: "25rem" }}
                    >
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
            </section>
          ) : (
            "No symptom entries to display"
          )}
        </main>
      )}
    </Container>
  );
}

export default SymptomEntryOverview;

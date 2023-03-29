import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { HeaderText, SymptomCard, Pagination } from "./nextUI/index";
import {
  fetchAllSymptomEntries,
  selectAllSymptoms,
  deleteSymptomEntry,
} from "../store/allEntriesSlice";
import { v4 as uuidv4 } from "uuid";
import { Grid } from "@nextui-org/react";

function SymptomEntryOverview() {
  const [symptoms, setSymptoms] = useState([]);
  const [count, setCount] = useState(0);
  const symptomEntries = useSelector(selectAllSymptoms);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const maxPages = Math.ceil(count / 20);

  const [searchParams] = useSearchParams();
  let { page } = Object.fromEntries([...searchParams]);
  page = Number(page);
  if (!page || isNaN(page)) page = 1;

  useEffect(() => {
    dispatch(fetchAllSymptomEntries(page));
    navigate(`/user/symptom-entries?page=${page}`);
  }, [dispatch, page]);

  useEffect(() => {
    setCount(symptomEntries.symptomCount);
    setSymptoms(symptomEntries.symptoms);
  }, [symptomEntries]);

  const handlePageChange = (page) => {
    navigate(`/user/symptom-entries?page=${page}`);
    window.scrollTo(0, 0);
  };

  const handleEntryDelete = async (id) => {
    await dispatch(deleteSymptomEntry(id));
    await dispatch(fetchAllSymptomEntries(page));
  };

  return (
    <main>
      <HeaderText text="Past Symptom Entries" />
      <aside>
        {count < 500 && (
          <p>
            You've logged {count} <strong>symptom</strong> entries so far - keep
            tracking for better results!
          </p>
        )}
        {count >= 500 && (
          <p>You've logged {count} entries so far. Keep up the good work!</p>
        )}
      </aside>
      {symptoms && symptoms.length ? (
        <Grid.Container gap={3}>
          {symptoms.map((symptom) => {
            return (
              <Grid
                xs={2}
                key={uuidv4()}
                css={{ minWidth: "20rem", maxWidth: "25rem" }}
              >
                <SymptomCard symptom={symptom} onPress={handleEntryDelete} />
              </Grid>
            );
          })}
        </Grid.Container>
      ) : (
        "No symptom entries to display"
      )}
      <div>
        <Pagination
          page={page}
          totalPages={maxPages}
          onChange={handlePageChange}
        />
      </div>
    </main>
  );
}

export default SymptomEntryOverview;

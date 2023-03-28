import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import {HeaderText} from './nextUI/index';
import {
  fetchAllSymptomEntries,
  selectAllSymptoms,
  deleteSymptomEntry,
} from "../store/allEntriesSlice";
import { v4 as uuidv4 } from "uuid";

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

  const handlePageChange = (event) => {
    if (event.target.value === "previous") {
      page -= 1;
      navigate(`/user/symptom-entries?page=${page}`);
    } else if (event.target.value === "next") {
      page += 1;
      navigate(`/user/symptom-entries?page=${page}`);
    }
  };

  const handleEntryDelete = async (id) => {
    await dispatch(deleteSymptomEntry(id));
    await dispatch(fetchAllSymptomEntries(page));
  };

  return (
    <main>
      <HeaderText text='Past Symptom Entries' />
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
      <ul>
        {symptoms && symptoms.length
          ? symptoms.map((symptom) => {
              return (
                <li key={uuidv4()}>
                  <p>
                    {new Date(symptom.datetime).toLocaleString("en-US", {
                      dateStyle: "full",
                      timeStyle: "long",
                    })}
                  </p>
                  <p>{symptom.symptom}</p>
                  <p>Severity: {symptom.severity}</p>
                  <button onClick={() => handleEntryDelete(symptom._id)}>
                    Delete
                  </button>
                </li>
              );
            })
          : "No symptom entries to display"}
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

export default SymptomEntryOverview;

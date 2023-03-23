import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Sidebar from "./Sidebar";
import {
  fetchAllSymptomEntries,
  selectAllSymptoms,
} from "../store/allEntriesSlice";
import { v4 as uuidv4 } from "uuid";

function SymptomEntryOverview() {
  const [symptoms, setSymptoms] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const symptomEntries = useSelector(selectAllSymptoms);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const maxPages = Math.ceil(count / 20);

  useEffect(() => {
    dispatch(fetchAllSymptomEntries(page));
    navigate(`/user/symptomEntries?page=${page}`);
  }, [dispatch, page]);

  useEffect(() => {
    setCount(symptomEntries.symptomCount);
    setSymptoms(symptomEntries.symptoms);
  }, [symptomEntries]);

  const handlePageChange = (event) => {
    if (event.target.value === "previous") {
      const newPage = page - 1;
      setPage(newPage);
      navigate(`/user/symptomEntries?page=${newPage}`);
    } else if (event.target.value === "next") {
      const newPage = page + 1;
      setPage(newPage);
      navigate(`/user/symptomEntries?page=${newPage}`);
    }
  };

  return (
    <main>
      <Sidebar />
      <h1>Past Symptom Entries</h1>
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
                  <button>Delete</button>
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

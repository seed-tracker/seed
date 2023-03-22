import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  useEffect(() => {
    dispatch(fetchAllSymptomEntries(page));
  }, [dispatch, page]);

  useEffect(() => {
    setCount(symptomEntries.symptomCount);
    setSymptoms(symptomEntries.symptoms);
  }, [symptomEntries]);

  return (
    <main>
      <Sidebar />
      <h1>Past Symptom Entries</h1>
      {console.log(symptoms)}
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
                  <button>Edit</button>
                  <button>Delete</button>
                </li>
              );
            })
          : "No entries to display"}
      </ul>
    </main>
  );
}

export default SymptomEntryOverview;

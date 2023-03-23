import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  fetchAllSymptomEntries,
  selectAllSymptoms,
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
    navigate(`/user/symptomEntries?page=${page}`);
  }, [dispatch, page]);

  useEffect(() => {
    setCount(symptomEntries.symptomCount);
    setSymptoms(symptomEntries.symptoms);
  }, [symptomEntries]);

  const handlePageChange = (event) => {
    if (event.target.value === "previous") {
      page -= 1;
      navigate(`/user/symptomEntries?page=${page}`);
    } else if (event.target.value === "next") {
      page += 1;
      navigate(`/user/symptomEntries?page=${page}`);
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

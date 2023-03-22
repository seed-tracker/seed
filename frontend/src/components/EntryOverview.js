import React, { useState } from "react";
import { editProfile } from "../store/entrySlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { selectAuthUser } from "../store";
import Sidebar from "./Sidebar";

function EntryOverview() {
  const [meals, setMeals] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [entries, setEntires] = useState([]);

  // const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);

  const handleEntryDelete = (entry) => {
    if (entry.type === "meal") {
      // dispatch action to delete meal
    } else {
      // dispatch action to delete symptom
    }
  };

  return (
    <main>
      <Sidebar />
      <h1>Past Entries</h1>
      <ul>
        {entries && entries.length
          ? entries.map((entry) => {
              return (
                <li>
                  <p>
                    {entry.date || "date"} <span>{entry.name || "name"}</span>
                  </p>
                  <Link to="/user/entry">
                    <button>View</button>
                  </Link>
                  <Link to="/user/entry/edit">
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleEntryDelete(entry)}>
                    Delete
                  </button>
                </li>
              );
            })
          : "No entries to display"}
      </ul>
    </main>
  );
}

export default EntryOverview;

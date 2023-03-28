import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { me } from "../store/authSlice";
import { addSymptomEntry } from "../store/symptomSlice";
import Sidebar from "./Sidebar";
import apiClient from "../config";

const SymptomForm = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState("");
  const [symptoms, setSymptoms] = useState(null);

  const user = useSelector((state) => state.auth.me);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSymptomSubmit = async (event) => {
    event.preventDefault();
    await dispatch(
      addSymptomEntry({
        username: user.username,
        date: date,
        time: time,
        symptom: symptom,
        severity: severity,
      })
    );
    navigate("/profile");
  };

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  useEffect(() => {
    fetchSymptoms();
    const today = new Date().toISOString();
    setTime(today.substring(11, 16));
    setDate(today.substring(0, 10));
    setSeverity(5);
  }, []);

  const fetchSymptoms = async () => {
    try {
      const { data } = await apiClient.get("symptoms/");
      if (data) {
        setSymptoms(data.map((sym) => sym["name"]));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main>
      <form onSubmit={handleSymptomSubmit}>
        <label htmlFor="date">
          Date:
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <label htmlFor="time">
          Time:
          <input
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
          />
        </label>
        <div>
          <label htmlFor="symptoms">Select symptom(s):</label>
          <select
            name="symptoms"
            value={symptom}
            onChange={(event) => setSymptom(event.target.value)}
          >
            {symptoms &&
              symptoms.length &&
              symptoms.map((symptom) => (
                <option key={symptom} value={symptom}>
                  {symptom}
                </option>
              ))}
          </select>
        </div>
        <label htmlFor="severity">
          Severity: {severity}
          <input
            type="range"
            min="0"
            max="10"
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
          />
        </label>
        <button type="submit">Add Entry</button>
      </form>
    </main>
  );
};

export default SymptomForm;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { me } from "../store/authSlice";
import apiClient from "../config";
import { Text, Spacer } from "@nextui-org/react";
import { Inputs, Button, Dropdown, Table, HeaderText } from "./nextUI/index";
import SuccessMessage from "./SuccessMessage";

const SymptomForm = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [recentSymptoms, setRecentSymptoms] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const user = useSelector((state) => state.auth.me);

  const dispatch = useDispatch();

  // submit the symptom
  const handleSymptomSubmit = async (e) => {
    try {
      e.preventDefault();

      // set an error if user hasn't added a symptom
      if (!symptom) {
        setError("Please add a symptom");
        return;
      }

      // send the request
      const { status } = await apiClient.post(`user/symptoms/`, {
        username: user.username,
        date: date,
        time: time,
        symptom: symptom[0],
        severity: severity,
      });

      // if successful, reset the form and open the success message
      if (status === 201) {
        setSuccess(true);
        setError("");
        dateTime();
        setSeverity("");
        setSymptom("");
      } else {
        setError(
          "There was an issue adding your symptom. Please try again later."
        );
      }
      // navigate("/profile");
    } catch (error) {
      console.error(error);
      setError(
        "There was a problem adding your symptom. Please try again later"
      );
    }
  };

  // dispatch to get user information
  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  // Set date & time to current. to be used on mount and after form submit (when resetting all fields)
  const dateTime = () => {
    const today = new Date().toISOString();
    setTime(today.substring(11, 16));
    setDate(today.substring(0, 10));
  };

  // fetch symptoms when the component mounts
  useEffect(() => {
    fetchSymptoms();
    fetchRecentSymptoms();
    dateTime();
    setSeverity(5);
  }, []);

  // fetch the list of symptoms to populate the dropdown
  const fetchSymptoms = async () => {
    try {
      const { data } = await apiClient.get("symptoms/");
      if (data) {
        setSymptoms(data.map((sym) => ({ name: sym.name, key: sym.name })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // fetch the most recent symptoms that user has inputted
  const fetchRecentSymptoms = async () => {
    try {
      const { data } = await apiClient.get("user/symptoms/recent");
      if (data) {
        // setRecentSymptoms(data)
        setRecentSymptoms(data.map((symptom) => ({ name: symptom })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main>
      <HeaderText text="Add a symptom" />
      <form onSubmit={handleSymptomSubmit}>
        {!success ? (
          <>
            <Inputs
              type={"date"}
              required={true}
              label={"Date:"}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              helperText={"required"}
            />
            <Inputs
              type={"time"}
              required={true}
              label={"Time:"}
              value={time}
              onChange={(event) => setTime(event.target.value)}
              helperText={"required"}
            />
            <div>
              <label htmlFor="symptoms">Select symptom(s):</label>
              <Dropdown
                color={"#7A918D"}
                css={{
                  background: "#7a918d",
                  padding: "1rem",
                }}
                selectedKeys={symptom}
                ariaLabel="Select Symptom Dropdown"
                onChange={({ currentKey }) => setSymptom([currentKey])}
                items={symptoms}
                defaultName={"How are you feeling?"}
              />
            </div>
            <Spacer y={1} />
            <div>
              <Table
                color="primary"
                css={{ padding: "1rem" }}
                description="Recent symptoms table"
                headers={[
                  { key: "name", label: "Your recent symptoms" },
                  { key: "button", label: "" },
                ]}
                rows={recentSymptoms}
                button={{
                  buttonDescription: "Button to add a recent symptom",
                  text: "Select symptom",
                  onPress: (e) => setSymptom([e.name]),
                }}
              />
            </div>
            <Spacer y={1} />
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
            <Button
              text={"Add Entry"}
              arialabel={"Submit Symptom Entry Form Button"}
              type={"submit"}
            />
            {error.length > 1 && <Text color="red">{error}</Text>}
          </>
        ) : (
          <SuccessMessage
            title="Thanks for adding a symptom!"
            message="Every symptom you add makes our predictions better."
            type="symptom"
            onClick={() => setSuccess(false)}
          />
        )}
      </form>
    </main>
  );
};

export default SymptomForm;

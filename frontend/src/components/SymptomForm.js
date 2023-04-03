import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { me } from "../store/authSlice";
import apiClient from "../client";
import { Text, Spacer, Container, Grid } from "@nextui-org/react";
import { Inputs, Button, Dropdown, Table, HeaderText, Slider } from "./nextUI";
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
  const [validate, setValidate] = useState(false);

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
        dateTime("");
        setSeverity(5);
        setSymptom("");
        setValidate(false);
      } else {
        setError(
          "There was an issue adding your symptom. Please try again later."
        );
      }
      // navigate("/profile");
    } catch (error) {
      console.debug(error);
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
      console.debug(err);
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
      console.debug(err);
    }
  };

  return (
    <form onSubmit={handleSymptomSubmit} className="entryForm">
      {!success ? (
        <Grid.Container
          display="flex"
          justify="space-around"
          wrap="wrap"
          alignItems="center"
          css={{ margin: "0" }}
          gap={1}
        >
          {" "}
          <Grid display="flex" justify="center" xs={12}>
            <HeaderText text="Add a Symptom" />
          </Grid>
          <Grid
            md={2}
            display="flex"
            direction="column"
            css={{ minWidth: "15rem" }}
          >
            <Inputs
              type={"date"}
              required={true}
              label={"Date:"}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              helperText={"required"}
              status={validate && !date.length ? "error" : "default"}
            />
            <Inputs
              type="time"
              required={true}
              label="Time:"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              helperText="required"
              status={validate && !time.length ? "error" : "default"}
            />

            <label htmlFor="symptoms">Select symptom(s):</label>
            <Dropdown
              color="#7A918D"
              css={{
                background: "#7a918d",
                padding: "1rem",
                maxWidth: "10rem",
              }}
              selectedKeys={symptom}
              ariaLabel="Select Symptom Dropdown"
              onChange={({ currentKey }) => setSymptom([currentKey])}
              items={symptoms}
              defaultName="How are you feeling?"
              status={validate && !symptom.length ? "error" : "default"}
            />
          </Grid>
          <Grid
            display={"flex"}
            direction="column"
            css={{
              margin: 0,
              padding: 0,
              maxWidth: "30vw",
              minWidth: "15rem",
              marginTop: "2rem",
            }}
            lg={4}
            md={3}
            xs={7}
          >
            <Table
              color="primary"
              css={{ padding: "1rem", maxWidth: "20rem" }}
              description="Recent symptoms table"
              headers={[
                { key: "name", label: "YOUR RECENT SYMPTOMS" },
                { key: "button", label: "" },
              ]}
              rows={recentSymptoms}
              button={{
                buttonDescription: "Button to add a recent symptom",
                text: "Select",
                onPress: (e) => setSymptom([e.name]),
              }}
            />
            <Spacer y={2} />
          </Grid>
          <Container
            display="flex"
            direction="column"
            alignItems="center"
            css={{ margin: 0, padding: 0 }}
          >
            <label htmlFor="severity">
              <Text css={{ textAlign: "center", letterSpacing: "$normal" }}>
                Severity:
              </Text>
              <Slider
                min={0}
                max={10}
                value={severity}
                tooltip="on"
                onChange={(event) => setSeverity(event.target.value)}
              />
            </label>
            <Spacer y={2} />
            <Button
              text="Add Entry"
              arialabel="Submit Symptom Entry Form Button"
              type="submit"
              onPress={() => setValidate(true)}
            />
            <Spacer y={1} />
          </Container>
          {error.length > 1 && <Text color="red">{error}</Text>}
        </Grid.Container>
      ) : (
        <Container display="flex" css={{ margin: "5vh 15vw" }}>
          <SuccessMessage
            title="Thanks for adding a symptom!"
            message="Every symptom you add makes our predictions better."
            type="symptom"
            onClick={() => setSuccess(false)}
          />
        </Container>
      )}
    </form>
  );
};

export default SymptomForm;

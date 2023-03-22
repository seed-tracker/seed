import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import { me } from "../../store/authSlice"
import { addSymptomEntry } from "./symptomSlice"

const SymptomForm = () => {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [symptom, setSymptom] = useState("")
  const [severity, setSeverity] = useState("")

  const user = useSelector((state) => state.auth.me)
  console.log(user.username);

  const dispatch = useDispatch()


  const handleSymptomSubmit = async (event) => {
    event.preventDefault()
    await dispatch(addSymptomEntry({
      "username": user.username,
      "date": date,
      "time": time,
      "symptom": symptom,
      "severity": severity,
    }))
  }

  useEffect(() => {
    dispatch(me())
  }, [dispatch])

  const symptoms = [
    "Fatigue",
    "Dizziness",
    "Constipation",
    "Nausea",
    "Swelling",
    "Itchiness",
    "Abdominal Pain",
    "Indigestion",
    "Headache",
    "Dermatitis"
  ]

  return (
    <form onSubmit={handleSymptomSubmit}>
      <label htmlFor="date">
        Date:
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)}/>
      </label>
      <label htmlFor="time">
        Time:
        <input type="time" value={time} onChange={(event) => setTime(event.target.value)}/>
      </label>
      <div>
        <label htmlFor="symptoms">Select symptom(s):</label>
        <select name="symptoms" value={symptom} onChange={(event) => setSymptom(event.target.value)}>
          {symptoms.map((symptom) => (
            <option key={symptom} value={symptom}>{symptom}</option>
          ))}
        </select>
      </div>
      <label htmlFor="severity">
        Severity:
        <input type="range" min="0" max="10" value={severity} onChange={(event) => setSeverity(event.target.value)}/>
      </label>
      <button type="submit">Add Entry</button>
    </form>
  )
}

export default SymptomForm

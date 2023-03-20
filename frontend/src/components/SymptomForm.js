import React, {useState} from "react"

const SymptomForm = () => {
  const [entryName, setEntryName] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")

  const handleSymptomChange = (event) => {
    console.log(event.target.value);
  }

  const handleSymptomSubmit = (event) => {
    event.preventDefault()
    console.log("submit");
  }

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
      <label htmlFor="entry name">
        Entry Name:
        <input type="text" value={entryName} onChange={(event) => setEntryName(console.log(event.target.value))}/>
      </label>
      <label htmlFor="date">
        Date:
        <input type="date" value={date} onChange={(event) => setDate(console.log(event.target.value))}/>
      </label>
      <label htmlFor="time">
        Time:
        <input type="time" value={time} onChange={(event) => setTime(console.log(event.target.value))}/>
      </label>
      <div>
        <label htmlFor="symptoms">Select symptom(s):</label>
        {/* need to add value */}
        <select name="symptoms" onChange={(event) => console.log(event.target.value)}>
          {symptoms.map((symptom) => (
            <option key={symptom} value={symptom}>{symptom}</option>
          ))}
        </select>
      </div>
      <button type="submit">Add Entry</button>
    </form>
  )
}

export default SymptomForm

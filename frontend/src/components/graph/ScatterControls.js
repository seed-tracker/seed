import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";
import { fetchScatterData } from "../../store/scatterSlice";

const ScatterControls = ({ symptomList, toggleSymptom, maxMonths }) => {
  const [months, setMonths] = useState([]);
  const [sliderVal, setSliderVal] = useState(maxMonths);

  useEffect(() => {
    if (!maxMonths || maxMonths < 3) return;
    let monthsArr = [3];

    if (maxMonths >= 6) monthsArr.push(6);
    if (maxMonths >= 12) monthsArr.push(12);
    if (maxMonths >= 24) monthsArr.push(24);

    setMonths(monthsArr);
  }, []);

  return (
    <section>
      <section>
        {months.map((num) => (
          <button value={num} className="time_range_btn" key={num}>
            {num >= 12 ? `${Math.floor(num / 12)} years` : `${num} months`}
          </button>
        ))}
        <button value={maxMonths} className="time_range_btn">
          All time
        </button>
        <input
          type="range"
          min="3"
          max={12 || maxMonths || 3}
          className="slider"
          step="1"
          onChange={(e) => setSliderVal(e.target.value)}
        />{" "}
        {sliderVal}
      </section>
      <section>
        {symptomList
          ? symptomList.length &&
            symptomList.map((s, i) => (
              <button key={i} onClick={() => toggleSymptom(s)}>
                {s}
              </button>
            ))
          : null}
      </section>
    </section>
  );
};

export default ScatterControls;

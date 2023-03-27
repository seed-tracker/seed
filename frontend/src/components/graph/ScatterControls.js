import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";
import { fetchScatterData } from "../../store/scatterSlice";

const ScatterControls = ({ symptomList, toggleSymptom, maxMonths }) => {
  const [sliderVal, setSliderVal] = useState(maxMonths);

  return (
    <section>
      <section>
        <input
          type="range"
          min="3"
          max={maxMonths || 3}
          className="slider"
          step="1"
          onChange={(e) => setSliderVal(Number(e.target.value))}
        />{" "}
        {sliderVal === 12
          ? "1 year"
          : sliderVal % 12 === 0 && sliderVal > 13
          ? `${sliderVal / 12} years`
          : `${sliderVal} months`}
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

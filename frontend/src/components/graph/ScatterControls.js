import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";
import { fetchScatterData } from "../../store/scatterSlice";

const ScatterControls = ({
  symptomList,
  toggleSymptom,
  changeTimeRange,
  maxMonths,
}) => {
  const [months, setMonths] = useState([]);

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
          <button value={num} onClick={changeTimeRange}>
            {num >= 12 ? `${Math.floor(num / 12)} years` : `${num} months`}
          </button>
        ))}
        <button value={maxMonths} onClick={changeTimeRange}>
          All time
        </button>
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

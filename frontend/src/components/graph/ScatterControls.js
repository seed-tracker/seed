import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";
import { fetchScatterData } from "../../store/scatterSlice";

const ScatterControls = ({
  symptomList,
  symptomData,
  toggleFood,
  toggleGroup,
  toggleSymptom,
  changeTimeRange,
}) => {
  console.log(symptomData.food);
  return (
    <section>
      <section>
        <button value={1200} onClick={changeTimeRange}>
          All time
        </button>
        <button value={12} onClick={changeTimeRange}>
          1 year
        </button>
        <button value={6} onClick={changeTimeRange}>
          6 months
        </button>
        <button value={3} onClick={changeTimeRange}>
          3 months
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
      {symptomData.foodData ? (
        <section>
          Foods:
          {symptomData.foodData.map(({ name }, i) => (
            <button key={i} onClick={() => toggleFood(name)}>
              {name}
            </button>
          ))}
        </section>
      ) : null}
      {symptomData.groupData ? (
        <section>
          Food groups:
          {symptomData.groupData.map(({ name }, i) => (
            <button key={i} onClick={() => toggleGroup(name)}>
              {name}
            </button>
          ))}
        </section>
      ) : null}
    </section>
  );
};

export default ScatterControls;

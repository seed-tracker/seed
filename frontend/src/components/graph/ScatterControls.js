import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";
import { fetchScatterData } from "../../store/scatterSlice";
import { Text, Button, Row } from "@nextui-org/react";

const ScatterControls = ({
  symptomList,
  toggleSymptom,
  maxMonths,
  currentSymptom,
}) => {
  const [sliderVal, setSliderVal] = useState(maxMonths);

  return (
    <section>
  <Text h4>Most common symptoms </Text>
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    {symptomList
      ? symptomList.length &&
        symptomList.map((s, i) => {
          let css = {};
          if (s === currentSymptom)
            css = { backgroundColor: "black", color: "white" };
          return (
            <Button
              type="button"
              aria-label={`Button to filter chart view by ${s} symptom`}
              key={i}
              onClick={() => toggleSymptom(s)}
              css={{...css, backgroundColor: '#7a918d', color: 'white', marginRight: i < symptomList.length - 1 ? '8px' : 0}}
              size="xs"
            >
              {s}
            </Button>
          );
        })
      : null}
  </div>
</section>
  );
};

export default ScatterControls;

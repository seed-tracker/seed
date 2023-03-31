import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";
import { fetchScatterData } from "../../store/scatterSlice";
import { Text, Button, Row } from "@nextui-org/react";
import { Slider } from "../nextUI";

const ScatterControls = ({
  symptomList,
  toggleSymptom,
  maxMonths,
  currentSymptom,
}) => {
  const [sliderVal, setSliderVal] = useState(maxMonths);

  return (
    <section>
      <Text h4>
        {" "}
        Showing data over the past{" "}
        {sliderVal === 12
          ? "1 year"
          : sliderVal % 12 === 0 && sliderVal > 13
          ? `${sliderVal / 12} years`
          : `${sliderVal} months`}
      </Text>
      <section>
        <Slider
        value={sliderVal}
          min={3}
          max={maxMonths || 3}
          tooltip="off"
          className="slider"
          onChange={(e) => setSliderVal(Number(e.target.value))}
        />
      </section>
      <Row css={{ display: "flex", alignItems: "baseline" }}>
        <Text h4>Most common symptoms </Text>
        <Button.Group color="primary" bordered ghost>
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
                    css={css}
                    size="xs"
                  >
                    {s}
                  </Button>
                );
              })
            : null}
        </Button.Group>
      </Row>
    </section>
  );
};

export default ScatterControls;

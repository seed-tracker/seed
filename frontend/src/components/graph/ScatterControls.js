import React, { useState } from "react";
import { Text, Button, Row } from "@nextui-org/react";
import { Slider } from "../nextUI";

/**
 * Controls for the connected scatter plot
 * @returns a slider, label, and button group
 */
const ScatterControls = ({
  symptomList,
  toggleSymptom,
  maxMonths,
  currentSymptom,
}) => {
  const [sliderVal, setSliderVal] = useState(maxMonths);

  const handleButtonClick = (symptom) => {
    toggleSymptom(symptom);
  };

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
      <Row css={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
        <Text h4 css={{ marginRight: "10px" }}>
          Most common symptoms{" "}
        </Text>
        {symptomList ? (
          <div style={{ display: "flex" }}>
            {symptomList.length &&
              symptomList.map((s, i) => {
                let css = {};
                if (s === currentSymptom)
                  css = { backgroundColor: "#5b6c61", color: "white" };
                return (
                  <Button
                    type="button"
                    aria-label={`Button to filter chart view by ${s} symptom`}
                    key={i}
                    onPress={() => handleButtonClick(s)}
                    css={{
                      backgroundColor: "#7a918d",
                      borderColor: "#7a918d",

                      ...css,
                      marginRight: "10px",
                      marginBottom: "10px",
                      "&:active": {
                        backgroundColor: "#29524a",
                      },
                    }}
                    size="xs"
                  >
                    {s}
                  </Button>
                );
              })}
          </div>
        ) : null}
      </Row>
    </section>
  );
};

export default ScatterControls;

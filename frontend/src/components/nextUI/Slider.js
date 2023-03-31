import React from "react";
import RangeSlider from "react-bootstrap-range-slider";
import './slider.css';

const Slider = ({ min, max, value, onChange, tooltip }) => {
  return (
    <RangeSlider
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={1}
      tooltip={tooltip}
      tooltipPlacement='bottom'
      variant='primary'
    />
  );
};

export default Slider;

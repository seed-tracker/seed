import React from "react";
import RangeSlider from "react-bootstrap-range-slider";
import './slider.css';

// const StyledSlider = styled(MUISlider)({
//   color: "#7a918d",
//   height: 8,
//   "& .MuiSlider-track": {
//     border: "none",
//   },
//   "& .MuiSlider-thumb": {
//     height: 24,
//     width: 24,
//     backgroundColor: "#fff",
//     border: "2px solid currentColor",
//     "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
//       boxShadow: "inherit",
//     },
//     "&:before": {
//       display: "none",
//     },
//   },
//   "& .MuiSlider-valueLabel": {
//     lineHeight: 1.2,
//     fontSize: 12,
//     background: "unset",
//     padding: 0,
//     width: 32,
//     height: 32,
//     borderRadius: "50% 50% 50% 0",
//     backgroundColor: "#7a918d",
//     transformOrigin: "bottom left",
//     transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
//     "&:before": { display: "none" },
//     "&.MuiSlider-valueLabelOpen": {
//       transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
//     },
//     "& > *": { transform: "rotate(45deg)" },
//   },
// });

// const Slider = ({ min, max, value, defaultValue, onChange }) => {
//   return (
//     <StyledSlider
//       valueLabelDisplay="auto"
//       value={value}
//       aria-label="slider"
//       aria-valuetext={defaultValue}
//       getAriaValueText={value}
//       defaultValue={defaultValue}
//       min={min}
//       max={max}
//       onChange={onChange}
//     />
//   );
// };

const Slider = ({ min, max, value, onChange }) => {
  return (
    <RangeSlider
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={1}
      tooltip='on'
      tooltipPlacement='bottom'
      variant='secondary'
    />
  );
};

export default Slider;

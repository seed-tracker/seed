import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { selectAuthUser } from "../../store/authSlice";
import { fetchUserCorrelations, selectUserCorrelations } from "../../store/correlationsSlice";
import * as d3 from "d3";

const BubbleChart = () => {
  const dispatch = useDispatch()
  // const user = useSelector(selectAuthUser)
  const datas = useSelector(selectUserCorrelations);

  // const symptom = datas.forEach((obj) => {
  //   return obj.symptom
  // })

  // const count = datas.forEach((obj) => {
  //   return obj.count
  // })

  // access key in arr with item.lift, etc
//   const top_foods = datas.forEach((obj) => {
//     obj['top_foods'].forEach((item) => {
//       return item
//     })
//   })
// console.log(top_foods)
//   // access key in arr with item.avg_severity, etc
//   const top_groups = datas.forEach((obj) => {
//     obj['top_groups'].forEach((item) => {
//       return item
//     })
//   })

const symptom = datas.map((obj) => obj.symptom);

const count = datas.map((obj) => obj.count);

const top_foods = datas.flatMap((obj) => obj.top_foods);
console.log(top_foods);

const top_groups = datas.flatMap((obj) => obj.top_groups);
console.log(top_groups);

useEffect(() => {
  dispatch(fetchUserCorrelations())
  // const graphSection = d3.select("#graph svg")
  // graphSection.append("g")
}, [dispatch])

 //useRef to reference and manipulate the SVG element
  // const svgRef = React.useRef(null);

useEffect(() => {
  const svg = d3.select("#graph");


  //this would change the radius of the circle
  // const countScale = d3.scaleLinear()
  // .domain([0, d3.max(data, d => d.count)])
  // .range([10, 50]);
  const circles = svg.selectAll("circle")
  .data(top_foods)
  .join("circle")
  .attr("cx", (d, i) => i * 100 + 50)
  .attr("cy", 50)
  .attr("r", 20)
  .attr("fill", (d)=>d.lift>1.01 ? "red":"green")
  .attr("stroke", "white")
  .attr("stroke-width", 2);
})


//select,data,join is combo rather than enter, append b/c if you use enter you have to manually update when data changes
//select,data,join auto updates when data changes
//datum is d
//each mark/variable we want to visualize there should a 1:1 to an attribute with an arrow function
  // const svg = d3.create("svg").attr("width", 932).attr("height", 932).style("display", "block").style("margin", "0 auto").style("background", "cornflowerblue").style("cursor", "pointer")
  // graphSection.append("svg")

  const svg = d3.select("svg")
  svg.append("g")



  return (
    <svg id="graph"></svg>
  )
}

export default BubbleChart
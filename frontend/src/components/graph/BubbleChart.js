import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { selectAuthUser } from "../../store/authSlice";
import { fetchUserCorrelations, selectUserCorrelations } from "../../store/correlationsSlice";
import * as d3 from "d3";
let categoryColorScale;

const foodGroups=["Goat", "Fish", "Processed Foods", "Beans,Peas,and Soy","Fruit", "Pork", "Beef", "Milk,Yogurt,and Cheese",
"Nuts and Seeds", "Vegetables, Starchy", "Grains, Gluten-Free", "Shellfish", "Lamb", "Refined Sugars", "Vegetables, Non-Starchy",
"Eggs", "Caffeinated Beverages", "Grains, Gluten", "Other  Seafoods", "Poultry"]
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


const top_groups = datas.flatMap((obj) => obj.top_groups);
console.log(top_groups)
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
  // .attr("fill", (d)=>d.lift>1.01 ? "red":"green")
  .attr('fill', d => categoryColorScale(d.top_groups))
  .attr("stroke", "white")
  .attr("stroke-width", 2);
  })

  const colors = ['#ffcc00', '#ff6666', '#cc0066', '#66cccc', '#f688bb', '#65587f', '#baf1a1', '#333333', '#75b79e',
    '#66cccc', '#9de3d0', '#f1935c', '#0c7b93', '#eab0d9', '#baf1a1', '#9399ff','#06AED5', '#086788', '#F0C808', '#DD1C1A']
//select,data,join is combo rather than enter, append b/c if you use enter you have to manually update when data changes
//select,data,join auto updates when data changes
//datum is d
//each mark/variable we want to visualize there should a 1:1 to an attribute with an arrow function
  // const svg = d3.create("svg").attr("width", 932).attr("height", 932).style("display", "block").style("margin", "0 auto").style("background", "cornflowerblue").style("cursor", "pointer")
  // graphSection.append("svg")
  categoryColorScale = d3.scaleOrdinal(foodGroups, colors)
  const svg = d3.select("svg")
  svg.append("g")

  

  return (
    <svg id="graph"></svg>
  )
}

export default BubbleChart

//food group = color
//lift = size
//severity = gradient
//food = bubble
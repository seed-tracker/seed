import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSymptoms, fetchAllSymptoms } from "../../store/symptomSlice";
import { fetchUserCorrelations, selectUserCorrelations } from "../../store/correlationsSlice";
import * as d3 from "d3";
let categoryColorScale;

const foodGroups=["Goat", "Fish", "Processed Foods", "Beans,Peas,and Soy","Fruit", "Pork", "Beef", "Milk,Yogurt,and Cheese",
"Nuts and Seeds", "Vegetables, Starchy", "Grains, Gluten-Free", "Shellfish", "Lamb", "Refined Sugars", "Vegetables, Non-Starchy",
"Eggs", "Caffeinated Beverages", "Grains, Gluten", "Other  Seafoods", "Poultry"]
const BubbleChart = () => {
  const dispatch = useDispatch()
  const datas = useSelector(selectUserCorrelations);
  const symptoms = useSelector(selectSymptoms)
  console.log("symptoms", symptoms);

  const userSymptoms = datas.map((obj) => obj.symptom);
  console.log("userSymptoms", userSymptoms);

  const count = datas.map((obj) => obj.count);

  const top_foods = datas.flatMap((obj) => obj.top_foods);
  // console.log(top_foods);

  const top_groups = datas.flatMap((obj) => obj.top_groups);
  // console.log(top_groups);

  const colorPalette = d3.schemeCategory10
  console.log("colorPalette", colorPalette);

  const symptomColors = {};

  for (let i = 0; i < symptoms.length; i++) {
    const symptomName = symptoms[i].name;
    const colorIndex = i % colorPalette.length;
    symptomColors[symptomName] = colorPalette[colorIndex];
  }

useEffect(() => {
  dispatch(fetchAllSymptoms())
  dispatch(fetchUserCorrelations())
}, [dispatch])

useEffect(() => {
  const svg = d3.select("#graph");
  const svgWidth = parseInt(svg.style("width"), 10);
  const svgHeight = parseInt(svg.style("height"), 10);
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  const simulation = d3.forceSimulation(userSymptoms.map((d, i) => ({ id: i, symptom: d })))
    .force("center", d3.forceCenter(centerX, centerY))
    .force("collision", d3.forceCollide().radius(100))
    .on("tick", () => {
      circles.attr("cx", d => d.x)
             .attr("cy", d => d.y);
    });


  const circles = svg.selectAll("circle")
    .data(simulation.nodes())
    .join("circle")
    .attr("r", 20)
   
    
    .attr("fill", d => symptomColors[d.symptom])
    .attr("stroke", "white")
    .attr("stroke-width", 2);
}, [symptoms, userSymptoms, symptomColors]);

  const colors = ['#ffcc00', '#ff6666', '#cc0066', '#66cccc', '#f688bb', '#65587f', '#baf1a1', '#333333', '#75b79e',
    '#66cccc', '#9de3d0', '#f1935c', '#0c7b93', '#eab0d9', '#baf1a1', '#9399ff','#06AED5', '#086788', '#F0C808', '#DD1C1A']
//select,data,join is combo rather than enter, append b/c if you use enter you have to manually update when data changes
//select,data,join auto updates when data changes
//datum is d
//each mark/variable we want to visualize there should a 1:1 to an attribute with an arrow function

  return (
    <svg id="graph"></svg>
  )
}

export default BubbleChart
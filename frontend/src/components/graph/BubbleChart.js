import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSymptoms, fetchAllSymptoms } from "../../store/symptomSlice";
import { fetchUserCorrelations, selectUserCorrelations } from "../../store/correlationsSlice";
import * as d3 from "d3";

const BubbleChart = () => {
  const dispatch = useDispatch()
  const datas = useSelector(selectUserCorrelations)
  console.log("correlations", datas);
  const symptoms = useSelector(selectSymptoms)
  console.log("symptoms", symptoms);

  const userSymptoms = datas.map((obj) => obj.symptom);
  console.log("userSymptoms", userSymptoms);

  const count = datas.map((obj) => obj.count);

  const top_foods = datas.flatMap((obj) => obj.top_foods);
  console.log("top_foods", top_foods); // ~ nodes
  console.log("top_foods", top_foods.length); // ~ nodes

  const top_groups = datas.flatMap((obj) => obj.top_groups);
  console.log("top_groups", top_groups);

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

    const simulation2 = d3.forceSimulation(top_foods.map((d, i) => ({ id: i, food: d })))
      .force("center", d3.forceCenter(centerX, centerY))
      .force("collision", d3.forceCollide())
      // .on("tick", () => {
      //   squares.attr("rx", d => d.x)
      //          .attr("ry", d => d.y);
      // })

      const squareSize = 100
      const squares = svg.selectAll("rect")
      .data(top_foods);


    squares.enter()
      .append("rect")
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("fill", "pink")
      .attr("x", (d, i) => i * squareSize * 2)
      .attr("y", 0);


    squares.attr("fill", "blue")
      .attr("x", (d, i) => i * squareSize)
      .attr("y", 0);


    squares.exit().remove();

  const circles = svg.selectAll("circle")
    .data(simulation.nodes())
    .join("circle")
    .attr("r", 20)
    .attr("fill", d => symptomColors[d.symptom])
    .attr("stroke", "white")
    .attr("stroke-width", 2);
}, [symptoms, userSymptoms, symptomColors, top_foods]);




//select,data,join is combo rather than enter, append b/c if you use enter you have to manually update when data changes
//select,data,join auto updates when data changes
//datum is d
//each mark/variable we want to visualize there should a 1:1 to an attribute with an arrow function

  return (
    <svg id="graph"></svg>
  )
}

export default BubbleChart
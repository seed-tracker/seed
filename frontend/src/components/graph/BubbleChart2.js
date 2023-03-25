import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { selectSymptoms, fetchAllSymptoms } from "../../store/symptomSlice";
// import { fetchUserCorrelations, selectUserCorrelations } from "../../store/correlationsSlice";
// import * as d3 from "d3";

// let categoryColorScale;

// const BubbleChart = () => {

  
//   const dispatch = useDispatch()
//   const datas = useSelector(selectUserCorrelations);
//   const symptoms = useSelector(selectSymptoms)
//   console.log("symptoms", symptoms);



//   function getSymptomsAndTopGroups(data) {
//     const result = {};
//     data.forEach((obj) => {
//       const symptom = obj.symptom;
//       const topGroups = obj.top_groups.map((group) => group.name);
//       result[symptom] = topGroups;
//     });
//     return result;
//   }
//   const result = getSymptomsAndTopGroups(datas);

  
  

//   const userSymptoms = datas.map((obj) => obj.symptom);
//   console.log("userSymptoms", userSymptoms);

//   const count = datas.map((obj) => obj.count);

//   const top_foods = datas.flatMap((obj) => obj.top_foods);
 
//   const top_groups = datas.flatMap((obj) => obj.top_groups);
//   const colorPalette = d3.schemeCategory10


//   const squareSize = 50;
//   const squareMargin = 10;
  
//   const squares = d3.select("#graph")
//   .selectAll("rect")
//   .data(top_groups)
//   .join("rect")
//   .attr("width", squareSize)
//   .attr("height", squareSize)
//   .attr("x", (d, i) => i * (squareSize + squareMargin))
//   .attr("y", squareMargin)
//   .attr("fill", "gray");


//   squares.each(function(d, i) {
//     const squareX = i * (squareSize + squareMargin);
//     const squareY = squareMargin;
//     const word = d.name;
//     const wordWidth = word.length * 8; // approximate width of word
//     const wordX = squareX + squareSize / 2 - wordWidth / 2;
//     const wordY = squareY + squareSize / 2;
    
//     d3.select(this.parentNode).append("text")
//     .text(d.name)
//     .attr("x", i * (squareSize + squareMargin) + squareMargin + squareSize / 3)
//     .attr("y", squareMargin + squareSize / 3)
//     .attr("text-anchor", "middle")
//     .attr("dominant-baseline", "middle")
//     .attr("fill", "black")
//     .attr("font-size", "10px")
//     .attr("stroke", "white")
//     .attr("stroke-width", "2px");
// });

//   const symptomColors = {};

//   for (let i = 0; i < symptoms.length; i++) {
//     const symptomName = symptoms[i].name;
//     const colorIndex = i % colorPalette.length;
//     symptomColors[symptomName] = colorPalette[colorIndex];
//   }

// useEffect(() => {
//   dispatch(fetchAllSymptoms())
//   dispatch(fetchUserCorrelations())
// }, [dispatch])

// useEffect(() => {
//   const svg = d3.select("#graph");
//   const svgWidth = parseInt(svg.style("width"), 10);
//   const svgHeight = parseInt(svg.style("height"), 10);
//   const centerX = svgWidth / 2;
//   const centerY = svgHeight / 2;

//   const simulation = d3.forceSimulation(userSymptoms.map((d, i) => ({ id: i, symptom: d })))
//     .force("center", d3.forceCenter(centerX, centerY))
//     .force("collision", d3.forceCollide().radius(100))
//     .on("tick", () => {
//       circles.attr("cx", d => d.x)
//              .attr("cy", d => d.y);
//     });

//   const circles = svg.selectAll("circle")
//     .data(simulation.nodes())
//     .join("circle")
//     .attr("r", 30)
//     .attr("fill", d => symptomColors[d.symptom])
//     .attr("stroke", "white")
//     .attr("stroke-width", 1)
//     .attr("fill", function(d) {
//       const gradient = svg.append("defs")
//         .append("radialGradient")
//         .attr("id", "grad" + d.id);
//       gradient.append("stop")
//         .attr("offset", "0%")
//         .attr("stop-color", symptomColors[d.symptom]);
//       gradient.append("stop")
//         .attr("offset", "100%")
//         .attr("stop-color", "white");
//       return "url(#grad" + d.id + ")";
//     })
// }, [symptoms, userSymptoms, symptomColors]);



//   return (
//     <svg id="graph"></svg>
//   )
// }

// export default BubbleChart
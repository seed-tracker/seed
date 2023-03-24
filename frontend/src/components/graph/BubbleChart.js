import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSymptoms, fetchAllSymptoms } from "../../store/symptomSlice";
import { fetchUserCorrelations, selectUserCorrelations } from "../../store/correlationsSlice";
import * as d3 from "d3";

let categoryColorScale;

const BubbleChart = () => {

  const dispatch = useDispatch()
  const datas = useSelector(selectUserCorrelations);
  const symptoms = useSelector(selectSymptoms)
  console.log("symptoms", symptoms);

  function getSymptomsAndTopGroups(data) {
    const result = {};
    data.forEach((obj) => {
      const symptom = obj.symptom;
      const topGroups = obj.top_groups.map((group) => group.name);
      result[symptom] = topGroups;
    });
    return result;
  }
  const result = getSymptomsAndTopGroups(datas);
console.log(result)
  const userSymptoms = datas.map((obj) => obj.symptom);
  console.log("userSymptoms", userSymptoms);

  // const count = datas.map((obj) => obj.count);

  // const top_foods = datas.flatMap((obj) => obj.top_foods);
 
  const top_groups = datas.flatMap((obj) => obj.top_groups);
  const colorPalette = d3.schemeCategory10
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
      //not updating squares' position correctly...why??
      labels.attr("x", d => {
        // const index = userSymptoms.findIndex(s => result[s].includes(d.name));
        // const angle = 2 * Math.PI * index / userSymptoms.length;
        // const radius = 100;
        // const x = centerX + radius * Math.cos(angle);
        const x = d.cx
          // console.log(index)
        return x;
      })
    
      .attr("y", d => {
        // const index = userSymptoms.findIndex(s => result[s].includes(d.name));
        // const angle = 2 * Math.PI * index / userSymptoms.length;
        // const radius = 100;
        // const y = centerY + radius * Math.sin(angle);
        const y = d.cy
        return y;
      });
    });

  const circles = svg.selectAll("circle")
    .data(simulation.nodes())
    .join("circle")
    .attr("r", 30)
    .attr("fill", d => symptomColors[d.symptom])
    .attr("stroke", "white")
    .attr("stroke-width", 1)


    const labels = svg.selectAll("text")
    .data(top_groups)
    .join("text")
    .attr("font-size", "14px")
    .attr("text-anchor", "middle")
    .attr("fill", d => {
      const symptom = Object.keys(result).find(key => result[key].includes(d.name));
      return symptomColors[symptom];
    })
    .text(d => d.name)
  .attr("x", d => d.x + 30)
    .attr("y", d => d.y - 10);
  
}, [top_groups,symptoms, userSymptoms, symptomColors, result]);
  return (
    <svg id="graph"></svg>
  )
}
export default BubbleChart

//select,data,join is combo rather than enter, append b/c if you use enter you have to manually update when data changes
//select,data,join auto updates when data changes
//datum is d
//each mark/variable we want to visualize there should a 1:1 to an attribute with an arrow function

// const foodGroups=["Goat", "Fish", "Processed Foods", "Beans,Peas,and Soy","Fruit", "Pork", "Beef", "Milk,Yogurt,and Cheese",
// "Nuts and Seeds", "Vegetables, Starchy", "Grains, Gluten-Free", "Shellfish", "Lamb", "Refined Sugars", "Vegetables, Non-Starchy",
// "Eggs", "Caffeinated Beverages", "Grains, Gluten", "Other  Seafoods", "Poultry"]

// const colors = ['#ffcc00', '#ff6666', '#cc0066', '#66cccc', '#f688bb', '#65587f', '#baf1a1', '#333333', '#75b79e',
// '#66cccc', '#9de3d0', '#f1935c', '#0c7b93', '#eab0d9', '#baf1a1', '#9399ff','#06AED5', '#086788', '#F0C808', '#DD1C1A']
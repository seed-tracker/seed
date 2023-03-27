import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSymptoms, fetchAllSymptoms } from "../../store/symptomSlice";
import { fetchUserCorrelations, selectUserCorrelations } from "../../store/correlationsSlice";
import * as d3 from "d3";

/**
 * This component displays a circle packing chart and a legend.
 * The chart displays the logged in user's most correlated consumed food groups and symptoms
 * (as calculated by lift from fpGrowth algorithm and represented by the bubble's stroke width).
 * The legend displays the color palette of the unique color associated with each of
 * the symptoms from the database.
 * The user's symptoms are represented by the bubble's fill color.
 * @returns two <svg> elements: (1) the circle packing chart, (2) the legend for the chart
 */
const CirclePacking = () => {
  const dispatch = useDispatch();
  const datas = useSelector(selectUserCorrelations);
  const symptoms = useSelector(selectSymptoms);

  /**
   * This function creates an object that maps each user's symptom to its top groups and lifts.
   * @param {Array} datas - An array of objects containing user's correlations data
   * @returns {Object} An object that maps each symptom to its top groups and lifts
   */
  function getSymptomsAndTopGroups(datas) {
    const result = {};

    datas.forEach((obj) => {
      const symptom = obj.symptom;
      const topGroups = obj.top_groups?.map((group) => group.name) ?? [];
      const lifts = obj.top_groups?.map((group) => group.lift) ?? [];
      result[symptom] = { topGroups, lifts };
    });

    return result;
  }
console.log(datas)
  const result = getSymptomsAndTopGroups(datas);

  const userSymptoms = datas.map((obj) => obj.symptom); // Get an array of the user's symptoms

  const svgRef = useRef(); // allow the svg element to be accessed and manipulated in the React component using the current property of the svgRef object


  // Fetch all symptoms and user's correlations data from the store
  useEffect(() => {
    dispatch(fetchAllSymptoms());
    dispatch(fetchUserCorrelations());
  }, [dispatch]);


  // Create the circle packing chart and the legend
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const pack = (data) => d3.pack() // Define the circle packing layout
      .size([width - 2, height - 2])
      .padding(3)

    (d3.hierarchy({ children: data })  // Create the hierarchy of nodes for the circle packing layout and sum the node values
      .sum((d) => d.value)
    )

    const colorPalette = d3.schemeSet3;; // Define a color palette for the symptoms and map each symptom to a unique color
    const symptomColors = {};
    for (let i = 0; i < symptoms.length; i++) {
      const symptomName = symptoms[i].name;
      const colorIndex = i % colorPalette.length;
      symptomColors[symptomName] = colorPalette[colorIndex];
    }


    const legend = d3.select("#legend") // Create the legend
    const legendHeight = +legend.attr("height");


    legend.selectAll("circle") // Create a circle for each symptom in the legend and color it with the corresponding color
      .data(Object.entries(symptomColors))
      .enter()
      .append("circle")
      .attr("cx", (d, i) => 25 + i * 120)
      .attr("cy", legendHeight / 2)
      .attr("r", 16)
      .attr("fill", (d, i) => d[1]);

    legend.selectAll("text") // Add text labels for each symptom in the legend
      .data(Object.entries(symptomColors))
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", (d, i) => 25 + i * 120)
      .attr("y", (legendHeight / 2) + 50)
      .attr("font-size", "16px")
      .text((d) => d[0]);


    // Define the hierarchy of nodes and their attributes using the user's symptoms and their correlations
    const root = pack(
      userSymptoms.map((d, i) => {
        const symptomName = d;
        const { topGroups, lifts } = result[symptomName];
        const color = symptomColors[symptomName];

        return {
          name: symptomName,
          value: topGroups.length ? topGroups.length : 1, // Set value to number of top groups or 1 if none
          color: color,
          children: topGroups.map((d, i) => ({
            name: d,
            value: lifts[i], // use lift value as node value
            color: color,
          })),
        };
      })
    );


    const leaf = svg // Select all groups and bind them to the data for the leaf nodes of the tree
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
      .on("mouseover", function () {
        d3.select(this).select("circle")
          .transition()
          .duration(250)
    
        d3.select(this).append("text")
          .attr("class", "text")
          .text((d) => d.data.name)
          .attr("x", (d) => -d.r)
          .attr("y", (d) => -d.r - 5)
          .attr("font-size", "14px")

      })
      .on("mouseout", function () {
        d3.select(this).select("circle")
          .transition()
          .duration(250)
          // .attr("stroke-width", 1)
          // .attr("stroke", "black");
    
        d3.select(this).select(".text").remove();
      })
      .on("click", (d) => console.log("clicked", d.count))
      .attr("class", "node");
      //shadow
      svg.append("filter")
  .attr("id", "circle-shadow")
  .append("feDropShadow")
  .attr("dx", 0)
  .attr("dy", 2)
  .attr("stdDeviation", 2)
  .attr("flood-color", "#000000")
  .attr("flood-opacity", 0.25);
      

    // Create a circle for each leaf node, with radius based on node size, fill color based on symptom color,
    // and stroke color and width based on lift value (higher values have thicker stroke)
    leaf.append("circle")
    .attr("r", (d) => d.r)
    .attr("fill", (d) => d.data.color)
    .attr("filter", "url(#circle-shadow)")
    .classed("pulse", function(d) {
      if (d.data.value > 1.01) {
        return true;
      }
      return false;
    })


    // leaf.append("circle")
    //   .attr("r", (d) => d.r)
    //   .attr("fill", (d) => d.data.color)
    //   .attr("stroke", "crimson")
    //   .attr("stroke-width", (d) =>
    //     d.data.value > 1.01 ? 10 + "px" : 5 + "px"
    //   );

    leaf.append("text") // Add text labels to each leaf node, with the symptom name as the label text
      .attr("text-anchor", "middle")
      .attr("font-size", (d) => "12px")
      .attr("dy", ".35em")
      .text((d) => d.data.name);
  }, [symptoms, userSymptoms, result]);


  return (
    <div id="graph-area">
      <svg ref={svgRef} width="400" height="400"></svg>
      <svg id="legend" width="1400px" height="250"></svg>
    </div>
  );
};

export default CirclePacking;
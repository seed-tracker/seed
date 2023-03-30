import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSymptoms, fetchAllSymptoms } from "../../store/symptomSlice";
import {
  fetchUserCorrelations,
  selectUserCorrelations,
} from "../../store/correlationsSlice";
import * as d3 from "d3";
import { Container, Text } from "@nextui-org/react";
import { HeaderText } from "../nextUI";

/**
 * This component displays a circle packing chart and a legend of the user's most associated food groups and symptoms
 * (as calculated by lift from fpGrowth algorithm).
 * The legend shows a color palette of the unique color associated with each of the symptoms from the database.
 * The user's symptoms are represented by the bubble's fill color, and the text on the bubble is the food group.
 * @returns two <svg> elements: (1) the circle packing chart, (2) the legend for the chart
 */
const CirclePacking = () => {
  const dispatch = useDispatch();
  const datas = useSelector(selectUserCorrelations);
  const symptoms = useSelector(selectSymptoms);

  /**
   * This function creates an object that maps each user's symptom to its top groups
   * @param {Array} datas - An array of objects containing user's correlations data
   * @returns {Object} An object that maps each symptom to its top groups
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

  const result = getSymptomsAndTopGroups(datas);

  const userSymptoms = datas.map((obj) => obj.symptom); // Get an array of the user's symptoms

  const colorPalette = d3.schemeSet3; // Define a color palette for the symptoms and map each symptom to a unique color
  const symptomColors = {};
  for (let i = 0; i < symptoms.length; i++) {
    const symptomName = symptoms[i].name;
    const colorIndex = i % colorPalette.length;
    symptomColors[symptomName] = colorPalette[colorIndex];
  }

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

    const pack = (data) =>
      d3
        .pack() // Define the circle packing layout
        .size([width - 2, height - 2])
        .padding(3)(
        d3
          .hierarchy({ children: data }) // Create the hierarchy of nodes for the circle packing layout and sum the node values
          .sum((d) => d.value)
      );

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

    function getNodeLabel(node) {
      const name = node.data.name;
      const parts = name.split(" ");
      return parts.join(" ");
    }

    const leaf = svg // Select all groups and bind them to the data for the leaf nodes of the tree
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`);

    // Create a circle for each leaf node, with radius based on node size, fill color based on symptom color
    leaf
      .append("circle")
      .attr("fill", (d) => d.data.color)
      .attr("r", (d) => d.r);

    leaf
      .append("foreignObject") // Add text labels to each leaf node, with the symptom name as the label text
      .attr("x", (d) => -d.r)
      .attr("y", (d) => -d.r / 2.2)
      .attr("width", (d) => d.r * 2)
      .attr("height", (d) => d.r * 2)
      .html((d) => getNodeLabel(d))
      .style("font-size", "12px")
      .style("display", "flex")
      .selectAll("text")
      .style("word-break", "break-word")
      .style("justify-content", "center");
  }, [symptoms, userSymptoms, result]);

  return (
    <Container
      css={{ margin: "5rem 0", padding: "2rem" }}
      className="glassmorpheus-graph"
    >
      <HeaderText text="Your Food Group and Symptom Relationships" />
      <Text h3>Legend:</Text>
      <Container css={{ maxWidth: "100%" }}>
        {Object.keys(result).map((symptomName) => (
          <Container display="flex" alignItems="center" key={symptomName}>
            <div
              style={{
                backgroundColor: symptomColors[symptomName],
                padding: "1rem",
                marginRight: "1rem",
                borderRadius: "1rem",
              }}
            ></div>
            <Text h3>{symptomName}</Text>
          </Container>
        ))}
        <svg ref={svgRef} width="950" height="500"></svg>
      </Container>
    </Container>
  );
};

export default CirclePacking;
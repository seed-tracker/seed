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

  const colorPalette = [
    "#A8E6Ce",
    "#478c80",
    "#167288",
    "#f3929c",
    "#8cdaec",
    "#ffc02e",
    "#c48cf5",
    "#d93f7a",
    "#836394",
    "#0c97ed",
  ]; // Define a color palette for the symptoms and map each symptom to a unique color
  const symptomColors = {};
  for (let i = 0; i < symptoms.length; i++) {
    const symptomName = symptoms[i].name;
    const colorIndex = i % colorPalette.length;
    symptomColors[symptomName] = colorPalette[colorIndex];
  }

  const svgRef = useRef(); // allow the svg element to be accessed and manipulated in the React component using the current property of the svgRef object

  // Create the circle packing chart and the legend
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    // Set the viewBox attribute
    svg.attr("viewBox", "400 8 100 500");

    // Set the width and height using CSS
    svg.style("width", "100%");
    svg.style("height", "100%");

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;
    // const width = +svg.attr("width");
    // const height = +svg.attr("height");

    const simulation = d3
      .forceSimulation()
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05))
      .force(
        "collide",
        d3
          .forceCollide()
          .radius((d) => d.r + 1)
          .iterations(1)
      )
      .stop();

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
      if (name) {
        const parts = name.split(" ");
        return parts.join(" ");
      }
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
    .attr("r", (d) => d.r)
    .style("filter", "drop-shadow(2px 4px 3px rgba(0,0,0,0.5))")
    .on("mouseover", function (event, d) {
      d3.select(this).transition().attr("r", d.r + 5);
    })
    .on("mouseout", function (event, d) {
      d3.select(this).transition().attr("r", d.r);
    });


    leaf
      .append("foreignObject") // Add text labels to each leaf node, with the symptom name as the label text
      .attr("x", (d) => -d.r)
      .attr("y", (d) => -d.r / 3.5)
      .attr("width", (d) => d.r * 2)
      .attr("height", (d) => d.r * 2)
      .html((d) => getNodeLabel(d))
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .style("display", "flex")
      .selectAll("text")
      .style("word-break", "break-word")
      .style("justify-content", "center");
  }, [result]);

  return (
    <>
      <HeaderText text="Your Food Group and Symptom Relationships" />

      <Container display={"flex"} align="center" justify="center" wrap={"wrap"}>
        {Object.keys(result).map((symptomName) => (
          <div
            style={{
              display: "flex",
              width: "auto",
              wrap: "nowrap",
              align: "center",
              padding: "2rem 0",
            }}
          >
            <div
              style={{
                backgroundColor: symptomColors[symptomName],
                width: "1rem",
                height: "1rem",
                padding: "0.8rem",
                margin: "0 0.5rem 0 2rem",
                borderRadius: "1rem",
              }}
            ></div>
            <Text h5>{symptomName}</Text>
          </div>
        ))}
        <Container
          css={{
            position: "relative",
            overflow: "auto",
            "-webkit-overflow-scrolling": "touch",
          }}
        >
          <svg ref={svgRef} width="950" height="500"></svg>
        </Container>
      </Container>
    </>
  );
};

export default CirclePacking;

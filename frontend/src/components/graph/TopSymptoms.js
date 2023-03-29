import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { select } from "d3-selection";
import { scaleBand, scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { forceCollide, forceSimulation } from "d3-force";
import { fetchAllSymptoms, selectSymptoms } from "../../store/symptomSlice";
import { statsSlice, selectUserStats, getUserStats } from "../../store/statsSlice";
import * as d3 from "d3";
import { Button, Container } from "@nextui-org/react";

const TopSymptoms = () => {
  const svgRef = useRef();
  const allSymptoms = useSelector(selectSymptoms);
  const dispatch = useDispatch()
  const data = useSelector(selectUserStats)
  const symptoms = data.symptoms ? data.symptoms.slice(0, 5) : []
  const counts = symptoms ? symptoms.map((symptom) => symptom.count) : []

  useEffect(() => {
    dispatch(getUserStats("all"))
    dispatch(fetchAllSymptoms())
  }, [dispatch])

  const handleGetAllTime = async (all) => {
    await dispatch(getUserStats("all"))
  }
  const handleGetSixMonths = async (halfYear) => {
    await dispatch(getUserStats(180))
  }
  const handleGetOneYear = async (oneYear) => {
    await dispatch(getUserStats(365))
  }

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    const margin = { top: 200, right: 10, bottom: 200, left: 50 };
    const width = 750 - margin.left - margin.right;
    const height = 60 - margin.top - margin.bottom;

    if (symptoms && symptoms.length > 0) {
      const xScale = scaleBand()
        .domain(symptoms.map((symptom) => symptom.name))
        .range([0, width]);

      const yScale = scaleLinear()
        .domain([Math.max(...counts) * 2, 0])
        .range([height, 0]);

      const xAxis = axisBottom(xScale);
      const yAxis = axisLeft(yScale).ticks(5);

      const xAxisLine = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top * 2})`)
        .call(xAxis);

      const yAxisLine = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top * 2})`)
        .call(yAxis);

        const g = svg.append("g").attr("transform", `translate(${margin.left * 2 + 7}, ${margin.top * 2})`);

        const colorPalette = d3.schemeSet3;; // Define a color palette for the symptoms and map each symptom to a unique color
        const symptomColors = {};
        for (let i = 0; i < allSymptoms.length; i++) {
          const symptomName = allSymptoms[i].name;
          const colorIndex = i % colorPalette.length;
          symptomColors[symptomName] = colorPalette[colorIndex];
        }
        console.log(symptomColors);

        const legend = d3.select("#legend-lollipop") // Create the legend
        const legendHeight = +legend.attr("height");

        legend.selectAll("circle") // Create a circle for each symptom in the legend and color it with the corresponding color
          .data(Object.entries(symptomColors))
          .enter()
          .append("circle")
          .attr("cx", (d, i) => 25 + i * 120)
          .attr("cy", legendHeight / 2)
          .attr("r", 12)
          .attr("fill", (d, i) => d[1]);

        legend.selectAll("text") // Add text labels for each symptom in the legend
          .data(Object.entries(symptomColors))
          .enter()
          .append("text")
          .attr("text-anchor", "middle")
          .attr("x", (d, i) => 25 + i * 120)
          .attr("y", (legendHeight / 2) + 50)
          .attr("font-size", "12px")
          .text((d) => d[0]);

        const nodes = g
          .selectAll("circle")
          .data(symptoms)
          .join("circle")
          .attr("cx", d => xScale(d.name))

          for (let i = 0; i < symptoms.length; i++) {
            for (let j = 0; j < counts[i]; j++) {
               g.append("circle")
                  .attr("cx", xScale(symptoms[i].name))
                  .attr("cy", yScale(j))
                  .attr("fill", symptomColors[symptoms[i].name])
                  .attr("r", j === counts[i] - 1 ? 8 : 2); // larger radius for last element
              if (j === counts[i] - 1) {
                g.append("text")
                  .attr("x", xScale(symptoms[i].name))
                  .attr("y", yScale(j) - 20)
                  .attr("text-anchor", "middle")
                  .text("Count: " + counts[i]);
              }
            }
          }
    }
  }, [data]);

  return (
     <Container>
        <h1>Your top 5 symptoms:</h1>
        <div>
          <h3>Legend:</h3>
          <svg id="legend-lollipop" width="100%" height="250"></svg>
        </div>
        <div>
          <svg ref={svgRef} width="2000" height="500"></svg>
          <Button.Group color="primary" ghost>
            <Button type="button" onClick={handleGetAllTime} value="all">All</Button>
            <Button type="button" onClick={handleGetSixMonths} value="180">6 Months</Button>
            <Button type="button" onClick={handleGetOneYear} value="365">1 Year</Button>
          </Button.Group>
        </div>
    </Container>
  );
};

export default TopSymptoms;
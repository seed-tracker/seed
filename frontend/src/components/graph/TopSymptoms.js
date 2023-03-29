import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { select } from "d3-selection";
import { scaleBand, scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { fetchAllSymptoms, selectSymptoms } from "../../store/symptomSlice";
import {
  statsSlice,
  selectUserStats,
  getUserStats,
} from "../../store/statsSlice";
import * as d3 from "d3";
import { Button, Container, Text, Row } from "@nextui-org/react";
import { HeaderText } from "../nextUI";

/**
 * This chart shows the user's top five symptoms with the highest counts during a certain time period and a legend.
 * The legend shows a color palette of the unique color associated with each of the symptoms from the database.
 * @returns two <svg> elements: (1) the lollipop chart, (2) the legend for the chart
 * @returns three <button> elements: filter by (1) all time, (2) half a year, (3) 1 year
 */
const TopSymptoms = () => {
  const svgRef = useRef();
  const allSymptoms = useSelector(selectSymptoms);
  const dispatch = useDispatch();
  const data = useSelector(selectUserStats);
  const symptoms = data.symptoms ? data.symptoms.slice(0, 5) : [];
  const counts = symptoms ? symptoms.map((symptom) => symptom.count) : [];

  const colorPalette = d3.schemeSet3; // Define a color palette for the symptoms and map each symptom to a unique color
      const symptomColors = {};
      for (let i = 0; i < allSymptoms.length; i++) {
        const symptomName = allSymptoms[i].name;
        const colorIndex = i % colorPalette.length;
        symptomColors[symptomName] = colorPalette[colorIndex];
      }

  useEffect(() => {
    dispatch(getUserStats("all"));
    dispatch(fetchAllSymptoms());
  }, [dispatch]);

  const handleGetAllTime = async (all) => {
    await dispatch(getUserStats("all"));
  };
  const handleGetSixMonths = async (halfYear) => {
    await dispatch(getUserStats(180));
  };
  const handleGetOneYear = async (oneYear) => {
    await dispatch(getUserStats(365));
  };

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    const margin = { top: 140, right: 10, bottom: 200, left: 50 };
    const width = 750 - margin.left - margin.right;
    const height = 60 - margin.top - margin.bottom;

    if (symptoms && symptoms.length > 0) {
      const xScale = scaleBand() // Define x-axis values
        .domain(symptoms.map((symptom) => symptom.name))
        .range([0, width]);

      const yScale = scaleLinear() // Define y-axis values
        .domain([Math.max(...counts) * 2, 0])
        .range([height, 0]);

      const xAxis = axisBottom(xScale).tickSizeOuter(0);
      const yAxis = axisLeft(yScale).ticks(5); // Number of tick marks on y-axis

      const xAxisLine = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top * 2})`)
        .attr("class", "x-axis")
        .call(xAxis); // make the x-axis

      xAxisLine.selectAll("text").on("click", (event, d) => {
        svg.select(".x-axis").transition().duration(500).call(xAxis);
      });

      const yAxisLine = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top * 2})`)
        .call(yAxis); // make the y-axis

      svg.selectAll(".tick text").on("click", (event, d) => {
        svg.select(".x-axis").transition().duration(500).call(xAxis);
      });

      // Create lollipop chart
      const g = svg
        .append("g")
        .attr(
          "transform",
          `translate(${margin.left * 2.23 + 7}, ${margin.top * 2})`
        );

      g.selectAll("circle")
        .data(symptoms)
        .join("circle")
        .attr("cx", (d) => xScale(d.name));

      for (let i = 0; i < symptoms.length; i++) {
        for (let j = 0; j < counts[i]; j++) {
          g.append("circle")
            .attr("cx", xScale(symptoms[i].name))
            .attr("cy", yScale(j))
            .attr("fill", symptomColors[symptoms[i].name])
            .attr("r", j === counts[i] - 1 ? 8 : 2); // larger radius for last element
          if (j === counts[i] - 1) {
            g.append("text") // Label the count of that symptom
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
    <Container css={{ margin: "5rem 0" }}>
      <HeaderText text="Your top 5 symptoms:" />
      <Container css={{ margin: "2rem 0" }}>
        <Text h3>Legend:</Text>
        {Object.keys(symptomColors).map((symptomName) => (
          <Container
          display="flex"
          alignItems="center"
          key={symptomName}
          >
            <div style={{ backgroundColor: symptomColors[symptomName], padding: "1rem", marginRight: "1rem", borderRadius: "1rem" }}></div>
            <Text h3>{symptomName}</Text>
        </Container>
        ))}
      </Container>
      <Container
        css={{ margin: "2rem 0", display: "flex", flexDirection: "column" }}
      >
        <svg ref={svgRef} width="950" height="360"></svg>
        <Row css={{ display: "flex", alignItems: "baseline" }}>
          <Text h4>Filter data by:</Text>
          <Button.Group color="primary" bordered ghost>
            <Button
              onClick={handleGetAllTime}
              type="button"
              aria-label="Button to filter chart top symptoms view by all time"
              value="all"
            >
              All Time
            </Button>
            <Button
              onClick={handleGetSixMonths}
              value="180"
              type="button"
              aria-label="Button to filter chart top symptoms view by six months"
            >
              6 Months
            </Button>
            <Button
              onClick={handleGetOneYear}
              value="365"
              type="button"
              aria-label="Button to filter chart top symptoms view by one year"
            >
              1 Year
            </Button>
          </Button.Group>
        </Row>
      </Container>
    </Container>
  );
};

export default TopSymptoms;

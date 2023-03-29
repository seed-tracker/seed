import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { select } from "d3-selection";
import { scaleBand, scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import {
  statsSlice,
  selectUserStats,
  getUserStats,
} from "../../store/statsSlice";
import { foodGroupsSlice, fetchAllFoodGroups, selectFoodGroups } from "../../store/foodGroupsSlice";
import * as d3 from "d3";
import { HeaderText } from "../nextUI/";
import { Container, Text, Button, Row } from "@nextui-org/react";

/**
 * This chart shows the user's top ten food groups eaten during a certain time period and a legend.
 * The legend shows a color palette of the unique color associated with each of the food groups from the database.
 * @returns two <svg> elements: (1) the lollipop chart, (2) the legend for the chart
 * @returns three <button> elements: filter by (1) all time, (2) half a year, (3) 1 year
 */
const TopFoods = () => {
  const svgRef = useRef();
  const dispatch = useDispatch();
  const data = useSelector(selectUserStats);
  const foodGroups = useSelector(selectFoodGroups);
  const groupNames = foodGroups.data ? foodGroups.data.map((group) => group.name) : [];
  const topFoods = data.foods ? data.foods.slice(0, 10) : [];
  const counts = topFoods ? topFoods.map((food) => food.count) : [];
  useEffect(() => {
    dispatch(getUserStats("all"));
    dispatch(fetchAllFoodGroups());
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
    const margin = { top: 10, right: 10, bottom: 130, left: 100 };
    const width = 950 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    if (topFoods && topFoods.length > 0) {

      // x axis label
      g.append("text")
        .attr("x", width / 2)
        .attr("y", height + 200)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Foods");

      // y axis label
      g.append("text")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Times Eaten and Logged");

      const xScale = scaleBand()
        .domain(topFoods.map((food) => food.name))
        .range([0, width]);

      const yScale = scaleLinear()
        .domain([Math.max(...counts) * 2, 0])
        .range([height, 0]);

      const xAxis = axisBottom(xScale);
      const yAxis = axisLeft(yScale).ticks(5);

      g.append("g")
        .attr("transform", `translate(-1, ${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .attr("text-anchor", "end")
        .attr("x", "-5")
        .attr("y", "10");

      g.append("g").call(yAxis);

      const colorPalette = ["#f44336", "#e81e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#9e9e9e", "#607d8b", "#6d28f1", "#064e5f"]; // Define a color palette for the foods and map each food's group to a unique color
      const foodsColors = {};
      for (let i = 0; i < groupNames.length; i++) {
        const foodName = groupNames[i];
        const colorIndex = i % colorPalette.length;
        foodsColors[foodName] = colorPalette[colorIndex];
      }

      g.selectAll("circle").data(topFoods).join("circle");

      for (let i = 0; i < topFoods.length; i++) {
        const currentFood = topFoods[i];
        const groupName = currentFood.groups[0];
        for (let j = 0; j < counts[i]; j++) {
           g.append("circle")
              .attr("cx", xScale(currentFood.name) + (margin.left / 2) - margin.right)
              .attr("cy", -yScale(j) + height)
              .attr("fill", foodsColors[groupName])
              .attr("r", j === counts[i] - 1 ? 8 : 2); // larger radius for last element
          if (j === counts[i] - 1) {
            g.append("text")
              .attr("x", xScale(currentFood.name) + (margin.left / 2) - margin.right)
              .attr("y", -yScale(j) + height - 20)
              .attr("text-anchor", "middle")
              .text("Count: " + counts[i]);
          }
        }
      }

      const legend = d3.select("#legend-top-foods"); // Select the svg legend
      const legendMargin = { top: 10, right: 10, bottom: 10, left: 10 };
      const legendWidth = 950 - legendMargin.left - legendMargin.right;
      const legendHeight = 300 - legendMargin.top - legendMargin.bottom;

      legend
        .append("g")
        .selectAll("g") // Create a group for each circle and text pair in the legend
        .data(Object.entries(foodsColors))
        .join("g")
        .attr(
          "transform",
          (d, i) => `translate(${i * 80 + legendMargin.left + legendMargin.right}, ${legendHeight / 4})`
        )
        .call((g) => {
          g.append("circle") // Append circle element to each group
            .attr("r", 12)
            .attr("fill", (d) => d[1]);
          g.append("text") // Append text element to each group
            .attr("text-anchor", "end")
            .attr("dy", 0)
            .text((d) => d[0]);
        });

      legend
        .selectAll("text") // Move text labels to appropriate location
        .attr("transform", "rotate(-30)")
        .attr("text-anchor", "end")
        .attr("x", -5)
        .attr("y", 30);
    }
  }, [data]);

  return (
    <Container css={{ margin: "5rem 0" }}>
      <HeaderText text="Your Top 10 Foods:" />
      <Text h3>Legend:</Text>
      <svg id="legend-top-foods" width="2000" height="220"></svg>
      <svg ref={svgRef} width="950" height="580"></svg>
      <Row css={{ display: "flex", alignItems: "baseline" }}>
        <Text h4>Filter data by:</Text>
        <Button.Group color="primary" bordered ghost>
          <Button
            onClick={handleGetAllTime}
            type="button"
            aria-label="Button to filter chart top foods view by all time"
            value="all"
          >
            All Time
          </Button>
          <Button
            onClick={handleGetSixMonths}
            value="180"
            type="button"
            aria-label="Button to filter chart top foods view by six months"
          >
            6 Months
          </Button>
          <Button
            onClick={handleGetOneYear}
            value="365"
            type="button"
            aria-label="Button to filter chart top foods view by one year"
          >
            1 Year
          </Button>
        </Button.Group>
      </Row>
    </Container>
  );
};

export default TopFoods;

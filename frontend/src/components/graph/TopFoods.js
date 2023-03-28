import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { select } from "d3-selection";
import { scaleBand, scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { forceCollide, forceSimulation } from "d3-force";
import { statsSlice, selectUserStats, getUserStats } from "../../store/statsSlice";
import { foodGroupsSlice, fetchAllFoodGroups, selectFoodGroups } from "../../store/foodGroupsSlice";
import * as d3 from "d3";
import { HeaderText} from "../nextUI/"
import { Container, Button, Text } from "@nextui-org/react";

const TopFoods = () => {
  const svgRef = useRef();
  const dispatch = useDispatch()
  const data = useSelector(selectUserStats)
  const foodGroups = useSelector(selectFoodGroups)

  const groupNames = foodGroups.data ? foodGroups.data.map((group) => group.name) : []
  const topFoods = data.foods ? data.foods.slice(0, 10) : []
  const counts = topFoods ? topFoods.map((food) => food.count) : []

  useEffect(() => {
    dispatch(getUserStats("all"))
    dispatch(fetchAllFoodGroups())
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
    const width = 750;
    const height = 60 - margin.top - margin.bottom;

    if (topFoods && topFoods.length > 0) {
      const xScale = scaleBand()
        .domain(topFoods.map((food) => food.name))
        .range([0, width]);

      const yScale = scaleLinear()
        .domain([Math.max(...counts) * 2, 0])
        .range([height, 0]);

      const xAxis = axisBottom(xScale);
      const yAxis = axisLeft(yScale).ticks(5);

      const xAxisLine = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top * 2})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .attr("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em");

      const yAxisLine = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top * 2})`)
        .call(yAxis);

        const g = svg.append("g").attr("transform", `translate(${margin.left * 1.75}, ${margin.top * 2})`);

        const colorPalette = ["#f44336", "#e81e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#9e9e9e", "#607d8b", "#6d28f1", "#064e5f"]; // Define a color palette for the foods and map each food's group to a unique color
        const foodsColors = {};
          for (let i = 0; i < groupNames.length; i++) {
            const groupName = groupNames[i];
            const colorIndex = i % colorPalette.length;
            foodsColors[groupName] = colorPalette[colorIndex];
          }

        const legend = d3.select("#legend-top-foods") // Create the legend
        const legendHeight = +legend.attr("height");

        legend.selectAll("circle") // Create a circle for each symptom in the legend and color it with the corresponding color
          .data(Object.entries(foodsColors))
          .enter()
          .append("circle")
          .attr("cx", (d, i) => 25 + i * 120)
          .attr("cy", legendHeight / 2)
          .attr("r", 12)
          .attr("fill", (d, i) => d[1]);

        legend.selectAll("text") // Add text labels for each symptom in the legend
          .data(Object.entries(foodsColors))
          .enter()
          .append("text")
          .attr("text-anchor", "middle")
          .attr("x", (d, i) => 25 + i * 120)
          .attr("y", (legendHeight / 2) + 50)
          .attr("font-size", "12px")
          .text((d) => d[0]);

        const nodes = g
          .selectAll("circle")
          .data(topFoods)
          .join("circle")
          .attr("cx", d => xScale(d.name))

          for (let i = 0; i < topFoods.length; i++) {
            const currentFood = topFoods[i];
            const groupName = currentFood.groups[0];
            for (let j = 0; j < counts[i]; j++) {
               g.append("circle")
                  .attr("cx", xScale(currentFood.name))
                  .attr("cy", yScale(j))
                  .attr("fill", foodsColors[groupName])
                  .attr("r", j === counts[i] - 1 ? 8 : 2); // larger radius for last element
              if (j === counts[i] - 1) {
                g.append("text")
                  .attr("x", xScale(currentFood.name))
                  .attr("y", yScale(j) - 20)
                  .attr("text-anchor", "middle")
                  .text("Count: " + counts[i]);
              }
            }
          }
    }
  }, [data, foodGroups]);

  return (
     <Container>
        <HeaderText text="Your Top 10 Foods:" />
        <Container>
          <svg ref={svgRef} width="100%" height="600"></svg>
          <Button.Group color="primary" ghost>
            <Button onClick={handleGetAllTime} value="all">All</Button>
            <Button onClick={handleGetSixMonths} value="180">6 Months</Button>
            <Button onClick={handleGetOneYear} value="365">1 Year</Button>
          </Button.Group>
        </Container>
        <Container>
          <Text h3>Legend:</Text>
          <svg id="legend-top-foods" width="100%" height="250"></svg>
        </Container>
      </Container>
  );
};

export default TopFoods;
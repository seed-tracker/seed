import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { select, create } from "d3-selection";
import { scaleBand, scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { easeElasticOut } from "d3-ease";
import { selectUserStats, getUserStats } from "../../store/statsSlice";
import { selectFoodGroups } from "../../store/foodGroupsSlice";

import { HeaderText } from "../nextUI/";
import { Container, Text, Button } from "@nextui-org/react";

/**
 * This chart shows the user's top ten food groups eaten during a certain time period and a legend.
 * The legend shows a color palette of the unique color associated with each of the food groups from the database.
 * @returns <svg> element: the lollipop chart
 * @returns the legend for the chart
 * @returns three <button> elements: filter by (1) all time, (2) half a year, (3) 1 year
 */
const TopFoods = () => {
  const svgRef = useRef();
  const dispatch = useDispatch();
  const data = useSelector(selectUserStats);
  const foodGroups = useSelector(selectFoodGroups);
  const groupNames = foodGroups.data
    ? foodGroups.data.map((group) => group.name)
    : [];
  const topFoods = data.foods ? data.foods.slice(0, 10) : [];

  const counts = topFoods ? topFoods.map((food) => food.count) : [];
  const [selectedFilter, setSelectedFilter] = useState("allTime");

  const handleGetAllTime = async (all) => {
    setSelectedFilter("allTime");
    await dispatch(getUserStats("all"));
  };
  const handleGetSixMonths = async (halfYear) => {
    setSelectedFilter("sixMonths");
    await dispatch(getUserStats(180));
  };
  const handleGetOneYear = async (oneYear) => {
    setSelectedFilter("oneYear");
    await dispatch(getUserStats(365));
  };

  const colorPalette = [
    "#f44336",
    "#e81e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#f7803b",
    "#cddc39",
    "#b9d402",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#9e9e9e",
    "#607d8b",
    "#6d28f1",
    "#064e5f",
  ]; // Define a color palette for the foods and map each food's group to a unique color
  const foodsColors = {};
  for (let i = 0; i < groupNames.length; i++) {
    const foodName = groupNames[i];
    const colorIndex = i % colorPalette.length;
    foodsColors[foodName] = colorPalette[colorIndex];
  }

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    const margin = { top: 10, right: 10, bottom: 130, left: 100 };
    const width = 950 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const parent = create("div");
    parent
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("z-index", 1)
      .style("overflow-x", "scroll")
      .style("-webkit-overflow-scrolling", "touch")
      .call((svg) => svg.append("g"));

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    if (topFoods.length === 10) {
      g.append("text")
        .attr("x", -(height / 2))
        .attr("y", -55)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Times Logged");

      const xScale = scaleBand()
        .domain(topFoods.map((food) => food.name))
        .range([0, width]);

      const yScale = scaleLinear()
        .domain([Math.max(...counts) * 2, 0])
        .range([0, height]);

      const xAxis = axisBottom(xScale);
      const yAxis = axisLeft(yScale).ticks(5);

      g.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .attr("text-anchor", "end")
        .attr("x", "-5")
        .attr("y", "10");

      g.append("g").call(yAxis);

      const nodes = g.selectAll("circle").data(topFoods);

      nodes
        .enter()
        .append("circle")
        .attr("cx", (food) => xScale(food.name) + xScale.bandwidth() / 2)
        .attr("cy", (food) => yScale(food.count))
        .attr("r", 10)
        .attr("fill", (d) => foodsColors[d.groups[0]])
        .style("opacity", 0.3)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 1000)
        .ease(easeElasticOut)
        .attr("r", 20);
      nodes.exit().remove();

      g.selectAll("circle").data(topFoods).join("circle");

      for (let i = 0; i < topFoods.length; i++) {
        const currentFood = topFoods[i];
        const groupName = currentFood.groups[0];
        for (let j = 0; j < counts[i]; j++) {
          g.append("circle")
            .attr("cx", xScale(currentFood.name) + xScale.bandwidth() / 2)
            .attr("cy", yScale(j + 1))
            .attr("fill", foodsColors[groupName])
            .attr("r", j === counts[i] - 1 ? 8 : 2); // larger radius for last element
          if (j === counts[i] - 1) {
            g.append("text")
              .attr("x", xScale(currentFood.name) + xScale.bandwidth() / 2)
              .attr("y", yScale(j + 1) - 30)
              .attr("text-anchor", "middle")
              .text("Count: " + counts[i]);
          }
        }
      }
    } else {
      g.append("text")
        .attr("x", `${width / 2}`)
        .attr("y", `${height / 2}`)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Sorry not enough data for this time period.");
    }
  }, [data]);

  return (
    <>
      <HeaderText text="Your Top 10 Foods" />
      <Container display={"flex"} align="center" justify="center" wrap={"wrap"}>
        {topFoods
          .filter(
            (foodObj, index, group) =>
              foodObj.groups &&
              group.findIndex((t) => t.groups[0] === foodObj.groups[0]) ===
                index
          )
          .map((groupName) => (
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
                  backgroundColor: foodsColors[groupName.groups[0]],
                  width: "1rem",
                  height: "1rem",
                  padding: "0.8rem",
                  margin: "0 0.5rem 0 2rem",
                  borderRadius: "1rem",
                }}
              ></div>
              <Text h5>{groupName.groups[0]}</Text>
            </div>
          ))}
      </Container>
      <Container
        display={"flex"}
        direction={"column"}
        alignItems={"center"}
        justify={"center"}
      >
        <Container
          css={{
            position: "relative",
            overflow: "auto",
            "-webkit-overflow-scrolling": "touch",
          }}
        >
          <svg
            ref={svgRef}
            preserveAspectRatio="XMaxYmid meet"
            viewBox="0 0 950 550"
            width="950"
            height="580"
          ></svg>
        </Container>
        <Container
          display="flex"
          alignItems="center"
          justify="center"
          css={{ gap: "1rem" }}
        >
          <Text h4>Filter data by</Text>
          <Button
            onPress={handleGetAllTime}
            type="button"
            aria-label="Button to filter chart top foods view by all time"
            size="sm"
            css={{
              backgroundColor:
                selectedFilter === "allTime" ? "#5b6c61" : "#7a918d",
            }}
          >
            All Time
          </Button>
          <Button
            onPress={handleGetSixMonths}
            value="180"
            type="button"
            aria-label="Button to filter chart top foods view by six months"
            size="sm"
            css={{
              backgroundColor:
                selectedFilter === "sixMonths" ? "#5b6c61" : "#7a918d",
            }}
          >
            6 Months
          </Button>
          <Button
            onPress={handleGetOneYear}
            type="button"
            size="sm"
            aria-label="Button to filter chart top foods view by one year"
            css={{
              backgroundColor:
                selectedFilter === "oneYear" ? "#5b6c61" : "#7a918d",
            }}
          >
            1 Year
          </Button>
        </Container>
      </Container>
    </>
  );
};

export default TopFoods;
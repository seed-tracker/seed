import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { select } from "d3-selection";
import { scaleBand, scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { forceCollide, forceSimulation } from "d3-force";
import { statsSlice, selectUserStats, getUserStats } from "../../store/statsSlice";
import * as d3 from "d3";

const TopFoods = () => {
  const svgRef = useRef();
  const dispatch = useDispatch()
  const data = useSelector(selectUserStats)
  const topFoods = data.foods ? data.foods.slice(0, 10) : []
  // console.log("DATA", topFoods);
  const counts = topFoods ? topFoods.map((food) => food.count) : []
  // console.log(counts);

  useEffect(() => {
    dispatch(getUserStats("all"))
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

        const colorPalette = d3.schemeSet3;; // Define a color palette for the symptoms and map each symptom to a unique color
        const foodsColors = {};
        for (let i = 0; i < topFoods.length; i++) {
          const foodName = topFoods[i].name;
          const colorIndex = i % colorPalette.length;
          foodsColors[foodName] = colorPalette[colorIndex];
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
            for (let j = 0; j < counts[i]; j++) {
               g.append("circle")
                  .attr("cx", xScale(topFoods[i].name))
                  .attr("cy", yScale(j))
                  .attr("fill", foodsColors[topFoods[i].name])
                  .attr("r", j === counts[i] - 1 ? 8 : 2); // larger radius for last element
              if (j === counts[i] - 1) {
                g.append("text")
                  .attr("x", xScale(topFoods[i].name))
                  .attr("y", yScale(j) - 10)
                  .attr("text-anchor", "middle")
                  .text("Count: " + counts[i]);
              }
            }
          }
    }
  }, [data]);

  return (
     <section className="topFoodsChart">
        <h1>Your top 10 foods:</h1>
        <div>
          <svg ref={svgRef} width="2000" height="600"></svg>
          <button type="button" onClick={handleGetAllTime} value="all">All</button>
          <button type="button" onClick={handleGetSixMonths} value="180">6 Months</button>
          <button type="button" onClick={handleGetOneYear} value="365">1 Year</button>
        </div>
        <div>
          <h3>Legend:</h3>
          <svg id="legend-top-foods" width="1400px" height="250"></svg>
        </div>
      </section>
  );
};

export default TopFoods;
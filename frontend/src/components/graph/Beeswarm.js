import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { select } from "d3-selection";
import { scaleBand, scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { statsSlice, selectUserStats, getUserStats } from "../../store/statsSlice";import * as d3 from "d3";

const Beeswarm = () => {
  const svgRef = useRef();

  const dispatch = useDispatch()
  const data = useSelector(selectUserStats)
  const symptoms = data.symptoms
  const counts = symptoms ? symptoms.map((symptom) => symptom.count/2) : []
  // console.log(typeof data)
  console.log(counts);

  useEffect(() => {
    dispatch(getUserStats("all"))
  }, [dispatch])

  const handleGetAllTime = async (all) => {
    await dispatch(getUserStats("all"))
    console.log("All", dispatch(getUserStats("all")))
  }
  const handleGetSixMonths = async (halfYear) => {
    await dispatch(getUserStats(180))
    // console.log("half", dispatch(getUserStats(180)))
  }
  const handleGetOneYear = async (oneYear) => {
    await dispatch(getUserStats(365))
    // console.log("year", dispatch(getUserStats(365)))
  }

  useEffect(() => {
    const svg = select(svgRef.current);
    const margin = { top: 200, right: 10, bottom: 200, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

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

        const g = svg.append("g").attr("transform", `translate(${margin.left * 2 - 5}, ${margin.top * 2})`);

        const nodes = g
          .selectAll("circle")
          .data(symptoms)
          .join("circle")
          .attr("cx", d => xScale(d.name))
          .attr("r", 5);

        for (let i = 0; i < symptoms.length; i++) {
          for (let j = 0; j < counts[i]; j++) {
            g.append("circle")
              .attr("cx", xScale(symptoms[i].name))
              .attr("cy", yScale(j))
              .attr("r", 5);
          }
        }

      console.log("nodes", nodes);
    }
  }, [data]);

  return (
    <section>
      <span>Toggle Food Groups:</span>
      <label>
        <input />
      </label>
      <button type="button" onClick={handleGetAllTime} value="all">All</button>
      <button type="button" onClick={handleGetSixMonths} value="180">6 Months</button>
      <button type="button" onClick={handleGetOneYear} value="365">1 Year</button>
     <div className="beeSwarmChart"><svg ref={svgRef} width="1700" height="700"></svg></div>
    </section>
  );
};

export default Beeswarm;
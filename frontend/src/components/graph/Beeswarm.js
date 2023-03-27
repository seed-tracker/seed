import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { axisBottom } from "d3-axis";
import correlationsSlice from "../../store/correlationsSlice";
import { selectUserCorrelations } from "../../store/correlationsSlice";
import { getUserStats } from "../../store/correlationsSlice";
import * as d3 from "d3";

const Beeswarm = () => {
  const svgRef = useRef();

  const dispatch = useDispatch()
  const data = useSelector(selectUserCorrelations)
  // console.log("DATA", data)

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
    const margin = {top: 250, right: 10, bottom: 20, left: 10};
    const width = 500 - margin.left - margin.right, height = 300 - margin.top - margin.bottom;
      
svg.selectAll("svg")
    const xScale = scaleLinear()
      .domain([0, 1000]) 
      .range([0, 500]); 
    const xAxis = axisBottom(xScale);

    svg.append("g")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(xAxis);
  }, []);

  return (
    <section>
      <span>Toggle Food Groups:</span>
      <label>
        <input />
      </label>
      <button type="button" onClick={handleGetAllTime} value="all">All</button>
      <button type="button" onClick={handleGetSixMonths} value="180">6 Months</button>
      <button type="button" onClick={handleGetOneYear} value="365">1 Year</button>
     <div className="beeSwarmChart"><svg ref={svgRef} width="700" height="300"></svg></div> 
    </section>
  );
};

export default Beeswarm;
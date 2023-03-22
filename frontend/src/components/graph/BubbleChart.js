import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { selectAuthUser } from "../../store/authSlice";
import { fetchUserCorrelations, selectUserCorrelations } from "../../store/correlationsSlice";
import * as d3 from "d3";

const BubbleChart = () => {
  const dispatch = useDispatch()
  // const user = useSelector(selectAuthUser)
  const data = useSelector(selectUserCorrelations);

  useEffect(() => {
    dispatch(fetchUserCorrelations())

    // const graphSection = d3.select("#graph svg")
    // graphSection.append("g")
  }, [dispatch])

  const symptom = data.forEach((obj) => {
    return obj.symptom
  })

  const count = data.forEach((obj) => {
    return obj.count
  })

  // access key in arr with item.lift, etc
  const top_foods = data.forEach((obj) => {
    obj['top_foods'].forEach((item) => {
      console.log("FOODS", item);
      return item
    })
  })

  // access key in arr with item.avg_severity, etc
  const top_groups = data.forEach((obj) => {
    obj['top_groups'].forEach((item) => {
      return item
    })
  })

  // const svg = d3.create("svg").attr("width", 932).attr("height", 932).style("display", "block").style("margin", "0 auto").style("background", "cornflowerblue").style("cursor", "pointer")
  // graphSection.append("svg")

  const svg = d3.select("svg")
  svg.append("g")

  return (
    <svg id="graph"></svg>
  )
}

export default BubbleChart
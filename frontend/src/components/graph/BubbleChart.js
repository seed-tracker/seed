import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../../store/authSlice";
import { fetchUserCorrelations } from "../../store/correlationsSlice";
import * as d3 from "d3";

const BubbleChart = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectAuthUser)

  useEffect(() => {
    dispatch(fetchUserCorrelations(user.username))

    const graphSection = d3.select("svg")
    graphSection.append("g")

  }, [dispatch])


  return <div id="graph">
      <h1>Bubble Chart</h1>
      <svg></svg>
    </div>
}

export default BubbleChart
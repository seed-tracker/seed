import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { selectAuthUser } from "../../store/authSlice";
import { fetchUserCorrelations, selectUserCorrelations } from "../../store/correlationsSlice";
import * as d3 from "d3";



const BubbleChart = () => {
  const dispatch = useDispatch()
  // const user = useSelector(selectAuthUser)
  const data = useSelector(selectUserCorrelations);
  console.log("DATA",data)

  useEffect(() => {
    const keys = getUKeys(data);
    console.log("KEYS",keys);
    dispatch(fetchUserCorrelations())
    const graphSection = d3.select("#graph svg")
    graphSection.append("g")
    // console.log(user.username)
  }, [data,dispatch])

  function getUKeys(data) {
    let keys = [];
    data.forEach(obj => {
      Object.keys(obj).forEach(key => {
        if (!keys.includes(key)) {
          keys.push(key);
        }
      });
    });
    console.log(keys)
    return keys;
  }



  return <div id="graph">
      <h1>Bubble Chart</h1>
      <svg></svg>
    </div>
}

export default BubbleChart
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

    // const keys = getUKeys(data);
    // console.log("KEYS",keys);

    // const graphSection = d3.select("#graph svg")
    // graphSection.append("g")
  }, [dispatch])

  data.forEach((obj) => console.log(obj))

  // data.forEach((obj) => {
  //   // Object.keys(obj).forEach(key => {
  //   //   if (!keys.includes(key)) {
  //   //     keys.push(key);
  //   //   }
  //   // });
  //   console.log(obj);
  // });
  // for (const obj of data) {
  //   console.log("OBJECT", obj);
  // }
  // for (const key in data) {
  //   for (const value of key) {
  //     console.log(value);
  //   }
  // }
  // // console.log(typeof data);
  // console.log(data);
  // let values = Object.values(data)
  // console.log("VALUE", values);

  // const getUKeys = (data) => {
  //   // console.log("DATA", data)
  //   return data
  //   // let keys = [];
  //   // data.forEach(obj => {
  //   //   Object.keys(obj).forEach(key => {
  //   //     if (!keys.includes(key)) {
  //   //       keys.push(key);
  //   //     }
  //   //   });
  //   // });
  //   // console.log(keys)
  //   // return keys;
  // }
  // console.log("GETUKEYS", getUKeys);

  // const svg = d3.create("svg").attr("width", 932).attr("height", 932).style("display", "block").style("margin", "0 auto").style("background", "cornflowerblue").style("cursor", "pointer")
  // graphSection.append("svg")

  const svg = d3.select("svg")
    svg.append("g")

  return (
    <svg width="932" height="932" style={{ display: "block", background: "cornflowerblue" }}></svg>
  )
}

export default BubbleChart
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
  })

  return <div>Bubble Chart</div>
}

export default BubbleChart
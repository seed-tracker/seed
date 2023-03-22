import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../../store/authSlice";
import { fetchUserCorrelations } from "../../store/correlationsSlice";

const BubbleChart = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectAuthUser)

  useEffect(() => {
    dispatch(fetchUserCorrelations(user.username))
    console.log("CORRELATIONS", dispatch(fetchUserCorrelations(user.username))
)
  })

  return <div>Bubble Chart</div>
}

export default BubbleChart
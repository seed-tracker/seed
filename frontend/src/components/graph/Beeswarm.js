import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserStats, selectUserCorrelations } from "../../store/correlationsSlice";


const Beeswarm = () => {
  const dispatch = useDispatch()
  const data = useSelector(selectUserCorrelations)
  // console.log("DATA", data)

  const handleGetAllTime = async (all) => {
    await dispatch(getUserStats("all"))
    // console.log("All", dispatch(getUserStats("all")))
  }
  const handleGetSixMonths = async (halfYear) => {
    await dispatch(getUserStats(180))
    // console.log("half", dispatch(getUserStats(180)))
  }
  const handleGetOneYear = async (oneYear) => {
    await dispatch(getUserStats(365))
    // console.log("year", dispatch(getUserStats(365)))
  }


  return (
    <section>
      <span>Toggle Food Groups:</span>
      <label>
        <input />
      </label>
      <button type="button" onClick={handleGetAllTime} value="all">All</button>
      <button type="button" onClick={handleGetSixMonths} value="180">6 Months</button>
      <button type="button" onClick={handleGetOneYear} value="365">1 Year</button>
      {/* <span>Toggle Food Groups:</span>
      <label> */}
        {/* map values length of arr */}
        {/* <input type="checkbox" />
      </label> */}
    </section>
  )
}

export default Beeswarm
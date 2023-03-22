import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { me } from "../store/authSlice";
import BubbleChart from "./graph/BubbleChart";

/**
 * Placeholder component for the userprofile page
 * @component shows "profile"
 */
const Profile = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  return (
    <section>
      <h2>PROFILE INFO WOULD GO HERE</h2>
      <BubbleChart />
    </section>
  );
};

export default Profile;

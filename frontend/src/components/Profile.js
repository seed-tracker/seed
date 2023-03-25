import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { me } from "../store/authSlice";
import CirclePacking from "./graph/CirclePacking";
import Sidebar from "./Sidebar";

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
    <>
      <Sidebar />
      <h2>PROFILE INFO WOULD GO HERE</h2>
      <CirclePacking />
    </>
  );
};

export default Profile;

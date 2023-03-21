import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { me } from "../store/authSlice";

/**
 * Component for the homepage
 * @component shows demo
 */
const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(me());
  }, []);

  return (
    <main>
      <h2>Welcome to Seed</h2>
      <p>
        A web app to track your food input and well-being. Track your symptoms
        and food intake to get insights that might help you identify patterns,
        and narrow down food-based triggers. Insights are correlations and are
        NOT medical advice.
        <strong>
          Please remember that correlation DOES NOT equal causation!
        </strong>
      </p>
    </main>
  );
};

export default Home;

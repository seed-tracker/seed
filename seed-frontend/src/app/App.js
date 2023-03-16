import React, { useEffect, useState } from "react";
import axios from "axios";
import AppRoutes from "./AppRoutes";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * Component for the main page structure
 * @component shows the skeleton of the page - navbar, footer and makes all routes available
 */
const App = () => {
  const [info, setInfo] = useState(null);
  useEffect(() => {
    const getRoute = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/");
        console.log(data);
        setInfo(data);
      } catch (err) {
        console.error(err);
      }
    };
    getRoute();
  }, []);

  return (
    <div>
      <Navbar />
      {info}
      <AppRoutes />
      <Footer />
    </div>
  );
};

export default App;

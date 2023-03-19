import React from "react";
import AppRoutes from "./AppRoutes";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * Component for the main page structure
 * @component shows the skeleton of the page - navbar, footer and makes all routes available
 */
const App = () => {
  return (
    <div>
      <Navbar />
      <AppRoutes />
      <Footer />
    </div>
  );
};

export default App;

import React from "react";
import AppRoutes from "./AppRoutes";
import NavigationBar from "../components/Navbar";
import Footer from "../components/Footer";
import { NextUIProvider, createTheme } from "@nextui-org/react";

/**
 * Component for the main page structure
 * @component shows the skeleton of the page - navbar, footer and makes all routes available
 */
const App = () => {
  // NextUI global theme.
  const theme = createTheme({
    type: "light",
    theme: {
      colors: {
        primary: "#000000",
        secondary: "#4D5D53",
        // logo: '#4D5D53',
        background: "#cfdbd1",
      },
      fonts: {
        sans: "sans-serif",
      },
    },
  });
  return (
    <NextUIProvider theme={theme}>
      <>
        <NavigationBar />
        <AppRoutes />
        <Footer />
      </>
    </NextUIProvider>
  );
};

export default App;

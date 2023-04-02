import React from "react";
import AppRoutes from "./AppRoutes";
import NavigationBar from "../components/Navbar";
import Footer from "../components/Footer";
import { NextUIProvider, createTheme } from "@nextui-org/react";

/**
 * Component for the main page structure
 * @component shows the skeleton of the page - navbar, footer and makes all routes available
 */
// 10 words per line
const App = () => {
  // NextUI global theme.
  const theme = createTheme({
    type: "light",
    theme: {
      /* Color key
      background: default page background color
      primary: All text (black)
      secondary: Logos and Headers (h1, etc.)
      success: links
      error: red
      backgroundAlpha: defines button background  */
      colors: {
        milkyJade: "#cfdbd1",
        background: "$milkyJade",
        text: "#000000",
        primary: "$text",
        logoHeader: "#444c38",
        secondary: "$logoHeader",
        links: "#4d5d53",
        success: "$links",
        red: "#ff4848",
        error: "$red",
        buttonBackground: "#7a918d",
        neutral: "$buttonBackground",
        switchColor: "#72c589",
      },
      fonts: {
        sans: "'Euclid Regular', 'Euclid Medium', 'Eublid Bold', sans-serif",
      },
      fontWeights: {
        normal: 400,
        medium: 500,
        bold: 700,
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

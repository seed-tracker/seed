import React from "react";
import AppRoutes from "./AppRoutes";
import NavigationBar from "../components/Navbar";
import Footer from "../components/Footer";
import {NextUIProvider, createTheme} from '@nextui-org/react';


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
      // these represent names of colors. The keys can be called in individ components
      colors:{
        primary: '#000000',
        darkgreen: '#4D5D53',
        logo: 'darkgreen', 
        milkyJade: '#cfdbd1',
        background: '$milkyJade',
        /*backgroundAlpha: determine navbar background color, use 8 digit hex code where last 2 digits refer to alpha , */
      },
      fonts: {
        sans: "sans-serif"
      }
    }


  })
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

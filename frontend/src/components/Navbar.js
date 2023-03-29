import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { me } from "../store/authSlice";
import { Text, Navbar, Link, Button} from "@nextui-org/react";
import { Link as Router } from "react-router-dom";

const NavigationBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => !!state.auth.me._id);

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  const logoutAndRedirectHome = () => {
    dispatch(logout());
    navigate("/");
  };
  /**
   * Component for the Navbar
   * @component is the navigation bar that has two views:
   * If user is signed in: links to view profile & logout
   * If visitor: links to Login or Sign up
   */
  return (
    <Navbar
      isBordered
      maxWidth={"fluid"}
      variant="sticky"
      css={{
        zIndex: 999,
        background: "transparent",
        color: "#444c38",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Navbar.Brand css={{ alignItems: "center" }}>
        <Text
          h1
          css={{
            fontFamily: "Lovechild",
            alignItems: "center",
            margin: 0,
          }}
          color="$secondary"
        >
          SEED
        </Text>
      </Navbar.Brand>
      {isLoggedIn ? (
        <Navbar.Content>
          <Navbar.Link as={Link}>
            <Router
              to="/profile"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              My Profile
            </Router>
          </Navbar.Link>
          <Navbar.Item>
            <Button
              size="md"
              color="primary"
              css={{ background: "#7a918d" }}
              auto
              as={Link}
              onClick={logoutAndRedirectHome}
            >
              Logout
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      ) : (
        <Navbar.Content>
          
            <Button onClick={()=>navigate("/login")}
              size="md"
              // color="success"
              borderRadius="50%"
               css={{
                backgroundColor: "#67c43f",
                fontWeight: "bold",
                backgroundImage:
                  "radial-gradient(circle,  #5ca388 25%, #649b93 50%, #b4d3b2 100%)",
                backgroundSize: "400% 400%",
                transition: "background-position 0.4s ease-in-out",
                "&:hover": {
                  backgroundPosition: "100% 0",
                },
                color: "$secondary"
              }} 
            >
              Login
            </Button>
            <Button onClick={()=>navigate("/signup")}
              size="md"
              // color="success"
              borderRadius="50%"
             css={{
               backgroundColor: "#67c43f",
               fontWeight: "bold",
               backgroundImage:
               "radial-gradient(circle,  #5ca388 25%, #649b93 50%, #b4d3b2 100%)",
                // backgroundImage: "radial-gradient(circle, #609f67 25%, #c0b2d3 50%, #b4d3b2 100%)",
                backgroundSize: "400% 400%",
                transition: "background-position 0.8s ease-in-out",
                "&:hover": {
                  backgroundPosition: "100% 0",
                },
                color: "$secondary"
              }} 
            >
              Signup
            </Button>
        </Navbar.Content>
      )}
    </Navbar>
  );
};

export default NavigationBar;

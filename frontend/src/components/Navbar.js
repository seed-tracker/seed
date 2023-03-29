import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { me } from "../store/authSlice";
import { Text, Navbar, Link, Button } from "@nextui-org/react";
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
              flat
              bordered
              color="#7A918D"
              css={{ backgroundColor: "#7A918Dcc" }}
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
          <Navbar.Link href="/login">
            <Button
              size="md"
              color="success"
              borderRadius="50%"
              /* css={{
                backgroundColor: "#67c43f",
                backgroundImage:
                  "radial-gradient(circle, #C3C5C4 25%, #c0b2d3 50%, #b4d3b2 100%)",
                backgroundSize: "400% 400%",
                transition: "background-position 0.4s ease-in-out",
                "&:hover": {
                  backgroundPosition: "100% 0",
                },
              }} */
            >
              Login
            </Button>
          </Navbar.Link>
          <Navbar.Link href="/signup">
            <Button
              size="md"
              color="success"
              borderRadius="50%"
              /* css={{
               backgroundColor: "#67c43f",
                backgroundImage: "radial-gradient(circle, #C3C5C4 25%, #c0b2d3 50%, #b4d3b2 100%)",
                backgroundSize: "400% 400%",
                transition: "background-position 0.8s ease-in-out",
                "&:hover": {
                  backgroundPosition: "100% 0",
                },
              }} */
            >
              Signup
            </Button>
          </Navbar.Link>
        </Navbar.Content>
      )}
    </Navbar>
  );
};

export default NavigationBar;

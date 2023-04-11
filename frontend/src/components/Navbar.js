import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { me } from "../store/authSlice";
import { clearStore } from "../store";
import { Text, Navbar, Link, Button } from "@nextui-org/react";
import logo from "../img/seed-logo.png";

const NavigationBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => !!state.auth.me._id);

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  const logoutAndRedirectHome = () => {
    dispatch(logout());
    dispatch(clearStore());
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
      variant="static"
      css={{
        zIndex: 999,
        background: "transparent",
        color: "#444c38",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Navbar.Brand css={{ alignItems: "center" }}>
        <img src={logo} alt="seed logo" style={{ maxHeight: "5rem" }} />
      </Navbar.Brand>
      {isLoggedIn ? (
        <Navbar.Content>
          <Navbar.Link underline block onPress={() => navigate("/profile")}>
            My Profile
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
        <>
          <Navbar.Toggle showIn="xs" />
          <Navbar.Collapse disableAnimation>
            <Navbar.CollapseItem>
              <Link
                color="secondary"
                css={{
                  minWidth: "100%",
                  textDecoration: "none",
                  color: "$secondary",
                }}
                href="/login"
              >
                Login
              </Link>
            </Navbar.CollapseItem>
            <Navbar.CollapseItem>
              <Link
                color="secondary"
                css={{
                  minWidth: "100%",
                }}
                href="/signup"
              >
                Join Now
              </Link>
            </Navbar.CollapseItem>
          </Navbar.Collapse>
          <Navbar.Content hideIn="xs">
            <Navbar.Link>
              <Button
                size="md"
                // color="success"
                borderRadius="50%"
                onPress={() => navigate("/login")}
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
                  color: "$secondary",
                }}
              >
                Login
              </Button>
            </Navbar.Link>
            <Navbar.Link>
              <Button
                size="md"
                color="success"
                borderRadius="50%"
                onPress={() => navigate("/signup")}
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
                  color: "$secondary",
                }}
              >
                Join Now
              </Button>
            </Navbar.Link>
          </Navbar.Content>
        </>
      )}
    </Navbar>
  );
};

export default NavigationBar;

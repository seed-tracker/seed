import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { me } from "../store/authSlice";
import { Text, Navbar, Link, Button } from "@nextui-org/react";

/**
 * Component for the navbar
 * @component shows a navbar that updates links based on userstatus
 */
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
      css={{ background: "#cfdbd1", color: "#444c38" }}
    >
      <Navbar.Brand css={{ alignItems: "center" }}>
        <Text
          h1
          css={{ fontFamily: "Lovechild", alignItems: "center", margin: 0 }}
          color="$secondary"
        >
          SEED
        </Text>
      </Navbar.Brand>
      {isLoggedIn ? (
        <Navbar.Content>
          {/* <Navbar.Item>
          <Link href="/profile" text={"My Profile"}/> */}
          <Navbar.Link href="/profile" as={Link}>
            My Profile
          </Navbar.Link>
          {/* </Navbar.Item> */}
          <Navbar.Item>
            <Button
              size="md"
              bordered
              flat
              color={"#7A918D"}
              css={{ backgroundColor: "#7A918Dcc" }}
              auto
              as={Link}
              onPress={logoutAndRedirectHome}
            >
              Logout
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      ) : (
        <Navbar.Content>
          <Navbar.Link href="/login">Login</Navbar.Link>
          <Navbar.Link href="/signup">Sign Up</Navbar.Link>
        </Navbar.Content>
      )}
    </Navbar>
  );
};

export default NavigationBar;

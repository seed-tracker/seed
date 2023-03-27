import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { me } from "../store/authSlice";
import {Text, Navbar, Button, Link} from '@nextui-org/react';

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

  return (
    <Navbar isBordered variant="sticky" css={{backgroundColor:'#cfdbd1', color:'#444c38'}}>
      <Navbar.Brand>
      <Text h1 css={{fontFamily: "Lovechild"}} color="#4D5D53" weight="bold">SEED</Text>
      </Navbar.Brand>
      {isLoggedIn ? (
        <Navbar.Content>
          <Navbar.Link href="/profile">My Profile</Navbar.Link>
          <Navbar.Item>
          <Button size="xs" flat color='#444c38' css={{color:'#444c38'}} auto as={Link} onClick={logoutAndRedirectHome}>
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

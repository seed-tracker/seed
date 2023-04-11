import React from "react";
import { Container, Row, Col, Text, Spacer } from "@nextui-org/react";
import Links from "./nextUI/Links";
import logo from "../img/seed-logo.png";

/**
 * Component for the footer
 * @component shows the footer
 */
const Footer = () => {
  return (
    <footer>
      <Container
        display="flex"
        wrap="wrap"
        fluid
        responsive={false}
        css={{
          position: "relative",
          bottom: 0,
          backgroundColor: "rgb(77,93,83, 0.1)",
          padding: "1rem",
          margin: 0,
        }}
      >
        <Container
          display="flex"
          direction={"column"}
          css={{
            "@xs": {
              margin: 0,
              padding: "0 1vw",
              maxWidth: "100vw",
            },
            "@sm": {
              margin: 0,
              maxWidth: "18vw",
            },
          }}
        >
          <img
            src={logo}
            alt="seed logo"
            style={{
              margin: 0,
              padding: 0,
              maxWidth: "7rem",
            }}
          />
          <Text>Follow Us:</Text>
          <Links
            css={{ display: "block" }}
            href={"http://instagram.com"}
            text={"Instagram"}
          />
          <Links href={"http://twitter.com"} text={"Twitter"} />

          <Spacer y={1} />

          <Text size={14}>Privacy Policy</Text>

          <Text size={14}>Copyright &copy; 2023 Seed, Inc.</Text>
        </Container>
        <Spacer x={2} />
        <Container
          display="flex"
          direction={"column"}
          css={{
            "@xs": {
              margin: 0,
              padding: "1vw",
              maxWidth: "100vw",
            },
            "@sm": {
              margin: 0,
              maxWidth: "30vw",
            },
          }}
        >
          <Text h3 color="#4D5D53">
            Our Mission
          </Text>
          <Text size={14}>
            Finding associations/relationships between symptoms and foods,
            allowing you to narrow down food-based triggers. <br />
          </Text>
          <Text size={16}>
            <strong>
              {/* Please remember that SEED does not provide medical advice! */}
            </strong>
          </Text>
        </Container>
        <Spacer x={2} />
        <Container
          display="flex"
          direction={"column"}
          css={{
            "@xs": {
              margin: 0,
              padding: "1vw",
              maxWidth: "100vw",
            },
            "@sm": {
              margin: 0,
              maxWidth: "40vw",
            },
          }}
        >
          <Text h3 color="#444c38">
            Medical Advice Disclaimer
          </Text>
          <Text size={14}>
            This web site is intended for informational purposes only and should
            not be used to diagnose, treat, cure, or prevent any disease. Those
            seeking personal medical advice should consult with a licensed
            physician. <br />
          </Text>
          <Text size={16}>
            <strong>
              If you think you may have a medical emergency, call 911 or go to
              the nearest emergency room immediately.
            </strong>
          </Text>
        </Container>
      </Container>
    </footer>
  );
};

export default Footer;

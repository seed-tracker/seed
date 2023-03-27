import React from "react";
import { Container, Row, Col, Text } from "@nextui-org/react";

/**
 * Component for the footer
 * @component shows the footer
 */
const Footer = () => {
  return (
    <footer>
      <Container
        fluid
        responsive={false}
        css={{
          position: "relative",
          bottom: "0",
          backgroundColor: "#FFFFFF",
          padding: "0.5rem 1rem",
        }}
      >
        <Row justify="center">
          <Col span={5}>
            <Text h5 color="#4D5D53">
              Our Mission
            </Text>
            <Text size={13}>
              Finding correlations between symptoms and foods, allowing you to
              narrow down food-based triggers. <br />
              <strong>
                Please remember that correlation DOES NOT equal causation and
                SEED does not provide medical advice!
              </strong>
            </Text>
          </Col>
          <Col span={7}>
            <Text h5 color="#444c38">
              Medical Advice Disclaimer
            </Text>
            <Text size={13}>
              This web site is provided for informational purposes only and does
              not constitute providing medical advice or professional services.
              The information provided should not be used for diagnosing or
              treating a health problem or disease, and those seeking personal
              medical advice should consult with a licensed physician. <br />
              <strong>
                If you think you may have a medical emergency, call 911 or go to
                the nearest emergency room immediately.
              </strong>
            </Text>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

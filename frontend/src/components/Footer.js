import React from "react";
import { Container, Row, Col, Text, Spacer } from "@nextui-org/react";
import Links from "./nextUI/Links";

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
          backgroundColor: "rgb(77,93,83, 0.1)",
          padding: "2rem 2rem 3rem 2rem",
        }}
      >
        <Container>
          <Row justify="center">
            <Col span={2}>
              <Row>
                <Text h1 css={{fontFamily: "Lovechild"}} color="$secondary">SEED</Text>
              </Row>
              <Row>
                <Text>Follow Us:</Text>
                <Links href={"instagram.com"} text={"Instagram"} />
                <Links href={"twitter.com"} text={"Twitter"} />
              </Row>
              <Spacer y={1}/>
              <Row>
                <Text size={14}>Privacy Policy</Text>
              </Row>
              <Row>
                <Text size={14}>Copyright &copy; 2023 Seed, Inc.</Text>
              </Row>
            </Col>
            <Spacer x={2}/>
            <Col span={5}>
              <Text h3 color="#4D5D53">
                Our Mission
              </Text>
              <Text size={14}>
                Finding associations/relationships between symptoms and foods,
                allowing you to narrow down food-based triggers. <br />
              </Text>
              <Text size={16}>
                <strong>
                  Please remember that SEED does not provide medical advice!
                </strong>
              </Text>
            </Col>
            <Spacer x={2}/>
            <Col span={5}>
              <Text h3 color="#444c38">
                Medical Advice Disclaimer
              </Text>
              <Text size={14}>
                This web site is provided for informational purposes only and does
                not constitute providing medical advice or professional services.
                The information provided should not be used for diagnosing or
                treating a health problem or disease, and those seeking personal
                medical advice should consult with a licensed physician. <br />
              </Text>
              <Text size={16}>
                <strong>
                  If you think you may have a medical emergency, call 911 or go to
                  the nearest emergency room immediately.
                </strong>
              </Text>
            </Col>
          </Row>
        </Container>
      </Container>
    </footer>
  );
};

export default Footer;

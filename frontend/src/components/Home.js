import { Button, Container, Collapse } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import circlePacking from "../img/circle-packing.png";
import mealForm from "../img/meal-form.png";
import scatterPlot from "../img/scatter-plot.png";
import symptomForm from "../img/symptom-form.png";
import topFoods from "../img/top-foods.png";
import topSymptoms from "../img/top-symptoms.png";
import { me } from "../store/authSlice";
import { Links } from "./nextUI";
import logo from "../img/seed-logo.png";

/**
 * Component for the homepage
 * @component shows demo
 */
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  return (
    <>
      <Container
        className="homehero"
        fluid
        responsive={"false"}
        display="flex"
        wrap={"wrap"}
        css={{
          "@sm": {
            alignContent: "center",
            justifyContent: "flex-end",
            paddingRight: "10rem",
          },
        }}
      >
        <h2 style={{ fontSize: "10vh", color: "#444c38" }}>
          <img
            src={logo}
            alt="seed logo"
            style={{ maxHeight: "8rem", margin: 0, padding: 0 }}
          />
          <br />
          No Roots <br />
          No Growth
        </h2>
      </Container>
      <Container
        fluid
        className="glassmorpheus-graph"
        responsive={"false"}
        display="flex"
        direction="column"
        wrap={"wrap"}
        css={{
          padding: "5vw",
        }}
      >
        <h4>
          Are you tired of struggling to determine which foods are causing you
          discomfort and negatively impacting your health?{" "}
        </h4>
        <h4>
          <span style={{ fontFamily: "Lovechild" }}>SEED</span> is here to make
          the process simple and straightforward &mdash; identify patterns and
          narrow down potential food-based triggers!*{" "}
        </h4>

        <h4>
          Our intuitive interface and user-friendly design makes it easy for
          anyone to use, regardless of their technical experience.
        </h4>
        <h4>
          Start feeling your best and take the first step towards a healthier,
          happier you today!
        </h4>
        <p>
          <strong>
            *Insights are associations/relations and are NOT medical advice.
          </strong>
        </p>
        <Container
          fluid
          responsive={"false"}
          display="flex"
          justify="center"
          wrap={"wrap"}
          css={{
            paddingTop: "2rem",
            alignItems: "center",
          }}
        >
          <strong>Created by</strong>{" "}
          <Links href="https://www.linkedin.com/in/judylkuo/" text="Judy Kuo" />
          |{" "}
          <Links
            href="https://www.linkedin.com/in/jolee-developer"
            text="Jo Lee"
          />
          |{" "}
          <Links href="https://www.linkedin.com/in/wanyi-ng/" text="Wanyi Ng" />
          |{" "}
          <Links
            href="https://www.linkedin.com/in/ltreidler/"
            text="Leah Treidler"
          />{" "}
          |{" "}
          <Links
            href="https://www.linkedin.com/in/vikwedel/"
            text="Vik Wedel"
          />
        </Container>
      </Container>
      <Container
        fluid
        responsive={"false"}
        display="flex"
        direction="column"
        wrap={"wrap"}
        css={{
          padding: "5vw",
        }}
        className="glassmorpheus"
      >
        <h2>Sign up today and get access to:</h2>
        <ul>
          <li>
            {/* <h3 onClick={toggleCollapse}>Intuitive Interface</h3> */}
            <Collapse open={isOpen} title="Intuitive Interface">
              <p>
                We make tracking your meals and symptoms simple and
                straightforward. With just a few clicks, you can easily log your
                meals and any symptoms you experience, allowing you to quickly
                identify potential patterns and narrow down the foods that may
                be causing issues.
              </p>
              <p>
                Say goodbye to the frustration of traditional food diaries and
                symptom logs. With SEED's intuitive interface, tracking your
                diet and health has never been easier. Start feeling your best
                and take the first step towards a healthier, happier you with
                SEED.
              </p>
            </Collapse>
            <Container
              display="flex"
              css={{
                gap: "1rem",
                "@xs": {
                  flexDirection: "column",
                  maxWidth: "90vw",
                  padding: "1rem",
                },
                "@sm": {
                  flexDirection: "row",
                  justifyContent: "space-around",
                  maxWidth: "90vw",
                },
              }}
            >
              <img
                className="blobby"
                style={{ aspectRatio: "auto", maxHeight: "40vh" }}
                src={mealForm}
                alt={
                  "SEED's Add A Meal Form - showing options available during meal entry"
                }
              />
              <img
                style={{ aspectRatio: "auto", maxHeight: "40vh" }}
                src={symptomForm}
                alt={
                  "SEED's Add A Symptom Form - showing options available during symptom entry"
                }
              />
            </Container>
          </li>

          <li>
            {" "}
            <Collapse
              open={isOpen}
              title=" A Wide Range of Data Vizualizations"
            >
              {/* <h3>A Wide Range of Data Vizualizations</h3> */}
              <p>
                Our data visualization options allow you to easily analyze your
                tracked data and identify potential associations between your
                meals and symptoms. With a variety of visualization options to
                choose from, you can customize your view to best suit your needs
                and preferences.
              </p>
              <p>
                Say goodbye to the frustration of traditional food diaries and
                symptom logs. With SEED's intuitive interface, tracking your
                diet and health has never been easier. Start feeling your best
                and take the first step towards a healthier, happier you with
                SEED.
              </p>
            </Collapse>
          </li>
          <li>
            <h4>View Your Top Associations</h4>
            <p>
              Our scatter plot and circle packing graphs provide a powerful
              visualization of your tracked data, allowing you to easily
              identify the top associations between specific foods and symptoms.
            </p>
            <p>
              The <strong>scatterplot graph </strong>displays a visual
              representation of the relationship between different foods eaten
              and symptoms felt, allowing you to easily identify potential
              patterns and associations. This intuitive graph makes it easy to
              determine which foods may be causing issues, and adjust your diet
              accordingly.{" "}
            </p>
            <Container
              display="flex"
              css={{
                justifyContent: "space-around",
                padding: "1rem",
              }}
            >
              <img
                style={{ aspectRatio: "auto", maxHeight: "40vh" }}
                src={scatterPlot}
                alt={
                  "SEED's Top Association Scatter Plot Graph - showing a demo vizualization"
                }
              />
            </Container>
            <p>
              The <strong>circle packing graph</strong> takes things a step
              further, by visualizing the top associations between specific
              foods and symptoms. This graph displays the most common food
              triggers in a hierarchical format, allowing you to quickly see
              which foods are most frequently associated with negative symptoms.
              With SEED's scatterplot and circle packing graphs, you can take
              control of your diet and health like never before. Say goodbye to
              the frustration of trial and error, and make informed decisions
              about what you eat with SEED.
            </p>
            <Container
              display="flex"
              css={{
                justifyContent: "space-around",
                padding: "1rem",
              }}
            >
              <img
                style={{ aspectRatio: "auto", maxHeight: "40vh" }}
                src={circlePacking}
                alt={
                  "SEED's Top Association Circle Packing Graph - showing a demo vizualization"
                }
              />
            </Container>
          </li>
          <li>
            <h4>View Your Top Tracked Foods & Symptoms</h4>
            <p>
              Our top tracked foods and symptoms graphs provide a comprehensive
              overview of your diet and health, allowing you to easily see the
              most frequently tracked foods and symptoms.
            </p>
            <Container
              display="flex"
              css={{
                justifyContent: "space-around",
                padding: "1rem",
              }}
            >
              <img
                style={{ aspectRatio: "auto", maxHeight: "40vh" }}
                src={topFoods}
                alt={
                  "SEED's Top Foods Lollipop Graph - showing a demo vizualization"
                }
              />
            </Container>
            <p>
              With the <strong>top tracked foods graph</strong>, you can quickly
              identify the foods you consume most frequently, and determine if
              any of these foods are potential triggers for negative symptoms.
            </p>
            <p>
              The <strong>top tracked symptoms graph</strong> provides a clear
              overview of the most frequently tracked symptoms.
            </p>
            <Container
              display="flex"
              css={{
                justifyContent: "space-around",
                padding: "1rem",
              }}
            >
              <img
                style={{ aspectRatio: "auto", maxHeight: "40vh" }}
                src={topSymptoms}
                alt={
                  "SEED's Top Symptoms Lollipop Graph - showing a demo vizualization"
                }
              />
            </Container>
          </li>
        </ul>
      </Container>
      <Container
        fluid
        responsive={"false"}
        display="flex"
        direction="column"
        css={{ alignItems: "center", padding: "5rem", gap: "2rem" }}
        justify="center"
        className="glassmorpheus-graph"
      >
        <h2 style={{ color: "#444c38" }}>
          Plant your <span style={{ fontFamily: "Lovechild" }}>SEED</span>{" "}
          today!
        </h2>
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
      </Container>
    </>
  );
};

export default Home;

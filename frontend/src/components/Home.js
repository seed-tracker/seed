import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { me } from "../store/authSlice";
import { Container, Image } from "@nextui-org/react";
import { Links, HeaderText } from "./nextUI";

/**
 * Component for the homepage
 * @component shows demo
 */
const Home = () => {
  const dispatch = useDispatch();

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
          "@xs": {
            paddingLeft: "0",
          },
          "@sm": {
            alignContent: "center",
            justifyContent: "flex-end",
            paddingRight: "10rem",
          },
        }}
      >
        <h2 style={{ fontSize: "5rem", color: "#444c38" }}>
          <span style={{ fontFamily: "Lovechild" }}>SEED</span> <br />
          No Roots <br />
          No Growth
        </h2>
      </Container>
      <Container>
        <p>
          Are you tired of struggling to determine which foods are causing you
          discomfort and negatively impacting your health? Our powerful tool is
          here to make the process simple and straightforward. easily identify
          patterns and narrow down potential food-based triggers
          <span style={{ fontFamily: "Lovechild" }}>SEED</span> can help you
          identify patterns and narrow down potential food based triggers.
          Simply track your symptoms and food intake and see insights grow.
        </p>
        <p>
          <strong>
            Insights are associations/relations and are NOT medical advice.
          </strong>
        </p>
        <p>
          Our intuitive interface and user-friendly design make it easy for
          anyone to use, regardless of their technical experience. Start feeling
          your best and take the first step towards a healthier, happier you
          today!
        </p>
      </Container>

      <h2>Sign up today and get access to:</h2>
      <ul>
        <li>Intuitive Interface</li>

        <li>Track your Symptoms & Food Intake</li>
        <li>Choose from an array of data vizualizations</li>
        <li>Scatter Plot/Top Associations</li>
        <p>
          A scatterplot graph is a visual representation of data that shows the
          relationship between two variables. In this case, the graph is showing
          the relationship between different foods eaten and the symptoms felt
          by an individual. The horizontal axis of the graph represents the
          different types of food consumed, while the vertical axis represents
          the severity of symptoms experienced. Each point on the graph
          represents a specific combination of food and symptoms. The
          scatterplot allows you to easily see patterns and relationships
          between the foods consumed and the symptoms felt. For example, if
          there is a cluster of points in the upper right-hand corner of the
          graph, this indicates that there may be a correlation between certain
          foods and more severe symptoms. Conversely, if there are several
          points clustered in the lower left-hand corner of the graph, this may
          indicate that certain foods are not causing any significant symptoms.
          Overall, the scatterplot graph is a powerful tool for visualizing the
          relationship between different variables and can help individuals make
          informed decisions about their diet and overall health.
        </p>
        <li>Circle Packing/Top Associations</li>
        <li>Top 10 Tracked Foods</li>
        <li>Top 5 Tracked Symptoms</li>
        <li>No need for clunky spreadsheets</li>
        <p>
          Welcome to our innovative application designed to help you take
          control of your health and identify potential food triggers that may
          be causing discomfort and negative symptoms. Our team of expert
          developers and health professionals have created this easy-to-use tool
          with the goal of making it simple and straightforward for anyone to
          track their diet and symptoms. Our application offers a powerful
          solution for those who struggle to determine which foods are causing
          them discomfort. By tracking your diet and any symptoms you
          experience, our intuitive interface allows you to quickly identify
          potential patterns and narrow down the foods that may be causing
          issues. We understand the frustration of trial and error when it comes
          to managing your diet and health. That's why we've designed our
          application to take the guesswork out of the equation, helping you
          make informed decisions about what you eat and how it impacts your
          body. Our commitment to your health and well-being is at the heart of
          everything we do. We believe that everyone deserves to feel their
          best, and our application is designed to make that a reality. Join the
          countless individuals who have taken control of their health with our
          application. Start tracking your diet and symptoms today and take the
          first step towards a healthier, happier you! How does it work? make
          icons? Sign up today Track your meals and symptoms Get insights about
          associations Plant your SEED today - SignUp Link -
        </p>
      </ul>

      <Container
        fluid
        responsive={"false"}
        display="flex"
        wrap={"wrap"}
        css={{ alignItems: "center" }}
        justify="center"
        className="glassmorpheus-graph"
      >
        <strong>Created by</strong>{" "}
        <Links href="https://www.linkedin.com/in/judylkuo/" text="Judy Kuo" />|{" "}
        <Links
          href="https://www.linkedin.com/in/jolee-developer"
          text="Jo Lee"
        />
        | <Links href="https://www.linkedin.com/in/wanyi-ng/" text="Wanyi Ng" />
        |{" "}
        <Links
          href="https://www.linkedin.com/in/ltreidler/"
          text="Leah Treidler"
        />{" "}
        |{" "}
        <Links href="https://www.linkedin.com/in/vikwedel/" text="Vik Wedel" />
      </Container>
    </>
  );
};

export default Home;

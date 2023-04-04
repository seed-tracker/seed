import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { select } from "d3-selection";
import { scaleBand, scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { fetchAllSymptoms, selectSymptoms } from "../../store/symptomSlice";
import {
  statsSlice,
  selectUserStats,
  getUserStats,
} from "../../store/statsSlice";
import * as d3 from "d3";
import { Container, Text, Button } from "@nextui-org/react";
import { HeaderText } from "../nextUI";

/**
 * This chart shows the user's top five symptoms with the highest counts during a certain time period and a legend.
 * The legend shows a color palette of the unique color associated with each of the symptoms from the database.
 * @returns two <svg> elements: (1) the lollipop chart, (2) the legend for the chart
 * @returns three <button> elements: filter by (1) all time, (2) half a year, (3) 1 year
 */
const TopSymptoms = () => {
  const [showChart, setShowChart] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("allTime");
  const svgRef = useRef();
  const allSymptoms = useSelector(selectSymptoms);
  const dispatch = useDispatch();
  const data = useSelector(selectUserStats);
  const symptoms = data.symptoms ? data.symptoms.slice(0, 5) : [];
  const counts = symptoms ? symptoms.map((symptom) => symptom.count) : [];
  const colorPalette = [
    "#A8E6Ce",
    "#478c80",
    "#167288",
    "#f3929c",
    "#8cdaec",
    "#ffc02e",
    "#4e49a8",
    "#d93f7a",
    "#836394",
    "#0c97ed",
  ]; // Define a color palette for the symptoms and map each symptom to a unique color

  const symptomColors = {};
  for (let i = 0; i < allSymptoms.length; i++) {
    const symptomName = allSymptoms[i].name;
    const colorIndex = i % colorPalette.length;
    symptomColors[symptomName] = colorPalette[colorIndex];
  }

  const handleGetAllTime = async (all) => {
    setSelectedFilter("allTime");
    await dispatch(getUserStats("all"));
  };
  const handleGetSixMonths = async (halfYear) => {
    setSelectedFilter("sixMonths");
    await dispatch(getUserStats(180));
    if (!data.symptoms || data.symptoms.length <= 1) {
      alert("No data currently to show");
      setShowChart(false);
    } else {
      setShowChart(true);
    }
  };
  const handleGetOneYear = async (oneYear) => {
    setSelectedFilter("oneYear");
    await dispatch(getUserStats(365));
  };

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    const margin = { top: 140, right: 10, bottom: 200, left: 50 };
    const width = 750 - margin.left - margin.right;
    const height = 60 - margin.top - margin.bottom;

    if (symptoms && symptoms.length > 1) {
      const xScale = scaleBand()
        .domain(symptoms.map((symptom) => symptom.name))
        .range([0, width]);
      const yScale = scaleLinear()
        .domain([Math.max(...counts) * 2, 0])
        .range([height, 0]);
      const xAxis = axisBottom(xScale).tickSizeOuter(0);
      const yAxis = axisLeft(yScale).ticks(5);

      const xAxisLine = svg
        .append("g")
        .attr("transform", `translate(${margin.left * 2}, ${margin.top * 2})`)
        .attr("class", "x-axis")
        .call(xAxis); // make the x-axis

      xAxisLine.selectAll("text").on("click", (event, d) => {
        svg.select(".x-axis").transition().duration(500).call(xAxis);
      });

      const yAxisLine = svg
        .append("g")
        .attr("transform", `translate(${margin.left * 2}, ${margin.top * 2})`)
        .call(yAxis); // make the y-axis

      svg.selectAll(".tick text").on("click", (event, d) => {
        svg.select(".x-axis").transition().duration(500).call(xAxis);
      });

      // Create lollipop chart
      const g = svg
        .append("g")
        .attr(
          "transform",
          `translate(${xScale.bandwidth() / 2 + margin.left * 2}, ${
            margin.top * 2
          })`
        );

      if (symptoms && symptoms.length > 0) {
        svg
          .append("text")
          .attr("x", height / 2)
          .attr("y", margin.left)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .text("Times Logged");
      }

      g.selectAll("circle")
        .data(symptoms)
        .join(
          (enter) =>
            enter
              .append("circle")
              .attr("cx", (food) => xScale(food.name))
              .attr("cy", (food) => yScale(food.count))
              .attr("r", 0)
              .attr("fill", (d) => symptomColors[d.name])
              .style("opacity", 0.3)
              .call((enter) =>
                enter
                  .transition()
                  .duration(1000)
                  .delay((d, i) => i * 1000)
                  .ease(d3.easeElasticOut)
                  .attr("r", 20)
              ),
          (update) =>
            update.call((update) =>
              update
                .transition()
                .duration(1000)
                .delay((d, i) => i * 1000)
                .ease(d3.easeElasticOut)
                .attr("cx", (d) => xScale(d.name) + xScale.bandwidth() / 2)
                .attr("cy", (d) => yScale(d.count))
            ),
          (exit) =>
            exit.call((exit) =>
              exit
                .transition()
                .duration(1000)
                .ease(d3.easeElasticOut)
                .attr("r", 0)
                .remove()
            )
        );

      for (let i = 0; i < symptoms.length; i++) {
        for (let j = 0; j < counts[i]; j++) {
          g.append("circle")
            .attr("cx", xScale(symptoms[i].name))
            .attr("cy", yScale(j + 1))
            .attr("fill", symptomColors[symptoms[i].name])
            .attr("r", j === counts[i] - 1 ? 8 : 2); // larger radius for last element
          if (j === counts[i] - 1) {
            g.append("text") // Label the count of that symptom
              .attr("x", xScale(symptoms[i].name))
              .attr("y", yScale(j + 1) - 30)
              .attr("text-anchor", "middle")
              .text("Count: " + counts[i]);
          }
        }
      }
    } else {
      svg
        .append("text")
        .attr("x", `${width / 2 + margin.left}`)
        .attr("y", `${-(height + margin.top)}`)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Sorry not enough data for this time period.");
    }
  }, [data]);

  return (
    <>
      <HeaderText text="Your Top 5 Symptoms" />
      <Container display={"flex"} align="center" justify="center" wrap={"wrap"}>
        {symptoms.map((symptomName, i) => (
          <div
            style={{
              display: "flex",
              width: "auto",
              wrap: "nowrap",
              align: "center",
              padding: "2rem 0",
            }}
          >
            <div
              style={{
                backgroundColor: symptomColors[symptomName.name],
                width: "1rem",
                height: "1rem",
                padding: "0.8rem",
                margin: "0 0.5rem 0 2rem",
                borderRadius: "1rem",
              }}
            ></div>
            <Text h5>{symptomName.name}</Text>
          </div>
        ))}
      </Container>
      <Container
        display={"flex"}
        direction={"column"}
        alignItems={"center"}
        justify={"center"}
      >
        <Container
          css={{
            position: "relative",
            overflow: "auto",
            "-webkit-overflow-scrolling": "touch",
          }}
        >
          <svg
            ref={svgRef}
            preserveAspectRatio="XMaxYMid meet"
            viewBox="0 0 750 350"
            width="900"
            height="360"
          ></svg>
        </Container>
        <Container
          display="flex"
          alignItems="center"
          justify="center"
          css={{ gap: "1rem" }}
        >
          <Text h4>Filter data by</Text>
          <Button
            onPress={handleGetAllTime}
            type="button"
            size="sm"
            aria-label="Button to filter chart top symptoms view by all time"
            css={{
              backgroundColor:
                selectedFilter === "allTime" ? "#5b6c61" : "#7a918d",
            }}
          >
            All Time
          </Button>
          <Button
            onPress={handleGetSixMonths}
            type="button"
            size="sm"
            aria-label="Button to filter chart top symptoms view by six months"
            css={{
              backgroundColor:
                selectedFilter === "sixMonths" ? "#5b6c61" : "#7a918d",
            }}
          >
            6 Months
          </Button>
          <Button
            onPress={handleGetOneYear}
            // onPressChange={handlePressChange}
            type="button"
            aria-label="Button to filter chart top symptoms view by one year"
            size="sm"
            css={{
              backgroundColor:
                selectedFilter === "oneYear" ? "#5b6c61" : "#7a918d",
            }}
          >
            1 Year
          </Button>
        </Container>
      </Container>
    </>
  );
};

export default TopSymptoms;
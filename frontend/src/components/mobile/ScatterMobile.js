import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import * as d3 from "d3";
import { Row, Collapse, Spacer, Text } from "@nextui-org/react";

//scatter plot with only two lines, optimized for mobile view
const ScatterPlotMobile = ({ currentSymptom, item, windowSize }) => {
  const { data: chartData } = useSelector((state) => state.scatter);
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [showGraph, setShowGraph] = useState(false);

  const colorPalette = ["#DC050C", "#882E72"];

  const gRef = useRef();

  //format once chart data, symptom, item are set
  useEffect(() => {
    if (chartData && chartData.length && currentSymptom && item) {
      formatData();
    }
  }, [chartData, currentSymptom, item]);

  //find and format the data for the given symptom and item
  const formatData = () => {
    const symptomData = chartData.find((d) => d.symptom === currentSymptom);

    const formattedData = [
      {
        name: symptomData.symptom,
        values: symptomData.symptom_data.map((month) => ({
          count: month["count"],
          date: createDate(month),
        })),
      },
      getFoodData([...symptomData.top_foods, ...symptomData.top_groups]),
    ];

    if (!formattedData[1]) return;

    setData(formattedData);

    const dateData = formattedData[0].values;

    //get the domain for the x axis
    setDateRange([dateData[0].date, dateData[dateData.length - 1].date]);
  };

  const createDate = (data) =>
    d3.timeParse("%m/%Y")(`${data["month"]}/${data["year"]}`);

  //find and format the food data
  const getFoodData = (data) => {
    const food = data.find(({ _id }) => _id === item);
    if (!food) return;
    return {
      name: item,
      values: food.months.map((d) => ({
        count: d.count,
        date: createDate(d),
      })),
    };
  };

  const makeKey = (text) => {
    return text.split(" ").join("_").split(",").join("_");
  };

  // set up container, scaling, axis, labeling, data
  useEffect(() => {
    if (!data || !data.length) return;

    //base width, height on window size
    const width = 300;
    const height = 150;

    const svg = d3.select(gRef.current);

    svg.text("");

    // svg.attr("width", width + 300).attr("height", height + 70);
    svg.attr("viewBox", `0 0 ${width + 150} ${height + 50}`);

    //find max value on the y axis
    const max_y = data.reduce(
      (max, { values }) =>
        Math.max(
          d3.max(values, (d) => d.count + 5),
          max
        ),
      0
    );

    const x = d3.scaleTime().domain(dateRange).range([0, width]);
    const axis = d3.axisBottom(x).ticks(5);

    //generagte x axis, date format
    svg
      .append("g")
      .attr("transform", `translate(30, ${height + 20})`)
      .call(axis);

    //y axis, linear
    const y = d3.scaleLinear().domain([0, max_y]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y)).attr("transform", `translate(30, 20)`);

    //add the lines
    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.count));

    svg
      .selectAll("lines")
      .data(data)
      .join("path")
      .attr("d", (d) => line(d.values))
      .attr("stroke", (d, i) => colorPalette[i])
      .attr("class", function (d) {
        return makeKey(d.name);
      })
      .style("stroke-width", 4)
      .style("fill", "none")
      .attr("transform", `translate(30, 20)`);
  }, [data]);

  return (
    <Collapse.Group>
      <Collapse
        subtitle={showGraph ? "Close Graph" : "Show Graph"}
        title=""
        css={{ fontSize: "$sm", fontWeight: "light" }}
        expanded={showGraph}
        onChange={() => setShowGraph(!showGraph)}
      >
        <Text b>Times recorded per month</Text>
        <svg ref={gRef}></svg>{" "}
        <Row align="flex-end" justify="flex-end">
          <Text css={{ color: colorPalette[0] }}>{currentSymptom}</Text>
          <Spacer x={1} />
          <Text css={{ color: colorPalette[1] }}>{item}</Text>
          <Spacer x={1} />
        </Row>
      </Collapse>
    </Collapse.Group>
  );
};

export default ScatterPlotMobile;

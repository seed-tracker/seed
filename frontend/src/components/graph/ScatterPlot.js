import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";
import { fetchScatterData } from "../../store/scatterSlice";
import ScatterControls from "./ScatterControls";
import { HeaderText } from "../nextUI";
import {
  Container,
  Button,
  Spacer,
  Switch,
  Text,
  Row,
} from "@nextui-org/react";

const ScatterPlot = () => {
  const dispatch = useDispatch();
  const { data: chartData, maxMonths } = useSelector((state) => state.scatter);
  const [allData, setAllData] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [currentFoods, setCurrentFoods] = useState([]);
  const [currentGroups, setCurrentGroups] = useState([]);
  const [legend, setLegend] = useState([]);
  const [colorPalette, setColorPalette] = useState([
    "#DC050C",
    "#882E72",
    "#eb38bf",
    "#1965B0",
    "#7BAFDE",
    "#1B7837",
    "#90C987",
    "#E8601C",
    "#DDAA33",
  ]);

  const svgRef = useRef();

  useEffect(() => {
    dispatch(fetchScatterData());
  }, [dispatch]);

  useEffect(() => {
    if (chartData && chartData.length) {
      formatData();
    }
  }, [chartData]);

  const formatData = () => {
    const formattedData = chartData.map((d) => {
      return {
        symptomData: {
          name: d["symptom"],
          values: d["symptom_data"].map((month) => ({
            count: month["count"],
            date: createDate(month),
          })),
        },
        foodData: formatFoods(d["top_foods"]),
        groupData: formatFoods(d["top_groups"]),
      };
    });

    setAllData(formattedData);

    const { symptomData, foodData, groupData } = formattedData[0];

    if (!currentSymptom) {
      setCurrentSymptom(symptomData.name);
      if (foodData[0] && foodData[0].name) setCurrentFoods([foodData[0].name]);
      else setCurrentGroups([groupData[0].name || null]);
    }

    setDateRange([
      symptomData.values[0].date,
      symptomData.values[symptomData.values.length - 1].date,
    ]);
  };

  const createDate = (data) =>
    d3.timeParse("%m/%Y")(`${data["month"]}/${data["year"]}`);

  const formatFoods = (data) => {
    return data.map((food) => ({
      name: food["_id"],
      values: food["months"].map((d) => ({
        count: d["count"],
        date: createDate(d),
      })),
    }));
  };

  const toggleSymptom = (symptom) => {
    if (!allData || !allData.length) return;

    setCurrentSymptom(symptom);
    const { groupData, foodData } = allData.find(
      ({ symptomData }) => symptomData.name === symptom
    );

    if (foodData.length) {
      setCurrentFoods([foodData[0].name]);
      setCurrentGroups([]);
    } else {
      setCurrentFoods([]);
      if (groupData.length) setCurrentGroups([groupData[0].name]);
      else setCurrentGroups([]);
    }
  };

  const makeKey = (text) => {
    return text.split(" ").join("_").split(",").join("_");
  };

  const toggleLine = (name) => {
    const nodes = d3.selectAll(`.${makeKey(name)}`);

    if (!nodes) return;

    // Change the opacity: from 0 to 1 or from 1 to 0
    nodes.transition().style("opacity", nodes.style("opacity") == 1 ? 0 : 1);
  };

  // set up container, scaling, axis, labeling, data
  useEffect(() => {
    if (!allData || !allData.length || !allData[0].symptomData) return;

    const width = 700;
    const height = 400;

    const svg = d3.select(svgRef.current);

    svg.text("");

    svg
      .attr("width", "auto")
      .attr("height", height)
      .style("overflow", "visible")
      .style("margin-top", "3rem");

    const labels = [currentSymptom, ...currentFoods, ...currentGroups];
    //make a color range
    const colors = d3.scaleOrdinal().domain(labels).range(colorPalette);

    const { symptomData, groupData, foodData } = allData.find(
      ({ symptomData }) => symptomData.name === currentSymptom
    );

    const data = [symptomData, ...foodData, ...groupData];
    setLegend(data.map(({ name }) => ({ name: name, color: colors(name) })));

    const max_y = data.reduce(
      (max, { values }) =>
        Math.max(
          d3.max(values, (d) => d.count + 5),
          max
        ),
      0
    );

    const x = d3.scaleTime().domain(dateRange).range([0, width]);
    const axis = d3.axisBottom(x).ticks(6);
    //generagte x axis, date format
    const xAxis = svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(axis);

    const y = d3.scaleLinear().domain([0, max_y]).range([height, 0]);
    svg.append("g").transition().duration(500).call(d3.axisLeft(y));

    //add the lines
    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.count));

    svg
      .append("defs")
      .append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    const lines = svg
      .selectAll("myLines")
      .data(data)
      .join("path")
      .attr("d", (d) => line(d.values))
      .attr("stroke", (d) => colors(d.name))
      .attr("class", function (d) {
        return makeKey(d.name);
      })
      .attr("clip-path", "url(#clip")
      .style("stroke-width", 4)
      .style("fill", "none")
      .style("opacity", (d) =>
        [...currentFoods, ...currentGroups, currentSymptom].includes(d.name)
          ? 1
          : 0
      );

    const dots = svg
      .selectAll("myDots")
      .data(data)
      .join("g")
      .style("fill", (d) => colors(d.name))
      .selectAll("myPoints")
      .data((d) => d.values)
      .join("circle")
      .attr("r", 5)
      .attr("stroke", "blue")
      .style("opacity", (d) =>
        [...currentFoods, ...currentGroups, currentSymptom].includes(d.name)
          ? 1
          : 0
      );

    svg
      .selectAll("myLabels")
      .data(data)
      .join("g")
      .append("text")
      .datum((d) => {
        return { name: d.name, value: d.values[d.values.length - 1] };
      }) // keep only the last value of each time series
      .attr(
        "transform",
        (d) => `translate(${x(d.value.date)},${y(d.value.count)})`
      ) // Put the text at the position of the last point
      .attr("x", 12) // shift the text a bit more right
      .attr("class", function (d) {
        return makeKey(d.name);
      })
      .text((d) => d.name)
      .style("fill", (d) => colors(d.name))
      .style("font-size", 15)
      .style("opacity", (d) =>
        [...currentFoods, ...currentGroups, currentSymptom].includes(d.name)
          ? 1
          : 0
      );

    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -height / 4)
      .text("Number of occurences per month");

    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .text("Months");

    const updateAxis = ({ target }) => {
      let newStartDate = new Date(dateRange[1]);
      newStartDate.setMonth(newStartDate.getMonth() - target.value);

      const newRange = [newStartDate, dateRange[1]];

      x.domain(newRange);

      xAxis.transition().duration(500).call(d3.axisBottom(x).ticks(6));

      dots
        .data(data)
        .transition()
        .duration(500)
        .attr("cx", function (d) {
          return x(+d.date);
        })
        .attr("cy", function (d) {
          return y(+d.count);
        });

      lines
        .data(data)
        .transition()
        .duration(500)
        .attr("d", (d) => line(d.values));

      setDateRange(newRange);
    };

    d3.selectAll(".slider").on("change", updateAxis);
  }, [allData, currentFoods, currentGroups, currentSymptom]);

  return (
    <Container
      className="glassmorpheus-graph"
      css={{ margin: "2rem 0", maxWidth: "90vw" }}
    >
      {allData && allData.length > 0 && allData[0].symptomData && (
        <Container
          display={"flex"}
          justify="center"
          align="center"
          css={{ margin: "2rem 0" }}
        >
          <HeaderText text="Your Top Associations" />

          {allData && allData.length && allData[0].symptomData && (
            <Container>
              <Row justify="center">
                <ScatterControls
                  symptomList={allData.map(
                    ({ symptomData }) => symptomData.name
                  )}
                  toggleSymptom={toggleSymptom}
                  maxMonths={maxMonths}
                  currentSymptom={currentSymptom}
                />
              </Row>
              <Row justify="center" align="center">
                <Button.Group vertical bordered>
                  {legend?.slice(1).map(({ name, color }, i) => {
                    return (
                      <>
                        <Row justify="flex-end">
                          <Text css={{ color: color }}>{name}</Text>
                          <Spacer x={0.5} />
                          <Switch
                            key={i}
                            className="legendSwitch"
                            size="md"
                            bordered
                            checked={[
                              ...currentFoods,
                              ...currentGroups,
                            ].includes(name)}
                            onChange={() => toggleLine(name)}
                          />
                        </Row>
                        <Spacer y={0.7} />
                      </>
                    );
                  })}
                </Button.Group>

                <svg
                  ref={svgRef}
                  style={{ margin: "90px", marginRight: "5rem" }}
                ></svg>
              </Row>
            </Container>
          )}
        </Container>
      )}
    </Container>
  );
};

export default ScatterPlot;

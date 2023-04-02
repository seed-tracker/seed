import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import * as d3 from "d3";
import ScatterControls from "./ScatterControls";
import { HeaderText } from "../nextUI";
import { Container, Switch, Text, Row, Spacer } from "@nextui-org/react";

const ScatterPlot = () => {
  const { data: chartData, maxMonths } = useSelector((state) => state.scatter);
  const { data: corrData } = useSelector((state) => state.correlations);
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
  const areaGradient = useRef();

  useEffect(() => {
    if (chartData && chartData.length && corrData && corrData.length) {
      formatData();
    }
  }, [chartData]);

  const formatData = () => {
    const formattedData = chartData.map((d) => {
      const ranked = corrData.find((corr) => corr.symptom == d["symptom"]);
      return {
        symptomData: {
          name: d["symptom"],
          values: d["symptom_data"].map((month) => ({
            count: month["count"],
            date: createDate(month),
          })),
        },
        foodData: formatFoods(d["top_foods"], ranked.top_foods),
        groupData: formatFoods(d["top_groups"], ranked.top_groups),
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

  const formatFoods = (data, ranked) => {
    if (!ranked) return [];

    return ranked.map(({ name, lift }) => {
      const foundFood = data.find((f) => f["_id"] === name);
      return {
        name,
        lift,
        values: foundFood["months"].map((d) => ({
          count: d["count"],
          date: createDate(d),
        })),
      };
    });
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

    const width = 800;
    const height = 300;

    const svg = d3.select(svgRef.current);
    svg.text("");

    // svg.selectAll("*").remove();

    svg
      // .attr("width", "auto")
      .attr("width", width)
      .attr("height", height);
    // .style("overflow", "visible")
    // .style("margin-top", "3rem");

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

    //areas where linear gradient is applied
    // const area = d3
    //   .area()
    //   .x((d) => x(d.date))
    //   .y0(height)
    //   .y1((d) => y(d.count));

    // const areaGradient = svg
    //   .append("defs")
    //   .append("linearGradient")
    //   .attr("id", "areaGradient")
    //   .attr("x1", "0%")
    //   .attr("y1", "0%")
    //   .attr("x2", "0%")
    //   .attr("y2", "100%");

    // areaGradient
    //   .append("stop")
    //   .attr("offset", "0%")
    //   .attr("stop-color", "red")
    //   .attr("stop-opacity", 0.3)
    //   .attr("gradientTransform", "rotate(-45)");

    // areaGradient
    //   .append("stop")
    //   .attr("offset", "80%")
    //   .attr("stop-color", "white")
    //   .attr("stop-opacity", 0);

    // const areas = svg
    //   .selectAll(".area")
    //   .data(allData)
    //   .join("path")
    //   .attr("class", "area")
    //   .attr("fill", "url(#areaGradient)") //linear gradient being added here--
    //   .attr("d", area(symptomData.values));

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

      setDateRange(newRange);

      // areas
      //   .data(allData)
      //   .join("path")
      //   .transition()
      //   .duration(500)
      //   .attr(
      //     "d",
      //     area(
      //       symptomData.values.filter((symptom) => symptom.date >= newRange[0])
      //     )
      //   );

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
    };

    d3.selectAll('input[type="range"]').on("change", updateAxis);
  }, [allData, currentFoods, currentGroups, currentSymptom]);

  return (
    <Container
      display={"flex"}
      css={{ width: "100%", minHeight: "30rem" }}
      justify="center"
      align="center"
      className="container top-associations"
    >
      {allData && allData.length > 0 && allData[0].symptomData && (
        <>
          <Container
            className="container scatter-controls"
            css={{
              maxWidth: "60%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <HeaderText text="Your Top Associations" />
            <ScatterControls
              symptomList={allData.map(({ symptomData }) => symptomData.name)}
              toggleSymptom={toggleSymptom}
              maxMonths={maxMonths}
              currentSymptom={currentSymptom}
            />
          </Container>
          <Container
            className="svg-container"
            css={{
              position: "relative",
              overflow: "auto",
              "-webkit-overflow-scrolling": "touch",
            }}
          >
            <svg ref={svgRef} viewBox="50 0 700 360"></svg>
          </Container>
          <Container
            className="switches"
            css={{
              margin: "2rem 0",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              "@xs": {
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
              },
              "@sm": {
                textAlign: "left",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: "0.5rem",
              },
              "@md": {
                textAlign: "left",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: "0.5rem",
              },
              "@lg": {
                textAlign: "left",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: "0.5rem",
              },
            }}
          >
            {legend?.slice(1).map(({ name, color }, i) => {
              return (
                <span
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "0.5rem",
                  }}
                  key={i}
                >
                  <Switch
                    color="green"
                    checkedColor="green"
                    key={i}
                    className="legendSwitch"
                    size="sm"
                    bordered
                    checked={[...currentFoods, ...currentGroups].includes(name)}
                    onChange={() => toggleLine(name)}
                  />
                  <Text
                    size={15}
                    css={{
                      color: color,
                      textAlign: "left",
                    }}
                  >
                    {name}
                  </Text>

                  <Spacer x={2.5}></Spacer>
                </span>
              );
            })}
          </Container>
        </>
      )}
    </Container>
  );
};

export default ScatterPlot;

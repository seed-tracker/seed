import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";
import { fetchScatterData } from "../../store/scatterSlice";
import ScatterControls from "./ScatterControls";

const ScatterPlot = () => {
  const dispatch = useDispatch();
  const chartData = useSelector((state) => state.scatter);
  const [allData, setAllData] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [currentFoods, setCurrentFoods] = useState([]);
  const [currentGroups, setCurrentGroups] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    dispatch(fetchScatterData());
  }, [dispatch]);

  useEffect(() => {
    if (chartData.length) {
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
      setCurrentFoods([foodData[0].name]);
      setCurrentGroups([]);
    }

    setDateRange([
      symptomData.values[0].date,
      symptomData.values[symptomData.values.length - 1].date,
    ]);
  };

  const changeTimeRange = ({ target }) => {
    dispatch(fetchScatterData(target.value));
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

  const toggleGroup = (group) => {
    const idx = currentGroups.findIndex((g) => g === group);
    console.log(idx);
    if (idx >= 0) {
      setCurrentGroups([
        ...currentGroups.slice(0, idx),
        ...currentGroups.slice(idx + 1),
      ]);
    } else {
      setCurrentGroups([...currentGroups, group]);
    }
  };

  const toggleFood = (food) => {
    const idx = currentFoods.findIndex((f) => f === food);
    if (idx >= 0) {
      setCurrentFoods([
        ...currentFoods.slice(0, idx),
        ...currentFoods.slice(idx + 1),
      ]);
    } else {
      setCurrentFoods([...currentFoods, food]);
    }
  };

  const toggleSymptom = (symptom) => setCurrentSymptom(symptom);

  // set up container, scaling, axis, labeling, data

  useEffect(() => {
    if (!allData || !allData.length) return;

    const width = 700;
    const height = 300;

    const svg = d3.select(svgRef.current);

    svg.text("");

    svg
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible")
      .style("margin-top", "100px");

    const labels = [currentSymptom, ...currentFoods, ...currentGroups];

    const { symptomData, groupData, foodData } = allData.find(
      ({ symptomData }) => symptomData.name === currentSymptom
    );
    const foods = foodData.filter(({ name }) => currentFoods.includes(name));
    const groups = groupData.filter(({ name }) => currentGroups.includes(name));

    const data = [symptomData, ...foods, ...groups];

    //make a color range
    const colors = d3.scaleOrdinal().domain(labels).range(d3.schemeSet2);

    const x = d3.scaleTime().domain(dateRange).range([0, width]);

    x.ticks(12);

    //generagte x axis, date format
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    //add y axis

    const y = d3.scaleLinear().domain([0, 30]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    //add the lines
    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.count));

    svg
      .selectAll("myLines")
      .data(data)
      .join("path")
      .attr("d", (d) => line(d.values))
      .attr("stroke", (d) => colors(d.name))
      .style("stroke-width", 4)
      .style("fill", "none");

    svg
      .selectAll("myDots")
      .data(data)
      .join("g")
      .style("fill", (d) => colors(d.name))
      .selectAll("myPoints")
      .data((d) => d.values)
      .join("circle")
      .attr("r", 5)
      .attr("stroke", "white");

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
      .text((d) => d.name)
      .style("fill", (d) => colors(d.name))
      .style("font-size", 15);
  }, [allData, currentFoods, currentGroups, currentSymptom]);

  return (
    <>
      <section>
        {allData && allData.length && (
          <ScatterControls
            symptomList={allData.map(({ symptomData }) => symptomData.name)}
            symptomData={allData.find(
              ({ symptomData }) => symptomData.name === currentSymptom
            )}
            toggleFood={toggleFood}
            toggleGroup={toggleGroup}
            toggleSymptom={toggleSymptom}
            changeTimeRange={changeTimeRange}
          />
        )}
      </section>
      <svg ref={svgRef} style={{ margin: "90px" }}></svg>
    </>
  );
};

export default ScatterPlot;

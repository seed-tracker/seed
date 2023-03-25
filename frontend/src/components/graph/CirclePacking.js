import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSymptoms, fetchAllSymptoms } from "../../store/symptomSlice";
import { fetchUserCorrelations, selectUserCorrelations } from "../../store/correlationsSlice";
import * as d3 from "d3";

const CirclePacking = () => {
  const dispatch = useDispatch();
  const datas = useSelector(selectUserCorrelations);
  const symptoms = useSelector(selectSymptoms);
  console.log(datas);

  function getSymptomsAndTopGroups(data) {
    const result = {};

    data.forEach((obj) => {
      const symptom = obj.symptom;
      const topGroups = obj.top_groups?.map((group) => group.name) ?? [];
      const lifts = obj.top_groups?.map((group) => group.lift) ?? [];
      result[symptom] = { topGroups, lifts };
    });

    return result;
  }

  const result = getSymptomsAndTopGroups(datas);

  const userSymptoms = datas.map((obj) => obj.symptom);

  const svgRef = useRef();

  useEffect(() => {
    dispatch(fetchAllSymptoms());
    dispatch(fetchUserCorrelations());
  }, [dispatch]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const pack = (data) => d3.pack()
      .size([width - 2, height - 2])
      .padding(3)

    (d3.hierarchy({ children: data })
      .sum((d) => d.value)
    )

    const colorPalette = d3.schemeCategory10;
    const symptomColors = {};
    for (let i = 0; i < symptoms.length; i++) {
      const symptomName = symptoms[i].name;
      const colorIndex = i % colorPalette.length;
      symptomColors[symptomName] = colorPalette[colorIndex];
    }

    const legend = d3.select("#legend")
    const legendWidth = +legend.attr("width");
    const legendHeight = +legend.attr("height");

    legend.selectAll("circle")
      .data(Object.entries(symptomColors))
      .enter()
      .append("circle")
      .attr("cx", (d, i) => 25 + i * 120)
      .attr("cy", legendHeight / 2)
      .attr("r", 16)
      .attr("fill", (d, i) => d[1]);

    legend.selectAll("text")
      .data(Object.entries(symptomColors))
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", (d, i) => 25 + i * 120)
      .attr("y", (legendHeight / 2) + 50)
      .attr("font-size", "16px")
      .text((d) => d[0]);

    const root = pack(
      userSymptoms.map((d, i) => {
        const symptomName = d;
        const { topGroups, lifts } = result[symptomName];
        const color = symptomColors[symptomName];

        return {
          name: symptomName,
          value: topGroups.length ? topGroups.length : 1,
          color: color,
          children: topGroups.map((d, i) => ({
            name: d,
            value: lifts[i], // use lift value as node value
            color: color,
          })),
        };
      })
    );

    const leaf = svg
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`);

    leaf.append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "crimson")
      .attr("stroke-width", (d) =>
        d.data.value > 1.01 ? 10 + "px" : 5 + "px"
      );

    leaf.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", (d) => "16px")
      .attr("dy", ".35em")
      .text((d) => d.data.name);
  }, [symptoms, userSymptoms, result]);

  return (
    <>
      <svg ref={svgRef} width="400" height="400"></svg>
      <svg id="legend" width="1400px" height="250"></svg>
    </>
  );
};

export default CirclePacking;

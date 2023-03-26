import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSymptoms, fetchAllSymptoms } from "../../store/symptomSlice";
import { fetchUserCorrelations, selectUserCorrelations } from "../../store/correlationsSlice";
import * as d3 from "d3";

const CirclePacking = () => {
  const dispatch = useDispatch();
  const datas = useSelector(selectUserCorrelations);
  const symptoms = useSelector(selectSymptoms);

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
  // console.log(result)

const userSymptoms = datas.map((obj) => obj.symptom);
console.log(userSymptoms)
  const svgRef = useRef();

  useEffect(() => {
    dispatch(fetchAllSymptoms());
    dispatch(fetchUserCorrelations());
  }, [dispatch]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const pack = data => d3.pack()
      .size([width - 2, height - 2])
      .padding(3)
      (d3.hierarchy({ children: data })
        .sum(d => d.value))

    const colorPalette = d3.schemeCategory10;
    const symptomColors = {};
    for (let i = 0; i < symptoms.length; i++) {
      const symptomName = symptoms[i].name;
      const colorIndex = i % colorPalette.length;
      symptomColors[symptomName] = colorPalette[colorIndex];
    }

  const root = pack(userSymptoms.map((d, i) => {
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
}));
    // let g = svg.select("g")
    // if (g.empty()) {
    //   g = svg.append("g")
    // }
    const leaf = svg.selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);
console.log(leaf)
    leaf.append("circle")
      .attr("r", d => d.r)
      .attr("fill", d => d.data.color)
      .attr("stroke", "crimson")
      .attr("stroke-width", d=> d.data.value > 1.01 ? 10+"px" : 5+"px");

    leaf.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", d => "12px")
      .attr("dy", ".35em")
      .text(d => d.data.name);
  }, [symptoms, userSymptoms, result]);

  return <svg ref={svgRef} width="400" height="400"></svg>;
};

export default CirclePacking;

//select,data,join is combo rather than enter, append b/c if you use enter you have to manually update when data changes
//select,data,join auto updates when data changes
//datum is d
//each mark/variable we want to visualize there should a 1:1 to an attribute with an arrow function

// const foodGroups=["Goat", "Fish", "Processed Foods", "Beans,Peas,and Soy","Fruit", "Pork", "Beef", "Milk,Yogurt,and Cheese",
// "Nuts and Seeds", "Vegetables, Starchy", "Grains, Gluten-Free", "Shellfish", "Lamb", "Refined Sugars", "Vegetables, Non-Starchy",
// "Eggs", "Caffeinated Beverages", "Grains, Gluten", "Other  Seafoods", "Poultry"]

// const colors = ['#ffcc00', '#ff6666', '#cc0066', '#66cccc', '#f688bb', '#65587f', '#baf1a1', '#333333', '#75b79e',
// '#66cccc', '#9de3d0', '#f1935c', '#0c7b93', '#eab0d9', '#baf1a1', '#9399ff','#06AED5', '#086788', '#F0C808', '#DD1C1A']
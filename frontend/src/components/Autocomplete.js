import { useState } from "react";
import {useDispatch} from 'react-redux';
// import { autocompleteFood } from "../store/entrySlice";
import apiClient from "../config";

const Autocomplete = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [suggestionsActive, setSuggestionsActive] = useState(false);
  const [value, setValue] = useState("");

//   const dispatch = useDispatch();

  const handleChange = async (e) => {
    const query = e.target.value.toLowerCase();
    setValue(query);
    const {data} = await apiClient.get(`foods/autocomplete?query=${query}`) /* dispatch(autocompleteFood(query)) */
    // console.log("from React",data)
    //* map data so it's just an array of strings food names. No objects.
    const suggestionArray = data?.map((object) => object.name)
    // console.log(suggestionArray)
    /* ["Lamb or mutton loaf", ow, woetewg,] */
    if (query.length > 1) {
      const filterSuggestions = suggestionArray?.filter(
        (suggestion) => suggestion.indexOf(query) > -1
      );
      setSuggestions(filterSuggestions);
      setSuggestionsActive(true);
    } else {
      setSuggestionsActive(false);
    }
  };

  const handleClick = (e) => {
    setSuggestions([]);
    setValue(e.target.innerText);
    setSuggestionsActive(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      if (suggestionIndex - 1 === suggestions.length) {
        return;
      }
      setSuggestionIndex(suggestionIndex + 1);
    } else if (e.key === "ArrowUp") {
      if (suggestionIndex === 0) {
        return;
      }
      setSuggestionIndex(suggestionIndex - 1);
    } else if (e.key === "Enter") {
        console.log("judybooty",suggestions[suggestionIndex])
      setValue(suggestions[suggestionIndex]);
      setSuggestionIndex(0);
      setSuggestionsActive(false);
    }
  };

//   const Suggestions = () => {
//     return (
//       <ul className="suggestions">
//         {suggestions.map((suggestion, index) => {
//           return (
//             <li
//               className={index === suggestionIndex ? "active" : ""}
//               key={index}
//               onClick={handleClick}
//             >
//               {suggestion}
//             </li>
//           );
//         })}
//       </ul>
//     );
//   };

  return (
    <div className="autocomplete">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {suggestionsActive && (
      <ul className="suggestions">
        {suggestions.map((suggestion, index) => {
          return (
            <li
            // TODO: CSS this class
              className={index === suggestionIndex ? "active" : ""}
              key={index}
              onClick={handleClick}
            >
              {suggestion}
            </li>
          );
        })}
      </ul>
    )}
    </div>
  );
};

export default Autocomplete;


import React from "react";
import { Link } from "react-router-dom";

/**
 * Component for the sidebar
 * @component shows a sidebar that shows users different links
 */
const Sidebar = () => {
  return (
    <aside>
      <Link to="/user/edit-profile">Edit Profile</Link>
      <Link to="/add/symptom">Add Symptom Entry</Link>
      <Link to="/user/addFood">Add Food Entry</Link>
      <Link to="/user/symptom-entries">Past Symptom Entries</Link>
      <Link to="/user/meal-entries">Past Meal Entries</Link>
    </aside>
  );
};

export default Sidebar;

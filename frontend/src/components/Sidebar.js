import React from "react";
import { Link } from "react-router-dom";

/**
 * Component for the sidebar
 * @component shows a sidebar that shows users different links
 */
const Sidebar = () => {
  return (
    <aside>
      <Link to="/user/editProfile">Edit Profile</Link>
      <Link to="/user/entries">All Entries</Link>
      <Link to="/add/symptom">Add Symptom Entry</Link>
      <Link to="/user/addFood">Add Food Entry</Link>
    </aside>
  );
};

export default Sidebar;

import { File } from "lucide-react";
import React, { useContext } from "react";
import { DataContext } from "../store/DataContext";
import "./Header.css"; // Assuming this is the path to your CSS file

function Header() {
  const context = useContext(DataContext);
  if (!context) {
    return <div>Loading...</div>;
  }
  const { selectComponent } = context;

  return (
    <div className="header-container">
      <div className="header-top">
        <File size={35} />
        <span className="header-title">Assignment Creation</span>
      </div>
      <div className="header-tabs">
        <button
          className={`header-tab ${selectComponent === "/assignment" ? "active-tab" : ""}`}
        >
          Assessments
        </button>
        <button className="header-tab">Settings</button>
      </div>
    </div>
  );
}

export default Header;

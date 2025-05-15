import React, { useContext } from "react";
import { FileText } from "lucide-react";
import { DataContext } from "../store/DataContext";
import "./Header.css"; // Import the CSS file

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const assignment = JSON.parse(
    localStorage.getItem("assessmentDetails") || "{}"
  );

  const context = useContext(DataContext);
  if (!context) {
    return <div>Loading...</div>;
  }

  const { selectComponent } = context;

  return (
    <header className="header">
      {/* Top Row */}
      <div className="plan-header-top">
        <FileText size={28} className="header-icon" />
        <h1 className="header-title">Plan Creation {assignment?.id ?? ""}</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        {selectComponent === "/plans" || selectComponent === "AllPlans" ? (
          <button
            className={`tab-button ${
              selectComponent === "/plans" ? "active" : ""
            }`}
          >
            Plan Creator
          </button>
        ) : (
          <button
            className={`tab-button ${
              selectComponent === "planCreation" ? "active" : ""
            }`}
          >
            View Plans
          </button>
        )}

        <button
          className={`tab-button ${
            selectComponent === "AllPlans" ? "active" : ""
          }`}
        >
          All Plans
        </button>
      </div>
    </header>
  );
};

export default Header;

import { FileText } from "lucide-react";
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
    <div className="header-con">
      <div className="header-t">
        <FileText size={35} className="text-gray-800" />
        <span className="header-titl">Assesment Creation</span>
      </div>
      <div className="header-tabs-ass">
        <button
          className={`text-[20px] font-medium ${selectComponent === "/assignment" || selectComponent === "AssessmentCreationPage2" || selectComponent === 'dashboard' ? "border-b-4 border-black" : ""}`}
        >
          Assessments
        </button>
        <button className="header-taab">Settings</button>
      </div>
    </div>
  );
}

export default Header;

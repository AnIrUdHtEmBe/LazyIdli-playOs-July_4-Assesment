import { File, FileText } from "lucide-react";
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
        <FileText size={35} />
        <span className="header-title">{selectComponent === "/sessions" ? "Session Creation" : "All Sessions"}</span>
      </div>
      <div className="header-tabs">
        <button
          className={`text-xl font-medium ${ selectComponent === "/sessions" ? "border-b-3 " : ""}`}
        >
          Session Creator
        </button>
        <button className={`text-xl font-medium ${ selectComponent === "AllSessions" ? "border-b-3 " : ""}`}>All Sessions</button>
      </div>
    </div>
  );
}

export default Header;

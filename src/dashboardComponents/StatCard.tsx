import React from "react";
import "./StatCard.css"; // Make sure to create this CSS file

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "blue" | "purple" | "green" | "yellow" | "red";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div>
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
        </div>
        <div className={`stat-icon ${color}-theme`}>{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;

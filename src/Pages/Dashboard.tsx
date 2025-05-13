import React, { useContext } from "react";
import CustomerTable from "../dashboardComponents/CustomerTable";
import { DataContext } from "../store/DataContext";
import Header from "../dashboardComponents/Header";
import "./Dashboard.css";


const Dashboard: React.FC = () => {
  const context = useContext(DataContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { customers } = context;

  const assessmentDue = customers.filter((c) => c.lastAssessed === "-").length;
  const totalCustomers = customers.length;
  const totalMembers = customers.filter(
    (c) => c.membership !== "-" && c.membership.trim() !== ""
  ).length;

  return (
    <div className="dashboard">
      <Header />
      
      {/* Table Section */}
      <div className="table-section">
        <CustomerTable />
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card first-card">
          <span className="stat-value">{assessmentDue}</span>
          <div className="stat-label">Assessment Due</div>
        </div>

        <div className="stat-card">
          <span className="stat-value">{totalCustomers}</span>
          <div className="stat-label">Total Customers</div>
        </div>

        <div className="stat-card">
          <span className="stat-value">{totalMembers}</span>
          <div className="stat-label">Total Members</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

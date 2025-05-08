import React, { useContext, useState } from "react";
import { Users, FileCheck, UserCheck } from "lucide-react";
import StatCard from "../dashboardComponents/StatCard";
import CustomerTable from "../dashboardComponents/CustomerTable";
import { DataContext } from "../store/DataContext";
import Header from "../dashboardComponents/Header";
// import Assessment from './Assessment';

const Dashboard: React.FC = () => {
  const context = useContext(DataContext);

  if (!context) {
    return <div>Loading...</div>; // Or handle context not available
  }

  const { customers } = context;

  const assessmentDue = customers.filter((c) => c.lastAssessed === "-").length;
  const totalCustomers = customers.length;
  const totalMembers = customers.filter(
    (c) => c.membership !== "-" && c.membership.trim() !== ""
  ).length;

  return (
    <div className="space-y-6 min-h-screen bg-gray-50">
      <div>
        <Header></Header>
      </div>
      {/* Table Section */}
      <div
        className="bg-white shadow-sm overflow-hidden rounded-lg"
        style={{ height: "65vh" }}
      >
        <CustomerTable />
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-lg p-6 shadow-md flex justify-around">
        <div className="flex flex-col items-center justify-between mb-4">
          <span className="text-gray-900 font-semibold text-4xl">{assessmentDue}</span>
          <div className="flex items-center gap-3">
            <FileCheck size={24} className="text-blue-500" />
            <span className="text-gray-700 font-medium">Assessment Due:</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between mb-4">
          <span className="text-gray-900 font-semibold text-4xl">{totalCustomers}</span>
          <div className="flex items-center gap-3">
            <Users size={24} className="text-purple-500" />
            <span className="text-gray-700 font-medium">Total Customers:</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between mb-4">
          <span className="text-gray-900 font-semibold text-4xl">{totalMembers}</span>
          <div className="flex items-center gap-3">
            <UserCheck size={24} className="text-green-500" />
            <span className="text-gray-700 font-medium">Total Members:</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

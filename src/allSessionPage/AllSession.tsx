import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../store/DataContext";
import { LucideCircleMinus, Plus } from "lucide-react";

function AllSession() {
  const context = useContext(DataContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { sessions, setSessions } = context;
  const [selecteddPlan, setSelectedPlan] = useState<any>(null);
  const [planName, setPlanName] = useState<string>(selecteddPlan?.sessionName || "");
  const [category, setCategory] = useState<string>(selecteddPlan?.sessionType || "Fitness");

  useEffect(() => {
    if (selecteddPlan) {
      setPlanName(selecteddPlan.sessionName || "");
      setCategory(selecteddPlan.sessionType || "Fitness");
    }
  }, [selecteddPlan]);

  return (
    <div className="bg-gray-100 w-full min-h-screen p-5 flex flex-col lg:flex-row gap-4">
      {/* Left Panel */}
      <div className="w-full lg:w-2/5 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center p-5 border-b">
          <div className="text-2xl font-medium">
            Sessions{" "}
            <span className="bg-blue-100 text-blue-800 text-sm rounded-lg px-2">
              All
            </span>
          </div>
          <button className="flex items-center border-2 px-3 py-2 rounded-lg border-blue-600">
            <Plus size={20} className="text-blue-600" />
            <span className="text-blue-600 ml-2 text-base">New</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 text-sm">
                {["Sl.No", "Session Name", "Category"].map((item, index) => (
                  <th key={index} className="p-4">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr
                  key={index}
                  onClick={() => setSelectedPlan(session)}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  <td className="p-4 border-b">{index + 1}</td>
                  <td className="p-4 border-b">{session.sessionName}</td>
                  <td className="p-4 border-b">{session.sessionType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-md flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 border-b gap-4">
          {/* Input Fields */}
          <div className="flex flex-col md:flex-row gap-5 w-full md:w-2/3">
            <div className="flex flex-col w-full">
              <label className="text-sm mb-1">Session Name</label>
              <input
                type="text"
                className="border-b-2 text-lg text-black font-mono focus:outline-none"
                placeholder="Session name"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm mb-1">Category</label>
              <select
                className="border-b-2 text-lg focus:outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value={category}>{category}</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <button className="bg-blue-700 text-white px-4 py-2 rounded-md mt-4 md:mt-0">
            Save Changes
          </button>
        </div>

        {/* Activities Table */}
        <div className="overflow-x-auto flex-1">
          {selecteddPlan ? (
            <table className="w-full table-auto">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-left text-gray-700 text-base">
                  {["ID", "Activity", "Description", "Time (mins)", ""].map((item, index) => (
                    <th key={index} className="px-4 py-4 border-b">{item}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selecteddPlan?.activities?.map((item, index) => (
                  <tr key={item.id} className="text-sm hover:bg-gray-50">
                    <td className="px-4 py-4 border-b font-bold">{item.id}</td>
                    <td className="px-4 py-4 border-b">
                      <select className="border px-2 py-2 rounded w-full max-w-xs focus:outline-blue-500">
                        {item.activityType.map((activity) => (
                          <option key={activity.id} value={activity.activityType}>
                            {activity.activityType}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 border-b">{item.description}</td>
                    <td className="px-4 py-4 border-b">{item.timeInMinutes}</td>
                    <td className="px-4 py-4 border-b">
                      <button>
                        <LucideCircleMinus className="text-red-400" size={24} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} className="p-4">
                    <button className="bg-blue-700 text-white flex items-center gap-2 px-3 py-2 rounded-md">
                      <Plus size={18} />
                      <span>Add Activity to Session</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Select a session to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllSession;

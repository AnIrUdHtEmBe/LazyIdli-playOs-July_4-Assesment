import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../store/DataContext";
import { LucideEye, LucideTrash2, Plus, Dumbbell } from "lucide-react"; // Replace with actual Lucide icons
import Header from "../planPageComponent/Header"

function AllPlans() {
  const context = useContext(DataContext);

  if (!context) return <div>Loading...</div>;

  const { sessions, setSessions } = context;
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const toggleSelect = (index: number) => {
    setSelectedSessions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredSessions =
    filterCategory === "All"
      ? sessions
      : sessions.filter((s) => s.sessionType === filterCategory);

  return (
    <div className="flex flex-col ">
      <div>
        <Header />
      </div>

      <div className="flex p-5 space-x-8">
        <div className="bg-white w-1/2 shadow-lg p-5">
          <div className="bg-white rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b">
              <div className="font-normal text-3xl">
                Plans{" "}
                <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-lg">
                  All
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {/* Icons for filtering */}

                {/* Delete and New buttons */}
                <button className="text-red-500">
                  <LucideTrash2 size={50} className="border-2 border-gray-300 p-2 rounded-xl"/>
                </button>
                <button className="flex items-center space-x-1 border-2 px-4 py-2 rounded-lg border-blue-600">
                  <Plus size={30} className="text-blue-600" />
                  <span className="text-blue-600 text-xl">New Plan</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <table className="w-full table-auto border-collapse text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="p-4 border">
                    {" "}
                    {/* master checkbox placeholder */}
                    <input type="checkbox" disabled />
                  </th>
                  <th className="p-4 border">Session Name</th>
                  <th className="p-4 border">TimePeriod</th>
                  <th className="p-4 border">Preview</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 border">
                      <input
                        type="checkbox"
                        checked={selectedSessions.includes(index)}
                        onChange={() => toggleSelect(index)}
                      />
                    </td>
                    <td className="p-4 border">{session.sessionName}</td>
                    <td className="p-4 border">{session.sessionType}</td>
                    <td className="p-4 border">
                      <LucideEye className="text-gray-600 cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white w-1/2 h-full shadow-lg p-5">
          <div className="bg-white rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b">
              <div className="font-normal text-3xl">
                Sessions{" "}
                <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-lg">
                  All
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {/* Icons for filtering */}
                <button onClick={() => setFilterCategory("Fitness")}>
                  <Dumbbell />
                </button>
                <button onClick={() => setFilterCategory("Wellness")}>
                  🧘🏻‍♂️
                </button>
                <button onClick={() => setFilterCategory("Sports")}>🏃🏻</button>
                <button
                  onClick={() => setFilterCategory("All")}
                  className="text-sm border px-2 py-1 rounded-md"
                >
                  All
                </button>

                {/* Delete and New buttons */}
                <button className="text-red-500">
                  <LucideTrash2 />
                </button>
                <button className="flex items-center space-x-1 border-2 px-4 py-2 rounded-lg border-blue-600">
                  <Plus size={20} className="text-blue-600" />
                  <span className="text-blue-600 text-sm">New</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <table className="w-full table-auto border-collapse text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="p-4 border">
                    {" "}
                    {/* master checkbox placeholder */}
                    <input type="checkbox" disabled />
                  </th>
                  <th className="p-4 border">Session Name</th>
                  <th className="p-4 border">Category</th>
                  <th className="p-4 border">Preview</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 border">
                      <input
                        type="checkbox"
                        checked={selectedSessions.includes(index)}
                        onChange={() => toggleSelect(index)}
                      />
                    </td>
                    <td className="p-4 border">{session.sessionName}</td>
                    <td className="p-4 border">{session.sessionType}</td>
                    <td className="p-4 border">
                      <LucideEye className="text-gray-600 cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllPlans;

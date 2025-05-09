import React, { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../store/DataContext";
import {
  ChevronRight,
  Dumbbell,
  EyeClosed,
  EyeIcon,
  Plus,
  Trash2,
} from "lucide-react";
import "./SessionPage.css"; // Import the CSS file

import { Mediation, NordicWalking } from "@mui/icons-material";
import Header from "../planPageComponent/Header";

function SessionPage() {
  const { sessions, setSessions , setSelectComponent } = useContext(DataContext)!;
  const [planName, setPlanName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  console.log(sessions);
  // grid and checked cell interaction
  const [activePlan, setActivePlan] = useState(null);
  const [gridAssignments, setGridAssignments] = useState<{
    [key: number]: any;
  }>({});

  const filteredPlans = sessions.filter(
    (plan) =>
      plan.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.sessionType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filterPlansAccordingTo = (category: string) => {
    setSearchTerm(category);
  };

  const isAllSelected =
    filteredPlans.length > 0 && selectedIds.length === filteredPlans.length;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate =
        selectedIds.length > 0 && selectedIds.length < filteredPlans.length;
    }
  }, [selectedIds, filteredPlans.length]);

  const toggleSelectAll = () => {
    // setSelectedIds(isAllSelected ? [] : filteredPlans.map((p) => p.id));

    if (isAllSelected) {
      setSelectedIds([]);
      setActivePlan(null);
    } else {
      setSelectedIds(filteredPlans.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) => {
      const newSelected = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      console.log(newSelected);
      // setting active plan for the communication of grid and colums
      if (newSelected.length === 1) {
        const plan = sessions.find((p) => p.id === newSelected[0]);
        setActivePlan(plan || null);
      } else {
        setActivePlan(null);
      }
      return newSelected;
    });
  };

  const handleGridCellClick = (index: number) => {
    if (!activePlan) return; // If no plan is selected, do nothing

    setGridAssignments((prev) => ({
      ...prev,
      [index]: activePlan,
    }));
  };

  const handleDelete = () => {
    setSessions((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
  };

  const [len, setLen] = useState(30);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewSession, setPreviewSession] = useState<any>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const handlePreviewClick = (session: any) => {
    setPreviewSession(session);
    setPreviewModalOpen(true);
    setSelectedSession(session);

    console.log("Previewing session:", session);
  };

  return (
    <div className="responses-root">
      <div className="sticky-header">
        <Header />
      </div>

      <div className="main-container ">
        {/* Left Panel: Plans Table */}
        <div className="left-panel">
          {/* Top Bar */}
          <div className="top-bar">
            <input
              className="border-2 border-gray-300 px-2 py-1 rounded-md"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by plan name or category"
            />

            <div className="button-group">
              <button className="border-2 border-gray-300 px-2 py-1 rounded-md">
                <Dumbbell
                  size={30}
                  onClick={() => filterPlansAccordingTo("Fitness")}
                />
              </button>
              <button className="border-2 border-gray-300 px-2 py-1 rounded-md">
                <Mediation
                  style={{ fontSize: "30px" }}
                  onClick={() => filterPlansAccordingTo("Wellness")}
                />
              </button>
              <button className="border-2 border-gray-300 px-2 py-1 rounded-md">
                <NordicWalking
                  style={{ fontSize: "30px" }}
                  onClick={() => filterPlansAccordingTo("Sports")}
                />
              </button>
            </div>

            <button
              className="border-2 border-gray-300 px-2 py-1 rounded-md"
              onClick={handleDelete}
              disabled={selectedIds.length === 0}
            >
              <Trash2 size={30} className="text-red-500" />
            </button>
            <button className="new-button">
              <Plus size={30} />
              <span>NEW</span>
            </button>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="plans-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      ref={checkboxRef}
                      onChange={toggleSelectAll}
                      checked={isAllSelected}
                    />
                  </th>
                  <th>Sl No</th>
                  <th>Plan Name</th>
                  <th>Category</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan, idx) => (
                  <tr key={plan.id} className="table-row">
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(plan.id)}
                        onChange={() => toggleSelectOne(plan.id)}
                      />
                    </td>
                    <td>{idx + 1}</td>
                    <td>{plan.sessionName}</td>
                    <td>{plan.sessionType}</td>
                    <td>
                      <button onClick={() => handlePreviewClick(plan)}>
                        <EyeIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Plan Details & Calendar */}
        <div className="right-panel">
          <div className="plan-details">
            {/* Plan Name Input */}
            <div className="plan-name-input">
              <label htmlFor="planName">Plan Name</label>
              <input
                type="text"
                id="planName"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="Enter plan name"
              />
            </div>

            {/* Calendar */}
            <div className="calendar">
              <div className="calendar-header">
                <h2>My Personalised Plan</h2>
              </div>

              <div className="calendar-grid">
                {Array.from({ length: Math.ceil(len / 7) }, (_, weekIndex) => (
                  <React.Fragment key={weekIndex}>
                    <div className="week Label"> Week {weekIndex + 1}</div>
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const index = weekIndex * 7 + dayIndex;
                      const assignedPlan = gridAssignments[index];

                      return index < len ? (
                        <div
                          key={index}
                          className={`calendar-cell ${
                            activePlan && !(selectedIds.length > 1)
                              ? "clickable"
                              : ""
                          } ${selectedIds.length > 1 ? "disabled" : ""}`}
                          onClick={() => {
                            if (!(selectedIds.length > 1)) {
                              handleGridCellClick(index);
                            }
                          }}
                        >
                          {assignedPlan ? (
                            <div className="assigned-plan">
                              <strong>{assignedPlan.sessionName}</strong>
                              <div className="small">
                                {assignedPlan.sessionType}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div
                          key={`empty-${index}`}
                          className="calendar-cell empty"
                        >
                          {" "}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <div className="confirm-button">
              <button
                className="bg-white text-blue-700 border-2 border-blue-700 rounded-md px-4 py-2"
                onClick={() => setLen(len + 7)}
              >
                <span>Add Week</span>
                <Plus size={20} />
              </button>
              <button onClick={() => setSelectComponent("AllPlans")}>
                <span>Confirm</span>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {previewModalOpen && previewSession && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50"
          onClick={() => setPreviewModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-end mb-6">
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setPreviewModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter session name"
              />
              <select className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Fitness</option>
              </select>
            </div>

            {/* Activity Table */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full border border-gray-200 rounded-md text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Sl No</th>
                    <th className="px-4 py-2 text-left">Activity</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Time/Reps</th>
                  </tr>
                </thead>
                <tbody>
                  {previewSession.activities.map(
                    (activity: any, idx: number) => (
                      <tr key={idx} className="border-t border-gray-200">
                        <td className="px-4 py-2">{idx + 1}</td>
                        <td className="px-4 py-2">
                          <select className="border border-gray-300 rounded-md px-2 py-1">
                            {activity.activityType.map(
                              (item: any, index: number) => (
                                <option key={index} value={item}>
                                  {item.activityType}
                                </option>
                              )
                            )}
                          </select>
                        </td>
                        <td className="px-4 py-2">{activity.description}</td>
                        <td className="px-4 py-2">{activity.timeInMinutes}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionPage;

import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { Activity_Api_call, DataContext, Plan_Api_call, Session_Api_call } from "../store/DataContext";
import {
  ArrowRight,
  ChevronRight,
  CirclePlus,
  Dumbbell,
  EyeClosed,
  EyeIcon,
  LucideCircleMinus,
  MinusCircle,
  Plus,
  Trash2,
} from "lucide-react";
import "./SessionPage.css"; // Import the CSS file

import {
  ArrowRightAlt,
  DashboardCustomize,
  Mediation,
  NordicWalking,
} from "@mui/icons-material";
import Header from "../planPageComponent/Header";
import { useApiCalls } from "../store/axios";

function SessionPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { sessions, setSessions, setSelectComponent, selectComponent , sessions_api_call , activities_api_call , setSessions_api_call} =
    useContext(DataContext)!;
  const [planName, setPlanName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const {getSessions, getActivities , createPlan} = useApiCalls();
  useEffect(() => {
    getSessions();
    getActivities();
  }, []);

  const convertGridAssignmentsToSessions = () => {
    const sessions = Object.entries(gridAssignments).map(
      ([scheduledDayStr, session]) => ({
        sessionId: session.sessionId,
        scheduledDay: Number(scheduledDayStr),
      })
    );
  
    return sessions;
  };
  

  
  console.log(sessions_api_call);
  // grid and checked cell interaction
  const [activePlan, setActivePlan] = useState<Session_Api_call | null>(null);
  const [gridAssignments, setGridAssignments] = useState<{
    [key: number]: any;
  }>({});

  const filteredPlans = sessions_api_call.filter(
    (plan) =>
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filterPlansAccordingTo = (category: string) => {
    if (activeFilter === category) {
      setActiveFilter(null); // Remove filter if clicked again
      setSearchTerm(""); // Show all
    } else {
      setActiveFilter(category);
      setSearchTerm(category);
    }
  };

  const isAllSelected =
    filteredPlans.length > 0 && selectedIds.length === filteredPlans.length;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate =
        selectedIds.length > 0 && selectedIds.length < filteredPlans.length;
    }
  }, [selectedIds, filteredPlans.length]);

  
  const createANewPlan = () => {
    const planToSubmit: Plan_Api_call = {
      title: planName,
      description: "",
      category: "Fitness",
      sessions: convertGridAssignmentsToSessions(),
    };
    createPlan(planToSubmit);
  }
  const toggleSelectAll = () => {
    // setSelectedIds(isAllSelected ? [] : filteredPlans.map((p) => p.id));

    if (isAllSelected) {
      setSelectedIds([]);
      setActivePlan(null);
    } else {
      setSelectedIds(filteredPlans.map((p) => p.sessionId));
    }
  };

  useEffect(() => {
    console.log("gridAssignments", gridAssignments);
  }, [gridAssignments])

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const newSelected = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      console.log(newSelected);
      // setting active plan for the communication of grid and colums
      if (newSelected.length === 1) {
        const plan = sessions_api_call.find((p) => p.sessionId === newSelected[0]);
        console.log(plan);
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
    setSessions_api_call((prev) => prev.filter((p) => !selectedIds.includes(p.sessionId)));
    setSelectedIds([]);
  };

  const [len, setLen] = useState(30);
  const [weeks, setWeeks] = useState([0, 1, 2, 3]); // represents 4 weeks initially

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewSession, setPreviewSession] = useState<any>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);

 const handleRemoveWeek = (weekNumberToRemove: number) => {
  // Step 1: Remove the actual week number
  setWeeks((prevWeeks) => {
    const filtered = prevWeeks.filter((w) => w !== weekNumberToRemove);
    // Also reindex all week numbers after the removed one (to shift them down)
    const updatedWeeks = filtered.map((w) => (w > weekNumberToRemove ? w - 1 : w));
    return updatedWeeks;
  });

  // Step 2: Rebuild gridAssignments
  setGridAssignments((prevAssignments) => {
    const updatedAssignments: typeof gridAssignments = {};

    Object.entries(prevAssignments).forEach(([keyStr, value]) => {
      const key = parseInt(keyStr, 10);
      const currentWeek = Math.floor(key / 7);
      const day = key % 7;

      if (currentWeek < weekNumberToRemove) {
        // Keep entries before the deleted week
        updatedAssignments[key] = value;
      } else if (currentWeek > weekNumberToRemove) {
        // Shift down week index by 1 for entries after the deleted week
        const newKey = (currentWeek - 1) * 7 + day;
        updatedAssignments[newKey] = value;
      }
      // Entries of the deleted week are skipped
    });

    return updatedAssignments;
  });
};

const handleClearWeek = (weekNumberToClear: number) => {
  setGridAssignments((prevAssignments) => {
    const updatedAssignments: typeof gridAssignments = { ...prevAssignments };

    // A week has 7 days, so delete keys from weekNumberToClear * 7 to weekNumberToClear * 7 + 6
    for (let i = 0; i < 7; i++) {
      const key = weekNumberToClear * 7 + i;
      delete updatedAssignments[key];
    }

    return updatedAssignments;
  });
};

  const handlePreviewClick = (session: Session_Api_call) => {
    
    setPreviewSession(session);
    setPreviewModalOpen(true);
    setSelectedSession(session);

    console.log("Previewing session:", session);
  };

  return (
    <div className="responses-root">
      <Header />

      <div className="main-container ">
        {/* Left Panel: Plans Table */}
        <div className="left-panel">
          {/* Top Bar */}
          <div className="top-bar">
            {selectComponent === "/plans" || selectComponent === "dashboard" ? (
              <div className="flex items-center justify-center gap-1">
                <span className="sessions-text-header">Sessions</span>
                <span className="all-button"> All</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}

            <div className="button-group">
              <button
                className={`filter-btn ${
                  activeFilter === "Fitness" ? "filter-btn-active" : ""
                }`}
                onClick={() => filterPlansAccordingTo("Fitness")}
              >
                <Dumbbell size={20} />
              </button>
              <button
                className={`filter-btn ${
                  activeFilter === "Wellness" ? "filter-btn-active" : ""
                }`}
                onClick={() => filterPlansAccordingTo("Wellness")}
              >
                <Mediation style={{ fontSize: "20px" }} />
              </button>
              <button
                className={`filter-btn ${
                  activeFilter === "Sports" ? "filter-btn-active" : ""
                }`}
                onClick={() => filterPlansAccordingTo("Sports")}
              >
                <NordicWalking style={{ fontSize: "20px" }} />
              </button>
            </div>

            <button
              className="border-2 border-gray-300 px-2 py-1 rounded-md"
              onClick={handleDelete}
              disabled={selectedIds.length === 0}
            >
              <Trash2 size={20} className="text-red-500" />
            </button>
            <button className="new-button">
              <Plus size={20} />
              <span>New</span>
            </button>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="plans-table">
              <thead>
                <tr>
                  <th className="inp-header">
                    <input
                      type="checkbox"
                      className="session-checkbox"
                      ref={checkboxRef}
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                    />
                  </th>

                  <th className="session-header">Session Name</th>
                  <th className="cat-header">Category</th>
                  <th className="prev-header">Preview</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan, idx) => (
                  <tr key={plan.sessionId} className="table-row">
                    <td>
                      <input
                        type="checkbox"
                        className="session-checkbox"
                        checked={selectedIds.includes(plan.sessionId)}
                        onChange={() => toggleSelectOne(plan.sessionId)}
                      />
                    </td>

                    <td>{plan.title}</td>
                    <td>{plan.category}</td>
                    <td className="p-icon">
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
            <div className=" right-panel-headerr">
              <div className="plan-name-input">
                {/* <label htmlFor="planName">Plan Name</label> */}
                <input
                  type="text"
                  id="planName"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="Plan name "
                  className="placeholder:font-semibold placeholder:text-gray-950"
                />
              </div>

              {selectComponent === "planCreation" ? (
                <div className="right-panel-header-right-side-component">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Select a date"
                      value={selectedDate}
                      onChange={(newDate) => setSelectedDate(newDate)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{
                            height: 50,
                            "& .MuiInputBase-root": {
                              height: 50,
                              boxSizing: "border-box",
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>

                  <button className="holder-right-sode">
                    <DashboardCustomize size={20} className="text-blue-500" />
                    <span className="customise-text">Customize</span>{" "}
                  </button>
                </div>
              ) : null}
            </div>
            {/* Plan Name Input */}

            {/* Calendar */}
            <div className="calendar">
              <div className="calendar-header">
                <h2>My Personalised Plan</h2>
              </div>
              <div className="calendar-grid">
                {weeks.map(( weekIndex) => (
                  <React.Fragment key={weekIndex}>
                    <div className="week Label flex justify-between items-center">
                      <span>Week {weekIndex + 1}</span>
                    </div>
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const index = weekIndex * 7 + dayIndex;
                      const assignedPlan = gridAssignments[index];

                      return (
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
                              console.log("assignedPlan", assignedPlan);
                            }
                          }}
                        >
                          {assignedPlan ? (
                            <div className="assigned-plan">
                              <strong>{assignedPlan.title}</strong>
                              <div className="small">
                                {assignedPlan.category}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                    <button
                      className="flex justify-center items-center"
                      onClick={() => handleRemoveWeek(weekIndex)}
                    >
                      <MinusCircle size={20} className="text-red-500" />
                    </button>
                    <button onClick={() => handleClearWeek(weekIndex)}>Clear Week</button>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <div className="flex px-6 justify-between">
              <button
                className="bg-white text-blue-700 rounded-md px-4 py-2 flex space-x-3"
                onClick={() =>
                  setWeeks((prev) => [
                    ...prev,
                    prev.length > 0 ? Math.max(...prev) + 1 : 0,
                  ])
                }
              >
                <CirclePlus size={25} />
                <span className="text-blue">Add Week</span>
              </button>
              <button
                onClick={ createANewPlan }
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-10"
              >
                <span>Confirm</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {previewModalOpen && previewSession && (
        <div
          className=" fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50"
          onClick={() => setPreviewModalOpen(false)}
        >
          <div className="bg-transparent p-5 relative">
            <button
              className="text-gray-500 hover:text-gray-800 absolute top-2 right-2 bg-white rounded-2xl px-2 py-1 shadow-md z-1"
              onClick={() => setPreviewModalOpen(false)}
            >
              ✕
            </button>
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 relative w-[800px] h-[600px] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Form Inputs */}
              <div className="flex gap-4 mb-6 justify-between">
                <div className="flex gap-6 ">
                  <input
                    type="text"
                    className="w-full border-b border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Session name"
                  />
                  <select className="w-full border-b-1 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Fitness</option>
                  </select>
                </div>
                <button className="save-changes-button">Save changes</button>
              </div>

              {/* Activity Table */}
              <div className="overflow-x-auto">
                <table className="table-auto w-full border border-gray-200 rounded-md text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-center">Sl No</th>
                      <th className="px-4 py-2 text-center">Activity</th>
                      <th className="px-4 py-2 text-center">Description</th>
                      <th className="px-4 py-2 text-center">Time/Reps</th>
                      <th className="px-4 py-2 text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewSession.activities.map(
                      (activity: Activity_Api_call, idx: number) => (
                        <tr key={idx} className="border-t border-gray-200">
                          <td className="px-4 py-2 text-center">{idx + 1}</td>
                          <td className="px-4 py-2 text-center">
                            <FormControl fullWidth size="small">
                              <InputLabel
                                sx={{ width: "200px", display: "inline-block" }}
                                id={`activity-select-label-${idx}`}
                              >
                                Activity
                              </InputLabel>
                              <Select
                                labelId={`activity-select-label-${idx}`}
                                id={`activity-select-${idx}`}
                                value={activity.name|| ""}
                                label="Activity"
                                onChange={(e: SelectChangeEvent) => {
                                  const selectedValue = e.target.value;
                                  setPreviewSession((prev: any) => {
                                    const updatedActivities = [
                                      ...prev.activities,
                                    ];
                                    updatedActivities[idx] = {
                                      ...updatedActivities[idx],
                                      selected: selectedValue,
                                    };
                                    return {
                                      ...prev,
                                      activities: updatedActivities,
                                    };
                                  });
                                }}
                              >
                                {activities_api_call.map((item: Activity_Api_call) => (
                                  <MenuItem key={item.activityId} value={item.name}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </td>
                          <td className="px-4 py-2 text-center">
                            {activity.description}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {activity.reps}
                          </td>
                          <td className="px-4 py-7 border-b border-b-gray-200 text-center">
                            <button
                              onClick={() => {
                                setPreviewSession((prev: any) => {
                                  const updatedActivities =
                                    prev.activities.filter(
                                      (_: any, i: number) => i !== idx
                                    );
                                  return {
                                    ...prev,
                                    activities: updatedActivities,
                                  };
                                });
                              }}
                            >
                              <LucideCircleMinus
                                className="text-red-400 hover:text-red-600"
                                size={24}
                              />
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="flex pt-4 ">
                <button className="bg-white border border-blue-500 text-blue-500 px-6 py-2 cursor-pointer rounded-lg transition duration-200 flex justify-center items-center space-x-2">
                  <Plus size={20} />
                  Add Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionPage;

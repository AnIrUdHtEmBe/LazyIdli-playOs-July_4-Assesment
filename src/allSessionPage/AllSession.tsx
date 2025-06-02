import React, { useContext, useEffect, useState } from "react";
import {
  Activity_Api_call,
  DataContext,
  Session_Api_call,
} from "../store/DataContext";
import { useApiCalls } from "../store/axios";
import {
  Calendar,
  Columns,
  Dumbbell,
  LucideCircleMinus,
  Plus,
  Rows,
} from "lucide-react";
import "./AllSession.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { Mediation, NordicWalking } from "@mui/icons-material";

interface Activity {
  id: string;
  activityType: Array<{
    id: string;
    activityType: string;
  }>;
  description: string;
  timeInMinutes: number;
}

interface Session {
  sessionName: string;
  sessionType: string;
  activities: Activity[];
}

function AllSession() {
  const context = useContext(DataContext);
  const { getSessions, patchSession, getActivities, getActivityById } =
    useApiCalls();
  if (!context) {
    return <div>Loading...</div>;
  }
  const { activities_api_call, sessions, setSessions, sessions_api_call , setSelectComponent} =
    context;
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selecteddPlan, setSelectedPlan] = useState<Session_Api_call | null>(
    null
  );
  const [planName, setPlanName] = useState<string>(selecteddPlan?.title || "");
  const [category, setCategory] = useState<string>(
    selecteddPlan?.category || "Fitness"
  );

  console.log(sessions);
  useEffect(() => {
    getSessions();
  }, []);

  useEffect(() => {
    getActivities();
  }, [selecteddPlan]);

  // const
  useEffect(() => {
    console.log("selected", selecteddPlan);
  }, [selecteddPlan]);

  useEffect(() => {
    if (selecteddPlan) {
      setPlanName(selecteddPlan.title || "");
      setCategory(selecteddPlan.category || "Fitness");
    }
  }, [selecteddPlan]);

  const filteredPlans = sessions_api_call.filter(
    (plan) =>
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async () => {
    try {
      await patchSession(selecteddPlan?.sessionId, {
        title: planName,
        category: category,
        activityIds: selecteddPlan?.activityIds,
      });
      console.log("Session updated successfully");
    } catch (error) {
      console.error("❌ Error updating session:", error);
    }
    getSessions();
  };

  const emptyActivity: Activity_Api_call = {
    activityId: "", // or maybe use `uuid()` if needed
    name: "",
    description: "",
    reps: "",
  };
  const addEmptyActivityRow = () => {
    const updatedActivities = [...selecteddPlan.activities, emptyActivity];
    const updatedActivityIds = [...selecteddPlan.activityIds, ""];

    setSelectedPlan({
      ...selecteddPlan,
      activities: updatedActivities,
      activityIds: updatedActivityIds,
    });
  };

  const filterPlansAccordingTo = (category: string) => {
    if (activeFilter === category) {
      setActiveFilter(null); // Remove filter if clicked again
      setSearchTerm(""); // Show all
    } else {
      setActiveFilter(category);
      setSearchTerm(category);
    }
  };

  let slNo = 1;

  return (
    <div className="all-session-container">
      {/* Left Panel */}
      <div className="left-p">
        <div className="panel-header">
          <div className="header-tit">
            Sessions <span className="badge">All</span>
          </div>
          <div className="flex justify-between items-center gap-5">
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

          <button onClick={() => setSelectComponent("/sessions")}className="new-button">
            <Plus size={20} className="new-button-icon" />
            <span className="new-button-text">New</span>
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header thone">Sl.No</th>
                <th className="table-header thtwo">Session Name</th>
                <th className="table-header ththree">Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map((session, index) => (
                <tr
                  key={index}
                  onClick={() => setSelectedPlan(session)}
                  className="table-row"
                >
                  <td className="table-cell-one">{index + 1}</td>
                  <td className="table-cell-two">{session.title}</td>
                  <td className="table-cell-three">{session.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panell">
        {/* Header */}
        <div className="right-panel-header">
          {/* Input Fields */}
          <div className="input-container">
            <div className="input-group">
              <TextField
                fullWidth
                label="Session name"
                variant="outlined"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>

            <FormControl fullWidth sx={{ width: "200px" }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="FITNESS">Fitness</MenuItem>
                <MenuItem value="SPORTS">Sports</MenuItem>
                <MenuItem value="WELLNESS">Wellness</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Save Button */}
          <button onClick={handleSave} className="save-button">
            Save Changes
          </button>
        </div>

        {/* Activities Table */}
        <div className="table-container">
          {selecteddPlan ? (
            <table className="activities-table">
              <thead className="activities-table-header">
                <tr>
                  <th className="actone">Sl.No</th>
                  <th className="acttwo">Activity</th>
                  <th className="actthree">Description</th>
                  <th className="actfour"> Time/Reps</th>
                </tr>
              </thead>
              <tbody className="activities-table-header">
                {selecteddPlan?.activities?.map(
                  (item: Activity_Api_call, index: number) => (
                    <tr key={index} className="activity-row">
                      <td className="activity-cell font-bold">{slNo++}</td>
                      <td className="activity-cell">
                        <FormControl fullWidth>
                          {/* <InputLabel id={`activity-select-label-${index}`}>
                            Activity
                          </InputLabel> */}
                          <Select
                            labelId={`activity-select-label-${index}`}
                            value={item.activityId}
                            
                            onChange={async (e) => {
                              const selectedId = e.target.value;
                              console.log("Selected ID:", selectedId);

                              try {
                                const edittedActivity = await getActivityById(
                                  selectedId
                                );

                                const updatedActivities = [
                                  ...selecteddPlan.activities,
                                ];
                                updatedActivities[index] = edittedActivity;

                                const updatedActivityIds = [
                                  ...selecteddPlan.activityIds,
                                ];
                                updatedActivityIds[index] =
                                  edittedActivity.activityId;

                                setSelectedPlan({
                                  ...selecteddPlan,
                                  activities: updatedActivities,
                                  activityIds: updatedActivityIds,
                                });

                                console.log("Updated Plan:", updatedActivities);
                              } catch (err) {
                                console.error("Failed to fetch activity:", err);
                              }
                            }}
                          >
                            {activities_api_call.map(
                              (activity: Activity_Api_call, idx: number) => (
                                <MenuItem key={idx} value={activity.activityId}>
                                  {activity.name}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </td>
                      <td className="activity-cell">{item.description}</td>
                      <td className="activity-cell">{item.reps}</td>
                    </tr>
                  )
                )}
                <tr>
                  <td colSpan={5} className="activity-cell">
                    <button
                      onClick={addEmptyActivityRow}
                      className="add-activity-button"
                    >
                      <Plus size={18} />
                      <span>Add Activity</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="empty-state">Select a session to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllSession;

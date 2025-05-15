import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../store/DataContext";
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

  if (!context) {
    return <div>Loading...</div>;
  }

  const { sessions, setSessions } = context;
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selecteddPlan, setSelectedPlan] = useState<Session | null>(null);
  const [planName, setPlanName] = useState<string>(
    selecteddPlan?.sessionName || ""
  );
  const [category, setCategory] = useState<string>(
    selecteddPlan?.sessionType || "Fitness"
  );

  console.log(sessions);

  useEffect(() => {
    if (selecteddPlan) {
      setPlanName(selecteddPlan.sessionName || "");
      setCategory(selecteddPlan.sessionType || "Fitness");
    }
  }, [selecteddPlan]);

  const filteredPlans = sessions.filter(
    (plan) =>
      plan.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.sessionType.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="all-session-container">
      {/* Left Panel */}
      <div className="left-p">
        <div className="panel-header">
          <div className="header-tit">
            Sessions <span className="badge">All</span>
          </div>
          <div className="h-i">
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
            <div className="bg-gray-200 text-gray-200">|</div>
            <Rows></Rows>
            <button>
              <Switch></Switch>
            </button>
            <Calendar></Calendar>
          </div>

          <button className="new-button">
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
                  <td className="table-cell-two">{session.sessionName}</td>
                  <td className="table-cell-three">{session.sessionType}</td>
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
                  <MenuItem value={category}>{category}</MenuItem>
                </Select>
              </FormControl>
            
          </div>

          {/* Save Button */}
          <button className="save-button">Save Changes</button>
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
                  (item: Activity, index: number) => (
                    <tr key={item.id} className="activity-row">
                      <td className="activity-cell font-bold">{item.id}</td>
                      <td className="activity-cell">
                        <select className="activity-select">
                          {item.activityType.map(
                            (activity: {
                              id: string;
                              activityType: string;
                            }) => (
                              <option
                                key={activity.id}
                                value={activity.activityType}
                              >
                                {activity.activityType}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                      <td className="activity-cell">{item.description}</td>
                      <td className="activity-cell">{item.timeInMinutes}</td>
                    </tr>
                  )
                )}
                <tr>
                  <td colSpan={5} className="activity-cell">
                    <button className="add-activity-button">
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

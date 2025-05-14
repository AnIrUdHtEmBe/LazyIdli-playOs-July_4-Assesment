import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../store/DataContext";
import { LucideCircleMinus, Plus } from "lucide-react";
import "./AllSession.css";

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
  const [selecteddPlan, setSelectedPlan] = useState<Session | null>(null);
  const [planName, setPlanName] = useState<string>(
    selecteddPlan?.sessionName || ""
  );
  const [category, setCategory] = useState<string>(
    selecteddPlan?.sessionType || "Fitness"
  );

  useEffect(() => {
    if (selecteddPlan) {
      setPlanName(selecteddPlan.sessionName || "");
      setCategory(selecteddPlan.sessionType || "Fitness");
    }
  }, [selecteddPlan]);

  return (
    <div className="all-session-container">
      {/* Left Panel */}
      <div className="left-p">
        <div className="panel-header">
          <div className="header-tit">
            Sessions <span className="badge">All</span>
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
                <th className="table-cell">
                  Sl.No
                </th>
                <th className="one">
                  Session Name
                </th>
                <th className="table-cell">
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr
                  key={index}
                  onClick={() => setSelectedPlan(session)}
                  className="table-row"
                >
                  <td className="table-cell">{index + 1}</td>
                  <td className="onee">{session.sessionName}</td>
                  <td className="table-cell sess">{session.sessionType}</td>
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
              <label className="input-label">Session Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="Session name"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Category</label>
              <select
                className="select-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value={category}>{category}</option>
              </select>
            </div>
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
                  {["ID", "Activity", "Description", "Time (mins)", ""].map(
                    (item, index) => (
                      <th key={index}>{item}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
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
                      <td className="activity-cell">
                        <button>
                          <LucideCircleMinus
                            className="delete-button"
                            size={24}
                          />
                        </button>
                      </td>
                    </tr>
                  )
                )}
                <tr>
                  <td colSpan={5} className="activity-cell">
                    <button className="add-activity-button">
                      <Plus size={18} />
                      <span>Add Activity to Session</span>
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

import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../store/DataContext";
import { LucideCircleMinus } from "lucide-react";
import "./PagePreview.css"; // Import the CSS file

function PagePreview() {
  const context = useContext(DataContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { sessions, setSessions } = context;
  const [selecteddPlan, setSelectedPlan] = useState<any>(null);
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
    <div className="page-preview">
      <div className="scrollable-table-container">
        <table className="session-table">
          <thead>
            <tr>
              {["ID", "Activity", "Description", "Time (mins)", ""].map(
                (item, index) => (
                  <th key={index}>{item}</th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {selecteddPlan?.activities?.map((item) => (
              <tr key={item.id}>
                <td className="font-black">{item.id}</td>
                <td>
                  <select>
                    {item.activityType.map((activity) => (
                      <option
                        key={activity.id}
                        value={activity.activityType}
                      >
                        {activity.activityType}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{item.description}</td>
                <td>{item.timeInMinutes}</td>
                <td>
                  <button>
                    <LucideCircleMinus className="icon-button" size={30} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PagePreview;

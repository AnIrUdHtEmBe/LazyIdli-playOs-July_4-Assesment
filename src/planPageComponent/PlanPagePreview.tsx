import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../store/DataContext";
import { LucideCircleMinus, Plus, Save } from "lucide-react";

function PagePreview() {
  const context = useContext(DataContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { sessions, setSessions } = context;
  console.log(sessions);

  const [selecteddPlan, setSelectedPlan] = useState<any>(null);
  console.log(selecteddPlan);
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
    <div className="bg-gray-100 shadow-lg p-5 flex space-x-4 ">
      
        {/* Scrollable Table Container */}
        <div className="overflow-y-auto flex-1">
            <table className="w-full table-auto border-collapse">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-left text-gray-700 text-normal">
                  {["ID", "Activity", "Description", "Time (mins)", ""].map(
                    (item, index) => (
                      <th
                        key={index}
                        className="px-4 py-6 text-xl border-b font-medium"
                      >
                        {item}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {selecteddPlan?.activities?.map((item, index) => (
                  <tr
                    key={item.id}
                    className="text-sm text-gray-800 hover:bg-gray-50"
                  >
                    <td className="px-4 py-6 border-b font-black">{item.id}</td>
                    <td className="px-4 py-6 border-b">
                      <select className="border rounded px-2 py-3 w-full max-w-60 focus:outline-blue-500">
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
                    <td className="px-4 py-6 border-b font-semibold">
                      {item.description}
                    </td>
                    <td className="px-4 py-6 border-b font-semibold">
                      {item.timeInMinutes}
                    </td>
                    <td className="px-4 py-6 border-b font-semibold">
                      <button>
                        <LucideCircleMinus className="text-red-400" size={30} />
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

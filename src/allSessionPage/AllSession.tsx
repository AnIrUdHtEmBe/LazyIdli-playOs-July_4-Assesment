import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../store/DataContext";
import { LucideCircleMinus, Plus, Save } from "lucide-react";

function AllSession() {
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
    <div className="bg-gray-100 w-full h-full shadow-lg p-5 flex space-x-4">
      {/* left side pannel */}
      <div className="w-2/5 bg-white rounded-lg">
        <div className="flex justify-between items-center p-5 border-b">
          <div className="font-normal text-3xl">
            Sessions{" "}
            <span className="bg-blue-100 text-blue-800 font-light text-sm rounded-lg px-2">
              All
            </span>
          </div>
          <button className="flex space-x-1 items-center border-2 px-4 py-2 rounded-lg border-blue-600">
            <Plus size={35} className="text-blue-600"></Plus>
            <span className="text-blue-600 text-xl">New</span>
          </button>
        </div>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-600 font-light text-sm">
              {["Sl.No", "Session Name", "Category"].map((item, index) => (
                <th key={index} className="p-4">
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => (
              <tr onClick={() => setSelectedPlan(session)} key={index}>
                <td className="p-4 border-b-1 border-gray-200 font-light">
                  {index + 1}
                </td>
                <td className="p-4 border-b-1 border-gray-200">
                  {session.sessionName}
                </td>
                <td className="p-4 border-b-1 border-gray-200 font-light">
                  {session.sessionType}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* right side pannel  */}
      <div className="bg-white w-3/5 h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b-2 border-gray-300 mb-5">
          {/* Left Side Inputs */}
          <div className="flex justify-between items-end gap-10 w-1/3">
            <div className="flex flex-col">
              <label className="invisible text-sm mb-1">Session</label>
              <input
                type="text"
                className="border-b-2 font-mono text-xl text-black focus:outline-none focus:ring-0"
                placeholder="Session name"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-light mb-1">Category</label>
              <select
                className="font-normal border-b-2 text-xl focus:outline-none focus:ring-0 w-[300px]"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value={category}>{category}</option>
              </select>
            </div>
          </div>

          {/* Right Side Buttons */}
          <div className="flex gap-5">
            <button className="flex justify-between p-1.5 rounded-md items-center space-x-3 bg-blue-700">
              <span className="text-white text-xl p-2">Save Changes</span>
            </button>
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="overflow-y-auto flex-1">
          {selecteddPlan ? (
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
                <tr>
                  <td className="p-3" colSpan={5}>
                    <button className="flex justify-between p-1.5 rounded-md items-center space-x-3 bg-blue-700 text-white">
                      <Plus />
                      <span>Add Activity to Session</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            "mu mai lelo choco"
          )}
        </div>
      </div>
    </div>
  );
}

export default AllSession;

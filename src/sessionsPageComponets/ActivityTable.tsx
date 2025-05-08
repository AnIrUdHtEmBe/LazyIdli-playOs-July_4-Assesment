import { Refresh } from "@mui/icons-material";
import {
  Cross,
  LucideCircleMinus,
  Plus,
  RefreshCcw,
  Save,
  X,
} from "lucide-react";
import React, { useContext, useState } from "react";
import { DataContext } from "../store/DataContext";

function ActivityTable() {
  const context = useContext(DataContext);
  if (!context) {
    return <div>Loading...</div>;
  }

  const {
    selectComponent,
    setSelectComponent,
    activityTypePlan,
    setActivityTypePlan,
  } = context;

  const [planName, setPlanName] = useState<string>("");
  const [category, setCategory] = useState<string>("Fitness");

  const [showModal, setShowModal] = useState(false);
  const [newActivities, setNewActivities] = useState([
    {
      activityType: "",
      description: "",
      timeInMinutes: "",
    },
  ]);

  const handlePlanSaving = () => {
    setSelectComponent("AllSessions");
  };

  const handleActivityAddition = () => {};

  const handleAddNewRow = () => {
    setNewActivities((prev) => [
      ...prev,
      { activityType: "", description: "", timeInMinutes: "" },
    ]);
  };

  
  const handleModalSave = () => {
    const validActivities = newActivities.filter(
      (activity) =>
        activity.activityType.trim() !== "" &&
        activity.description.trim() !== "" &&
        activity.timeInMinutes.trim() !== ""
    );
  
    if (validActivities.length === 0) {
      setShowModal(false);
      return;
    }
  
    const newItems = validActivities.map((activity, index) => ({
      id: activityTypePlan.length + index + 1,
      activityType: [
        {
          id: Date.now() + index,
          activityType: activity.activityType,
        },
      ],
      description: activity.description,
      timeInMinutes: activity.timeInMinutes,
    }));
  
    setActivityTypePlan((prev) => [...prev, ...newItems]);
    setNewActivities([
      {
        activityType: "",
        description: "",
        timeInMinutes: "",
      },
    ]);
    setShowModal(false);
  };
  

  return (
    <div className="bg-white w-full h-screen flex flex-col">
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
              <option value="Fitness">Fitness</option>
            </select>
          </div>
        </div>

        {/* Right Side Buttons */}
        <div className="flex gap-5">
          <button
            className="flex space-x-3 items-center p-1.5 px-3 text-blue-700 border-2 rounded-xl"
            onClick={() => setShowModal(true)}
          >
            <Cross />
            <span>Create new Activity</span>
          </button>
          <div className="items-center p-1.5 flex border border-gray-300 rounded-xl">
            <RefreshCcw size={30} />
          </div>
          <button
            className="flex justify-between p-1.5 rounded-md items-center space-x-3 bg-blue-700"
            onClick={handlePlanSaving}
          >
            <Save size={35} className="text-white" />
            <span className="text-white text-xl">Save</span>
          </button>
        </div>
      </div>

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
            {activityTypePlan.map((item, index) => (
              <tr
                key={item.id}
                className="text-sm text-gray-800 hover:bg-gray-50"
              >
                <td className="px-4 py-6 border-b font-black">{item.id}</td>
                <td className="px-4 py-6 border-b">
                  <select className="border rounded px-2 py-3 w-full max-w-60 focus:outline-blue-500">
                    {item.activityType.map((activity) => (
                      <option key={activity.id} value={activity.activityType}>
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
                <button
                  className="flex justify-between p-1.5 rounded-md items-center space-x-3 bg-blue-700 text-white"
                  onClick={handleActivityAddition}
                >
                  <Plus />
                  <span>Add Activity to Session</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal for Creating New Activity */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 bg-opacity-50">
          <div className="relative bg-white p-8 rounded-xl w-[90%] max-w-screen-lg shadow-lg">
            {/* Close Modal */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-0 right-0 text-gray-500 hover:text-black text-2xl"
              aria-label="Close Modal"
            >
              <X className="bg-white p-1 rounded-full text-black" size={35} />
            </button>

            {/* Modal Header */}
            <div className="flex justify-between mb-4 border-b-2 p-2">
              <h2 className="text-xl font-semibold mb-4">
                Create New Activities
              </h2>
              <button
                onClick={handleModalSave}
                className="px-4 py-2 bg-blue-700 text-white rounded flex space-x-4 p-1 items-center rounded-xl"
              >
                <Save className="text-white" size={20} />
                <span>Save All</span>
              </button>
            </div>

            {/* Activities Table in Modal */}
            <table className="w-full border-b-2">
              <thead>
                <tr className="border-b-2">
                  <th className="px-4 py-2">Sl.No</th>
                  <th className="px-4 py-2">Activity Type</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Time (mins)</th>
                </tr>
              </thead>
              <tbody>
                {newActivities.map((activity, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-center">{index + 1}</td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        placeholder="Activity Type"
                        value={activity.activityType}
                        onChange={(e) => {
                          const updated = [...newActivities];
                          updated[index].activityType = e.target.value;
                          setNewActivities(updated);
                        }}
                        className="w-full border rounded p-2"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        placeholder="Description"
                        value={activity.description}
                        onChange={(e) => {
                          const updated = [...newActivities];
                          updated[index].description = e.target.value;
                          setNewActivities(updated);
                        }}
                        className="w-full border rounded p-2"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        placeholder="Time (in minutes)"
                        value={activity.timeInMinutes}
                        onChange={(e) => {
                          const updated = [...newActivities];
                          updated[index].timeInMinutes = e.target.value;
                          setNewActivities(updated);
                        }}
                        className="w-full border rounded p-2"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add More Activities Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddNewRow}
                className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-xl"
              >
                <Plus />
                <span>Add New</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityTable;

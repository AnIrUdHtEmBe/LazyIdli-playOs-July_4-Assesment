import { Refresh, ReplayOutlined } from "@mui/icons-material";
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
import "./ActivityTable.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

function ActivityTable() {
  const context = useContext(DataContext);
  if (!context) {
    return <div>Loading...</div>;
  }

  const { setSelectComponent, activityTypePlan, setActivityTypePlan } = context;

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

  const handleDelete = (id: number) => {
    const updatedPlan = activityTypePlan.filter((item) => item.id !== id);
    setActivityTypePlan(updatedPlan);
  };

  const [selectedActivities, setSelectedActivities] = useState<{
    [id: number]: string;
  }>({});

  const handleActivitySelectChange = (id: number, value: string) => {
    setSelectedActivities((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="activity-table-container bg-white w-full flex flex-col px-4 md:px-8">
      {/* Header */}
      <div className="flex justify-between items-center py-4">
        <div className="flex w-2xl gap-23">
          <div className="flex flex-col w-full">
            <FormControl fullWidth variant="standard" sx={{ minWidth: 120 }}>
              <TextField
                label="Session Name"
                variant="standard"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                InputProps={{
                  sx: { fontSize: "1.25rem", fontFamily: "Roboto" },
                }}
              />
            </FormControl>
          </div>

          <div className="flex flex-col w-full " style={{ paddingTop: "16px" }}>
            <FormControl fullWidth variant="standard" sx={{ minWidth: 120 }}>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                displayEmpty
                sx={{ fontSize: "1.25rem", fontFamily: "Roboto" }}
              >
                <MenuItem value="Fitness">Fitness</MenuItem>
                {/* You can add more categories here */}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            className="flex items-center space-x-2 p-2  text-sm md:text-base plus-new-actvity"
            onClick={handleActivityAddition}
          >
            <Plus />
            <span>Create New Activity</span>
          </button>
          <div className="p-2 border border-gray-300 rounded-xl">
            <ReplayOutlined></ReplayOutlined>
          </div>
          <button
            className="flex items-center space-x-2 text-white px-4 py-2 rounded-xl text-sm md:text-base btn2 "
            onClick={handlePlanSaving}
          >
            <Save size={20} />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Scrollable Table Container */}
      <div className="overflow-auto flex-1 w-full">
        <div className="min-w-[600px]">
          <table className="w-full table-auto border-collapse">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-left text-gray-700 text-sm md:text-base">
                {["Sl No.", "Activity", "Description", "Time/Reps", ""].map(
                  (item, index) => (
                    <th
                      key={index}
                      className="justify-center font-roberto px-4 py-2 md:py-6 border-b border-b-gray-300 text-center"
                    >
                      {item}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {activityTypePlan.map((item) => (
                <tr
                  key={item.id}
                  className="text-sm text-gray-800 hover:bg-gray-50"
                >
                  <td className="px-4 py-7 border-b border-b-gray-200 text-center">
                    {item.id}
                  </td>

                  <td className="px-4 py-7 border-b border-b-gray-200 text-center">
                    <FormControl sx={{ width: 200 }} size="small">
                      <Select
                        value={selectedActivities[item.id] || ""}
                        onChange={(e) =>
                          handleActivitySelectChange(item.id, e.target.value)
                        }
                        displayEmpty
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              width: 200, // 👈 fixed width for dropdown menu
                            },
                          },
                        }}
                        sx={{
                          backgroundColor: "white",
                          width: 200, // 👈 fixed width for select
                        }}
                      >
                        {item.activityType.map((activity) => (
                          <MenuItem
                            key={activity.id}
                            value={activity.activityType}
                            sx={{ width: "100%" }} // optional, ensures full width of MenuItem
                          >
                            {activity.activityType}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </td>

                  <td className="px-4 py-7 border-b border-b-gray-200 text-center">
                    {item.description}
                  </td>
                  <td className="px-4 py-7 border-b border-b-gray-200 text-center">
                    {item.timeInMinutes}
                  </td>
                  <td className="px-4 py-7 border-b border-b-gray-200 text-center">
                    <button onClick={() => handleDelete(item.id)}>
                      <LucideCircleMinus className="text-red-400" size={24} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="p-3 border-b-gray-300 border-b" colSpan={5}>
                  <button
                    className="space-x-2 px-4 py-2 add-row"
                    onClick={() => setShowModal(true)}
                  >
                    <Plus />
                    <span>Add Row</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 py-8">
          <div className="relative bg-transparent p-5">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 z-10 rounded-full bg-white p-1 text-gray-500 hover:text-black shadow-md"
            >
              <X size={20} />
            </button>

            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative p-6 ">
              {/* Close Button */}

              <div className="flex justify-between items-center border-gray-200 border-b pb-2 mb-4">
                <h2 className="text-xl font-[500]">Create New Activities</h2>
                <button
                  onClick={handleModalSave}
                  className="activity-save-button mx-6 m flex items-center space-x-2 bg-[#0070FF] text-white px-4 py-2 rounded-xl"
                >
                  <Save size={20} />
                  <span>Save</span>
                </button>
              </div>

              {/* Modal Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2">Sl.No</th>
                      <th className="px-4 py-2">Activity Type</th>
                      <th className="px-4 py-2">Description</th>
                      <th className="px-4 py-2">Time/reps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newActivities.map((activity, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-center border-b-2 border-gray-200">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 border-b-2 border-gray-200">
                          <input
                            type="text"
                            value={activity.activityType}
                            onChange={(e) => {
                              const updated = [...newActivities];
                              updated[index].activityType = e.target.value;
                              setNewActivities(updated);
                            }}
                            className="w-full border rounded p-2 border border-gray-400"
                          />
                        </td>
                        <td className="px-4 py-2 border-b-2 border-gray-200">
                          <input
                            type="text"
                            value={activity.description}
                            onChange={(e) => {
                              const updated = [...newActivities];
                              updated[index].description = e.target.value;
                              setNewActivities(updated);
                            }}
                            className="w-full rounded p-2 border border-gray-400"
                          />
                        </td>
                        <td className="px-4 py-2 border-b-2 border-gray-200">
                          <input
                            type="number"
                            value={activity.timeInMinutes}
                            onChange={(e) => {
                              const updated = [...newActivities];
                              updated[index].timeInMinutes = e.target.value;
                              setNewActivities(updated);
                            }}
                            className="w-full border border-gray-400 rounded p-2"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-start">
                <button
                  onClick={handleAddNewRow}
                  className="flex items-center space-x-2 border bg-white text-[#0070FF] px-4 py-2 heya"
                >
                  <Plus />
                  <span>Create another activity</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityTable;

import { Refresh, ReplayOutlined } from "@mui/icons-material";

import {
  Activity,
  Cross,
  LucideCircleMinus,
  Plus,
  RefreshCcw,
  Save,
  X,
} from "lucide-react";
import React, { act, useContext, useEffect, useState } from "react";
import { Activity_Api_call, DataContext, Session_Api_call } from "../store/DataContext";

import "./ActivityTable.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useApiCalls } from "../store/axios";
function ActivityTable() {
  const context = useContext(DataContext);
  if (!context) {
    return <div>Loading...</div>;
  }
  const { getActivities, createActivity , getActivityById , createSession } = useApiCalls();
  useEffect(() => {
    getActivities();
    
  }, []);



  const {
    setSelectComponent,
    activityTypePlan,
    setActivityTypePlan,
    activities_api_call,
    setActivities_api_call,
    
  } = context;

  const [planName, setPlanName] = useState<string>("");
  const [category, setCategory] = useState<string>("Fitness");
  const [activityForTable, setActivityForTable] = useState<Activity_Api_call>();
  const [showModal, setShowModal] = useState(false);
  const [newActivities, setNewActivities] = useState<Activity_Api_call[]>([]);
    const [emptyArr, setEmptyArr] = useState<Activity_Api_call[]>([
  {
    name: "",
    description: "",
    reps: "",
    icon: ""
  }
]);


    useEffect(() => {
    console.log(emptyArr);
    
  }, [emptyArr]);
  const handlePlanSaving = () => {
    setSelectComponent("AllSessions");
  };
  
const handleSessionCreation = async () => {
  const sessionToBeCreated : Session_Api_call = {
    title: planName,
    description: "",
    category: category,
    activitiyIds: emptyArr
      .filter((activity): activity is Activity_Api_call & { activityId: string } => 
        activity.activityId !== undefined)
      .map(activity => activity.activityId),
  }
  await createSession(sessionToBeCreated);
  console.log("Session created successfully");
}


  const handleAddNewRow = () => {
    setNewActivities((prev) => [
      ...prev,
      { activityId: Date.now().toString(), name: "", description: "", reps: "" },
    ]);
  };


const addNewRow = () => {
  setEmptyArr((prev) => [
    ...prev,
    { id: Date.now().toString(), name: "", description: "", reps: "" },
  ]);
};

  const handleModalSave = () => {
    const validActivities = newActivities.filter(
      (activity) =>
        activity.name.trim() !== "" &&
        activity.description.trim() !== "" &&
        activity.reps.trim() !== ""
    );

    if (validActivities.length === 0) {
      setShowModal(false);
      return;
    }

    const newItems = validActivities.map((activity) => ({
      name: activity.name,
      description: activity.description,
      reps: activity.reps,
    }));

     

    const postEachActivity = async () => {
      try {
        await Promise.all(
          newItems.map((item) =>
            createActivity(item)
          )
        );
        console.log("All activities posted successfully.");
      } catch (error) {
        console.error("Error posting some activities:", error);
      }
    };

    postEachActivity();

    setActivities_api_call((prev) => [...prev, ...newItems]);

    setNewActivities([
      {
        name: "",
        description: "",
        reps: "",
      },
    ]);
    setShowModal(false);
  };

  const handleDelete = (index: number) => {
    const updatedPlan = emptyArr.filter((_, i) => i !== index);
    setEmptyArr(updatedPlan);
    setSelectedActivities((prev) => {
      const newSelectedActivities = { ...prev };
      delete newSelectedActivities[index];
      // Shift all indices after the deleted one
      const shiftedActivities: { [key: number]: string } = {};
      Object.keys(newSelectedActivities).forEach((key) => {
        const numKey = parseInt(key);
        if (numKey > index) {
          shiftedActivities[numKey - 1] = newSelectedActivities[numKey];
        } else if (numKey < index) {
          shiftedActivities[numKey] = newSelectedActivities[numKey];
        }
      });
      return shiftedActivities;
    });
  };
  const updateTheActivitityById = async (activityId: string,index:number) => {
    const activity =await getActivityById(activityId);
    if (activity) {
      emptyArr[index] = activity;
      setEmptyArr([...emptyArr]);
    } else {
      console.error("Activity not found");
    }
}
  const [selectedActivities, setSelectedActivities] = useState<{
    [id: number]: string;
  }>({});

  const handleActivitySelectChange = (id: number, value: string) => {
    setSelectedActivities((prev) => ({ ...prev, [id]: value }));
    updateTheActivitityById(value,id);
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
             onClick={() => setShowModal(true)}
          >
            <Plus />
            <span>Create New Activity</span>
          </button>
          <div className="p-2 border border-gray-300 rounded-xl">
            <ReplayOutlined></ReplayOutlined>
          </div>
          <button
            className="flex items-center space-x-2 text-white px-4 py-2 rounded-xl text-sm md:text-base btn2 "
            onClick={handleSessionCreation}
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
              {emptyArr.map((activity , index) => (
                <tr
                  key={index}
                  className="text-sm text-gray-800 hover:bg-gray-50"
                >
                  <td className="px-4 py-7 border-b border-b-gray-200 text-center">
                    {index + 1}
                  </td>

                  <td className="px-4 py-7 border-b border-b-gray-200 text-center">
                    <FormControl sx={{ width: 200 }} size="small">
                      <Select
                        value={selectedActivities[index] || ""}
                        onChange={(e) =>{
                          handleActivitySelectChange(index, e.target.value)
                          console.log("Selected activity:", e.target.value);
                          
                          setActivityForTable(activity)
                        }}
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
                        {activities_api_call.map((activity) => (
                          <MenuItem
                            key={activity.icon}
                            value={activity.activityId}
                            sx={{ width: "100%" }} // optional, ensures full width of MenuItem
                            // onChange={setActivityForTable(activity)}
                          >
                            {activity.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </td>

                  <td className="px-4 py-7 border-b border-b-gray-200 text-center">
                    {activity.description}
                  </td>
                  <td className="px-4 py-7 border-b border-b-gray-200 text-center">
                    {activity.reps}
                  </td>
                  <td className="px-4 py-7 border-b border-b-gray-200 text-center">
                    <button onClick={() => handleDelete(index)}>
                      <LucideCircleMinus className="text-red-400" size={24} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="p-3 border-b-gray-300 border-b" colSpan={5}>
                  <button
                    className="space-x-2 px-4 py-2 add-row"
                   onClick={addNewRow}
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
                            value={activity.name}
                            onChange={(e) => {
                              const updated = [...newActivities];
                              updated[index].name = e.target.value;
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
                            value={activity.reps}
                            onChange={(e) => {
                              const updated = [...newActivities];
                              updated[index].reps = e.target.value;
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

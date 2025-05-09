import React, { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../store/DataContext";
import {
  LucideEye,
  LucideTrash2,
  Plus,
  Dumbbell,
  EyeIcon,
  Trash2,
} from "lucide-react"; // Replace with actual Lucide icons
import Header from "../planPageComponent/Header";
import { Mediation, NordicWalking } from "@mui/icons-material";

function AllPlans() {
  const { sessions, setSessions, setSelectComponent } =
    useContext(DataContext)!;
  const [planName, setPlanName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  console.log(sessions);
  // grid and checked cell interaction
  const [activePlan, setActivePlan] = useState(null);
  const [gridAssignments, setGridAssignments] = useState<{
    [key: number]: any;
  }>({});

  const filteredPlans = sessions.filter(
    (plan) =>
      plan.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.sessionType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filterPlansAccordingTo = (category: string) => {
    setSearchTerm(category);
  };

  const isAllSelected =
    filteredPlans.length > 0 && selectedIds.length === filteredPlans.length;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate =
        selectedIds.length > 0 && selectedIds.length < filteredPlans.length;
    }
  }, [selectedIds, filteredPlans.length]);

  const toggleSelectAll = () => {
    // setSelectedIds(isAllSelected ? [] : filteredPlans.map((p) => p.id));

    if (isAllSelected) {
      setSelectedIds([]);
      setActivePlan(null);
    } else {
      setSelectedIds(filteredPlans.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) => {
      const newSelected = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      console.log(newSelected);
      // setting active plan for the communication of grid and colums
      if (newSelected.length === 1) {
        const plan = sessions.find((p) => p.id === newSelected[0]);
        setActivePlan(plan || null);
      } else {
        setActivePlan(null);
      }
      return newSelected;
    });
  };

  const handleDelete = () => {
    setSessions((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
  };

  const [len, setLen] = useState(30);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewSession, setPreviewSession] = useState<any>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const handlePreviewClick = (session: any) => {
    setPreviewSession(session);
    setPreviewModalOpen(true);
    setSelectedSession(session);
    console.log("Previewing session:", session);
  }


    return (
      <div className="flex flex-col ">
        <div>
          <Header />
        </div>

        <div className="flex p-5 space-x-8">
          <div className="bg-white w-1/2 shadow-lg p-5">
            <div className="bg-white rounded-lg">
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b">
                <div className="font-normal text-3xl">
                  Plans{" "}
                  <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-lg">
                    All
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Icons for filtering */}

                  {/* Delete and New buttons */}
                  <button className="text-red-500">
                    <LucideTrash2
                      size={50}
                      className="border-2 border-gray-300 p-2 rounded-xl"
                    />
                  </button>
                  <button className="flex items-center space-x-1 border-2 px-4 py-2 rounded-lg border-blue-600">
                    <Plus size={30} className="text-blue-600" />
                    <span className="text-blue-600 text-xl">New Plan</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <table className="w-full table-auto border-collapse text-left">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-sm">
                    <th className="p-4 border">
                      {" "}
                      {/* master checkbox placeholder */}
                      <input type="checkbox" disabled />
                    </th>
                    <th className="p-4 border">Session Name</th>
                    <th className="p-4 border">TimePeriod</th>
                    <th className="p-4 border">Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {filteredSessions.map((session, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-4 border">
                        <input
                          type="checkbox"
                          checked={selectedSessions.includes(index)}
                          onChange={() => toggleSelect(index)}
                        />
                      </td>
                      <td className="p-4 border">{session.sessionName}</td>
                      <td className="p-4 border">{session.sessionType}</td>
                      <td className="p-4 border">
                        <LucideEye className="text-gray-600 cursor-pointer" />
                      </td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-1/2 bg-white h-[85vh] shadow-lg p-5">
              {/* Top Bar */}
              <div className="top-bar">
                <input
                  className="border-2 border-gray-300 px-2 py-1 rounded-md"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by plan name or category"
                />

                <div className="button-group">
                  <button className="border-2 border-gray-300 px-2 py-1 rounded-md">
                    <Dumbbell
                      size={30}
                      onClick={() => filterPlansAccordingTo("Fitness")}
                    />
                  </button>
                  <button className="border-2 border-gray-300 px-2 py-1 rounded-md">
                    <Mediation
                      style={{ fontSize: "30px" }}
                      onClick={() => filterPlansAccordingTo("Wellness")}
                    />
                  </button>
                  <button className="border-2 border-gray-300 px-2 py-1 rounded-md">
                    <NordicWalking
                      style={{ fontSize: "30px" }}
                      onClick={() => filterPlansAccordingTo("Sports")}
                    />
                  </button>
                </div>

                <button
                  className="border-2 border-gray-300 px-2 py-1 rounded-md"
                  onClick={handleDelete}
                  disabled={selectedIds.length === 0}
                >
                  <Trash2 size={30} className="text-red-500" />
                </button>
                <button className="new-button">
                  <Plus size={30} />
                  <span>NEW</span>
                </button>
              </div>

              {/* Table */}
              <div className="table-container">
                <table className="plans-table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          ref={checkboxRef}
                          onChange={toggleSelectAll}
                          checked={isAllSelected}
                        />
                      </th>
                      <th>Sl No</th>
                      <th>Plan Name</th>
                      <th>Category</th>
                      <th>Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlans.map((plan, idx) => (
                      <tr key={plan.id} className="table-row">
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(plan.id)}
                            onChange={() => toggleSelectOne(plan.id)}
                          />
                        </td>
                        <td>{idx + 1}</td>
                        <td>{plan.sessionName}</td>
                        <td>{plan.sessionType}</td>
                        <td>
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
          </div>
      
      </div>
    );
}

export default AllPlans;

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
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Main Content Section */}
      <div className="flex flex-col md:flex-row flex-wrap gap-5 p-5">
        {/* Left Pane */}
        <div className="w-full md:w-[48%] md:h-[85vh] bg-white shadow-lg p-5 rounded-lg">
          {/* Header Section */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-2xl font-semibold">
              Plans{" "}
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-lg">
                All
              </span>
            </h2>
            <div className="flex items-center space-x-3">
              <button className="text-red-500">
                <LucideTrash2
                  size={40}
                  className="border p-2 rounded-lg border-gray-300"
                />
              </button>
              <button className="flex items-center space-x-2 border border-blue-600 px-3 py-2 rounded-lg">
                <Plus size={20} className="text-blue-600" />
                <span className="text-blue-600">New Plan</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="p-3 border">
                    <input type="checkbox" disabled />
                  </th>
                  <th className="p-3 border">Session Name</th>
                  <th className="p-3 border">TimePeriod</th>
                  <th className="p-3 border">Preview</th>
                </tr>
              </thead>
              <tbody>{/* Table body data (optional) */}</tbody>
            </table>
          </div>
        </div>

        {/* Right Pane */}
        <div className="w-full md:w-[48%] md:h-[85vh] bg-white shadow-lg p-5 rounded-lg h-fit">
          {/* Top Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <input
              className="border border-gray-300 px-3 py-2 rounded-md w-full md:w-auto"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by plan name or category"
            />
            <button
              className="border border-gray-300 px-3 py-2 rounded-md"
              onClick={() => filterPlansAccordingTo("Fitness")}
            >
              <Dumbbell size={20} />
            </button>
            <button
              className="border border-gray-300 px-3 py-2 rounded-md"
              onClick={() => filterPlansAccordingTo("Wellness")}
            >
              <Mediation fontSize="small" />
            </button>
            <button
              className="border border-gray-300 px-3 py-2 rounded-md"
              onClick={() => filterPlansAccordingTo("Sports")}
            >
              <NordicWalking fontSize="small" />
            </button>
            <button
              className="border border-gray-300 px-3 py-2 rounded-md"
              onClick={handleDelete}
              disabled={selectedIds.length === 0}
            >
              <Trash2 size={20} className="text-red-500" />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="p-3 border">
                    <input
                      type="checkbox"
                      ref={checkboxRef}
                      onChange={toggleSelectAll}
                      checked={isAllSelected}
                    />
                  </th>
                  <th className="p-3 border">Sl No</th>
                  <th className="p-3 border">Plan Name</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Preview</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan, idx) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="p-3 border">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(plan.id)}
                        onChange={() => toggleSelectOne(plan.id)}
                      />
                    </td>
                    <td className="p-3 border">{idx + 1}</td>
                    <td className="p-3 border">{plan.sessionName}</td>
                    <td className="p-3 border">{plan.sessionType}</td>
                    <td className="p-3 border">
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

import React, { useContext, useEffect, useRef, useState } from "react";
import "./AllPlans.css";
import { DataContext } from "../store/DataContext";
import {
  LucideEye,
  LucideTrash2,
  Plus,
  Dumbbell,
  EyeIcon,
  Trash2,
} from "lucide-react";
import Header from "../planPageComponent/Header";
import { Mediation, NordicWalking } from "@mui/icons-material";

function AllPlans() {
  const { sessions, setSessions, setSelectComponent, plans } =
    useContext(DataContext)!;
  const [planName, setPlanName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [activePlan, setActivePlan] = useState(null);
  const [gridAssignments, setGridAssignments] = useState<{
    [key: number]: any;
  }>({});
  const filteredPlans = sessions.filter(
    (plan) =>
      plan.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.sessionType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAllSelected =
    filteredPlans.length > 0 && selectedIds.length === filteredPlans.length;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate =
        selectedIds.length > 0 && selectedIds.length < filteredPlans.length;
    }
  }, [selectedIds, filteredPlans.length]);

  const toggleSelectAll = () => {
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

  const handlePreviewClick = (session: any) => {
    setSelectedIds([session.id]);
  };

  const filterPlansAccordingTo = (category: string) => {
    setSearchTerm(category);
  };

  return (
    <div className="all-plans-container">
      <Header />
      <div className="flex flex-col md:flex-row flex-wrap gap-5 p-5">
        <div className="plan-section md">
          <div className="section-header">
            <h2 className="section-title">Plans</h2>
            <div className="section-buttons">
              <button className="icon-button">
                <LucideTrash2 size={20} />
              </button>
              <button className="primary-button">
                <Plus size={20} />
                <span>New Plan</span>
              </button>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Session Name</th>
                  <th>TimePeriod</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                {/* Fill rows if needed */}
                {plans.map((plan, index) => (
                  <tr key={plan.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{plan.planName}</td>
                    <td>{plan.category}</td>
                    <td>
                      <button
                        onClick={() => filterPlansAccordingTo(plan.category)}
                      >
                        <EyeIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="plan-section md">
          <div className="controls">
            <h2 className="section-title">
              Sessions <span className="badge">All</span>
            </h2>
            <div className="filter-button-icons">
              <button onClick={() => filterPlansAccordingTo("Fitness")}>
                <Dumbbell size={19} />
              </button>
              <button onClick={() => filterPlansAccordingTo("Wellness")}>
                <Mediation fontSize="small" />
              </button>
              <button onClick={() => filterPlansAccordingTo("Sports")}>
                <NordicWalking fontSize="small" />
              </button>
            </div>
            <button onClick={handleDelete} disabled={selectedIds.length === 0}>
              <Trash2 size={20} className="text-red-500" />
            </button>
            <button className="primary-button">
              <Plus size={20} />
              <span>New Session</span>
            </button>
          </div>

          <div className="table-wrapper">
            <table className="table">
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
                  <tr key={plan.id}>
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

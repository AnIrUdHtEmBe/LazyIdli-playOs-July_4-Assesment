import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../planCreationComponents/Header";
import { DataContext } from "../store/DataContext";
import { ChevronRight, Trash2 } from "lucide-react";
import "./PlanCreation.css"; // Import the CSS file

function PlanCreation() {
  const { plans, setPlans } = useContext(DataContext)!;
  const [planName, setPlanName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // grid and checked cell interaction
  const [activePlan, setActivePlan] = useState(null);
  const [gridAssignments, setGridAssignments] = useState<{
    [key: number]: any;
  }>({});
  

  const filteredPlans = plans.filter(
    (plan) =>
      plan.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.category.toLowerCase().includes(searchTerm.toLowerCase())
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
    // setSelectedIds(isAllSelected ? [] : filteredPlans.map((p) => p.id));

    if(isAllSelected){
      setSelectedIds([]);
      setActivePlan(null);
    }
    else{
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
        const plan = plans.find((p) => p.id === newSelected[0]);
        setActivePlan(plan || null);
      } else {
        setActivePlan(null);
      }
      return newSelected;
    });
  };

  const handleGridCellClick = (index: number) => {
    if (!activePlan) return; // If no plan is selected, do nothing

    setGridAssignments((prev) => ({
      ...prev,
      [index]: activePlan,
    }));
  };

  const handleDelete = () => {
    setPlans((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
  };

  let len = 30;

  return (
    <div className="responses-root">
      <div className="sticky-header">
        <Header />
      </div>

      <div className="main-container">
        {/* Left Panel: Plans Table */}
        <div className="left-panel">
          {/* Top Bar */}
          <div className="top-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by plan name or category"
              className="search-input"
            />
            <div className="action-buttons">
              <button
                className="action-button delete-button"
                onClick={handleDelete}
                disabled={selectedIds.length === 0}
              >
                <Trash2 size={16} style={{ marginRight: "4px" }} />
                <span>Delete</span>
              </button>
            </div>
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
                    <td>{plan.planName}</td>
                    <td>{plan.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Plan Details & Calendar */}
        <div className="right-panel">
          <div className="plan-details">
            {/* Plan Name Input */}
            <div className="plan-name-input">
              <label htmlFor="planName">Plan Name</label>
              <input
                type="text"
                id="planName"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="Enter plan name"
              />
            </div>

            {/* Calendar */}
            <div className="calendar">
              <div className="calendar-header">
                <h2>My Personalised Plan</h2>
              </div>

              <div className="calendar-grid">
                {Array.from({ length: Math.ceil(len / 7) }, (_, weekIndex) => (
                  <React.Fragment key={weekIndex}>
                    <div className="week Label"> Week {weekIndex + 1}</div>
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const index = weekIndex * 7 + dayIndex;
                      const assignedPlan = gridAssignments[index];

                      return index < len ? (
                        <div
                          key={index}
                          className={`calendar-cell ${
                            activePlan && ! (selectedIds.length > 1) ? "clickable" : ""
                          } ${( selectedIds.length > 1) ? "disabled" : ""}`}
                          onClick={() => {
                            if (!( selectedIds.length > 1)) {
                              handleGridCellClick(index);
                            }
                          }}
                        >
                          {assignedPlan ? (
                            <div className="assigned-plan">
                              <strong>{assignedPlan.planName}</strong>
                              <div className="small">
                                {assignedPlan.category}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div
                          key={`empty-${index}`}
                          className="calendar-cell empty"
                        >
                          {" "}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <div className="confirm-button">
              <button>
                <span>Confirm</span>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanCreation;

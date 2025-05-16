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
  const { sessions, setSessions, setSelectComponent, plans, setPlans } =
    useContext(DataContext)!;
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [planName, setPlanName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const planCheckboxRef = useRef<HTMLInputElement>(null);
  const sessionCheckboxRef = useRef<HTMLInputElement>(null);

  const [selectedPlanIds, setSelectedPlanIds] = useState<number[]>([]);
  const [selectedSessionIds, setSelectedSessionIds] = useState<number[]>([]);

  const [activePlan, setActivePlan] = useState(null);
  const [gridAssignments, setGridAssignments] = useState<{
    [key: number]: any;
  }>({});

  // Filter sessions based on search term
  const filteredPlans = sessions.filter(
    (plan) =>
      plan.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.sessionType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Remove or fix this if not needed
  // const isAllSelected =
  //   filteredPlans.length > 0 && selectedSessionIds.length === filteredPlans.length;

  useEffect(() => {
    if (planCheckboxRef.current) {
      planCheckboxRef.current.indeterminate =
        selectedPlanIds.length > 0 && selectedPlanIds.length < plans.length;
    }
  }, [selectedPlanIds, plans.length]);

  useEffect(() => {
    if (sessionCheckboxRef.current) {
      sessionCheckboxRef.current.indeterminate =
        selectedSessionIds.length > 0 &&
        selectedSessionIds.length < filteredPlans.length;
    }
  }, [selectedSessionIds, filteredPlans.length]);

  const handlePlanDelete = () => {
    setPlans((prev) => prev.filter((p) => !selectedPlanIds.includes(p.id)));
    setSelectedPlanIds([]);
  };

  const handleDelete = () => {
    setSessions((prev) =>
      prev.filter((p) => !selectedSessionIds.includes(p.id))
    );
    setSelectedSessionIds([]);
  };

  const toggleSelectAllPlans = () => {
    setSelectedPlanIds((prev) =>
      prev.length === plans.length ? [] : plans.map((p) => p.id)
    );
  };

  const toggleSelectOnePlan = (id: number) => {
    setSelectedPlanIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllSessions = () => {
    setSelectedSessionIds((prev) =>
      prev.length === filteredPlans.length ? [] : filteredPlans.map((p) => p.id)
    );
  };

  const toggleSelectOneSession = (id: number) => {
    setSelectedSessionIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePreviewClick = (session: any) => {
    setSelectedSessionIds([session.id]);
    // Optionally clear plan selection if you want strict exclusivity:
    // setSelectedPlanIds([]);
  };

  const filterPlansAccordingTo = (category: string) => {
    if (activeFilter === category) {
      setActiveFilter(null); // Remove filter if clicked again
      setSearchTerm(""); // Show all
    } else {
      setActiveFilter(category);
      setSearchTerm(category);
    }
  };

  return (
    <div className="all-plans-container">
      <Header />
      <div className="flex flex-col md:flex-row flex-wrap gap-5 p-5">
        <div className="plan-section md">
          <div className="section-header">
            <h2 className="section-title">Plans</h2>
            <div className="section-buttons">
              <button
                className="icon-button"
                onClick={handlePlanDelete}
                disabled={selectedPlanIds.length === 0}
              >
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
                    <input
                      type="checkbox"
                      checked={
                        plans.length > 0 &&
                        selectedPlanIds.length === plans.length
                      }
                      onChange={toggleSelectAllPlans}
                      ref={planCheckboxRef}
                    />
                  </th>
                  <th>Plan Name</th>
                  <th>Category</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedPlanIds.includes(plan.id)}
                        onChange={() => {
                          toggleSelectOnePlan(plan.id);
                          // Optionally clear session selection if you want strict exclusivity:
                          // setSelectedSessionIds([]);
                        }}
                      />
                    </td>
                    <td>{plan.planName}</td>
                    <td>{plan.category}</td>
                    <td>
                      <button>
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
              <button
                className={`filter-btn ${
                  activeFilter === "Fitness" ? "filter-btn-active" : ""
                }`}
                onClick={() => filterPlansAccordingTo("Fitness")}
              >
                <Dumbbell size={20} />
              </button>
              <button
                className={`filter-btn ${
                  activeFilter === "Wellness" ? "filter-btn-active" : ""
                }`}
                onClick={() => filterPlansAccordingTo("Wellness")}
              >
                <Mediation style={{ fontSize: "20px" }} />
              </button>
              <button
                className={`filter-btn ${
                  activeFilter === "Sports" ? "filter-btn-active" : ""
                }`}
                onClick={() => filterPlansAccordingTo("Sports")}
              >
                <NordicWalking style={{ fontSize: "20px" }} />
              </button>
            </div>
            <button
              onClick={handleDelete}
              disabled={selectedSessionIds.length === 0}
            >
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
                      checked={
                        filteredPlans.length > 0 &&
                        selectedSessionIds.length === filteredPlans.length
                      }
                      onChange={toggleSelectAllSessions}
                      ref={sessionCheckboxRef}
                    />
                  </th>
                  <th>Sl No</th>
                  <th>Session Name</th>
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
                        checked={selectedSessionIds.includes(plan.id)}
                        onChange={() => {
                          toggleSelectOneSession(plan.id);
                          // Optionally clear plan selection if you want strict exclusivity:
                          // setSelectedPlanIds([]);
                        }}
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

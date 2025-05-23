import React, { useContext, useEffect, useRef, useState } from "react";
import "./AllPlans.css";
import { DataContext } from "../store/DataContext";
import { Plus, Dumbbell, EyeIcon, Trash2, X } from "lucide-react";
import Header from "../planPageComponent/Header";
import { Mediation, NordicWalking } from "@mui/icons-material";
import { useApiCalls } from "../store/axios";

function AllPlans() {
  const { setSelectComponent, plans_full_api_call, sessions_api_call } =
    useContext(DataContext)!;
  const { getPlansFull, patchPlans, getSessions } = useApiCalls();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const planCheckboxRef = useRef<HTMLInputElement>(null);
  const sessionCheckboxRef = useRef<HTMLInputElement>(null);
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  const [previewSession, setPreviewSession] = useState<any | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const [previewPlan, setPreviewPlan] = useState<any | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      await getPlansFull();
    };
    fetchPlans();
  }, []);

  console.log(plans_full_api_call);
  console.log(sessions_api_call);
  // Filter sessions based on search term
  const filteredPlans = sessions_api_call.filter(
    (plan) =>
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // plan cehckbox
  useEffect(() => {
    if (planCheckboxRef.current) {
      planCheckboxRef.current.indeterminate =
        selectedPlanIds.length > 0 && selectedPlanIds.length < plans.length;
    }
  }, [selectedPlanIds, plans.length]);

  // session checkbox
  useEffect(() => {
    if (sessionCheckboxRef.current) {
      sessionCheckboxRef.current.indeterminate =
        selectedSessionIds.length > 0 &&
        selectedSessionIds.length < filteredPlans.length;
    }
  }, [selectedSessionIds, filteredPlans.length]);

  const handlePlanDeactivate = () => {
    if (selectedPlanIds.length === plans_full_api_call.length) {
      setPlans(plans_full_api_call);
      const allTemplateIds = plans_full_api_call.map((plan) => plan.templateId);
      patchPlans(allTemplateIds);
    } else {
      const selectedPlans = plans_full_api_call.filter((p) =>
        selectedPlanIds.includes(p.templateId)
      );
      setPlans(selectedPlans);
      const selectedTemplateIds = selectedPlans.map((plan) => plan.templateId);
      patchPlans(selectedTemplateIds);
    }
    setSelectedPlanIds([]);
  };
  console.log(plans);
  //  toggeling all plans
  const toggleSelectAllPlans = () => {
    if (selectedPlanIds.length === plans_full_api_call.length) {
      // Unselect all
      setSelectedPlanIds([]);
    } else {
      // Select all
      setSelectedPlanIds(plans_full_api_call.map((p) => p.templateId));
    }
  };
  // toggling one plan
  const toggleSelectOnePlan = (id: string) => {
    setSelectedPlanIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePlanPreviewClick = (plan: any) => {
    setPreviewPlan(plan);
    setShowPlanModal(true);
  };

  // toggling all sessions
  const toggleSelectAllSessions = () => {
    if (selectedSessionIds.length === filteredPlans.length) {
      setSelectedSessionIds([]);
    } else {
      setSelectedSessionIds(filteredPlans.map((p) => p.sessionId));
    }
  };

  const toggleSelectOneSession = (id: string) => {
    setSelectedSessionIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // session delete
  const handleDelete = () => {
    if (selectedSessionIds.length === filteredPlans.length) {
      setSessions(filteredPlans);
    } else {
      const selectedSessions = filteredPlans.filter((p) =>
        selectedSessionIds.includes(p.sessionId)
      );
      setSessions(selectedSessions);
    }
    setSelectedSessionIds([]);
  };

  const handlePreviewClick = (session: any) => {
    setPreviewSession(session);
    setShowSessionModal(true);
  };

  const filterPlansAccordingTo = (category: string) => {
    if (activeFilter === category) {
      setActiveFilter(null);
      setSearchTerm("");
    } else {
      setActiveFilter(category);
      setSearchTerm(category);
    }
  };

  useEffect(() => {
    if (
      showSessionModal &&
      previewSession &&
      (!previewSession.activities || previewSession.activities.length === 0)
    ) {
      alert("No activities found for this session.");
      setShowSessionModal(false);
    }
  }, [showSessionModal, previewSession]);

  useEffect(() => {
    if (
      showPlanModal &&
      previewPlan &&
      (!previewPlan.sessions || previewPlan.sessions.length === 0)
    ) {
      alert("No sessions found for this plan.");
      setShowPlanModal(false);
    }
  }, [showPlanModal, previewPlan]);

  // const planRowsToFill = ;
  // const activityRowsToFill =;

  return (
    <div className="all-plans-container">
      <Header />
      <div className="flex flex-col md:flex-row flex-wrap gap-5 p-5 h-[calc(100vh-350px)]">
        <div className="plan-section md">
          <div className="section-header">
            <h2 className="section-title">Plans</h2>
            <div className="section-buttons">
              <button
                className="icon-button"
                onClick={handlePlanDeactivate}
                disabled={selectedPlanIds.length === 0}
              >
                De-activate
              </button>
              <button
                className="primary-button"
                onClick={() => setSelectComponent("planCreation")}
              >
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
                        plans_full_api_call.length > 0 &&
                        selectedPlanIds.length === plans_full_api_call.length
                      }
                      onChange={toggleSelectAllPlans}
                      ref={planCheckboxRef}
                    />
                  </th>
                  <th>Plan Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                {plans_full_api_call.map((plan) => (
                  <tr key={plan.templateId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedPlanIds.includes(plan.templateId)}
                        onChange={() => toggleSelectOnePlan(plan.templateId)}
                      />
                    </td>
                    <td>{plan.title}</td>
                    <td>{plan?.category || ""}</td>
                    <td>{plan.status}</td>
                    <td>
                      <button onClick={() => handlePlanPreviewClick(plan)}>
                        <EyeIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* session */}

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
            <button
              className="primary-button"
              onClick={() => setSelectComponent("/sessions")}
            >
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
                  <th>Status</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan, idx) => (
                  <tr key={plan.sessionId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedSessionIds.includes(plan.sessionId)}
                        onChange={() => {
                          toggleSelectOneSession(plan.sessionId);
                        }}
                      />
                    </td>
                    <td>{idx + 1}</td>
                    <td>{plan.title}</td>
                    <td>{plan.category}</td>
                    <td>{plan.status}</td>
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

      {showPlanModal && previewPlan && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowPlanModal(false)}
            >
              <X></X>
            </button>
            <div className="modal">
              <h1 className="modal-titlebhav">{previewPlan.title}</h1>
              {previewPlan.sessions && previewPlan.sessions.length > 0 ? (
                <table className="modal-table">
                  <thead>
                    <tr>
                      <th>Sl No</th>
                      <th>Session Title</th>
                      <th>Category</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewPlan.sessions.map((session: any, idx: number) => (
                      <tr key={session.sessionId}>
                        <td>{idx + 1}</td>
                        <td>{session.title}</td>
                        <td>{session.category}</td>
                        <td>{session.status}</td>
                      </tr>
                    ))}
                    {Array.from({
                      length: Math.max(
                        0,
                        15 - (previewPlan.sessions?.length || 0)
                      ),
                    }).map((_, idx) => (
                      <tr key={`empty-plan-row-${idx}`}>
                        <td
                          colSpan={4}
                          style={{ height: "40px", background: "white" }}
                        ></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {showSessionModal && previewSession && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowSessionModal(false)}
            >
              <X></X>
            </button>
            <div className="modal">
              <h1 className="modal-titlebhav">{previewSession.title}</h1>
              {previewSession.activities &&
              previewSession.activities.length > 0 ? (
                <table className="modal-table">
                  <thead>
                    <tr>
                      <th>Sl No</th>
                      <th>Activity Name</th>
                      <th>Description</th>
                      <th>Reps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewSession.activities.map((act: any, idx: number) => (
                      <tr key={act.activityId}>
                        <td>{idx + 1}</td>
                        <td>{act.name}</td>
                        <td>{act.description}</td>
                        <td>{act.reps}</td>
                      </tr>
                    ))}

                    {Array.from({
                      length: Math.max(
                        0,
                        15 - (previewSession.activities?.length || 0)
                      ),
                    }).map((_, idx) => (
                      <tr key={`empty-plan-row-${idx}`}>
                        <td
                          colSpan={4}
                          style={{ height: "40px", background: "white" }}
                        ></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllPlans;

import { useContext, useEffect, useRef, useState } from "react";
import "./AllPlans.css";
import { DataContext } from "../store/DataContext";
import { Plus, EyeIcon} from "lucide-react";
import Header from "../planPageComponent/Header";
import { useApiCalls } from "../store/axios";
import { CircularProgress } from "@mui/material";
import SessionGridAllPlans from "./SessionGridAllPlans";

function AllPlans() {
  const { setSelectComponent, plans_full_api_call } =
    useContext(DataContext)!;
  const { getPlansFull, OptimisedPatchPlan } = useApiCalls();

  const planCheckboxRef = useRef<HTMLInputElement>(null);
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);

  const [plans, setPlans] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  const [selectedPlan , setSelectedPlan] = useState<string>("");

  const [previewPlan, setPreviewPlan] = useState<any | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        await getPlansFull();
      } catch (error) {
        console.error("Error in useEffect:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  console.log(plans_full_api_call);

  // plan cehckbox
  useEffect(() => {
    if (planCheckboxRef.current) {
      planCheckboxRef.current.indeterminate =
        selectedPlanIds.length > 0 && selectedPlanIds.length < plans.length;
    }
  }, [selectedPlanIds, plans.length]);

  const handlePlanStatus = async (btnValue : number) => {
    setLoading(true);
    try {
      let targetPlans = [];
  
      if (selectedPlanIds.length === plans_full_api_call.length) {
        targetPlans = plans_full_api_call;
      } else {
        targetPlans = plans_full_api_call.filter((p) =>
          selectedPlanIds.includes(p.templateId)
        );
      }
  
      const templateIds = targetPlans.map((plan) => plan.templateId);
      await OptimisedPatchPlan(templateIds, btnValue);
      
      // Optionally wait for updated plans to be fetched
      await getPlansFull();
  
      setPlans(targetPlans); // only update if needed
      setSelectedPlanIds([]);
    } catch (error) {
      console.error("Error in handlePlanDeactivate:", error);
    } finally {
      setLoading(false);
    }
  };
  
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
    console.log("Plan clicked:", plan);
    setSelectedPlan(plan);
    setSessions(plan.sessions || []);
  };

  console.log("Sessions:", sessions);

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

  return (
    <div className="all-plans-container">
      <Header />
      <div className="flex flex-col md:flex-row flex-wrap gap-5 p-5 h-[calc(100vh-350px)]">
        <div className="plan-section md">
          <div className="section-header">
            <h2 className="section-title">Plans</h2>
            <div className="section-buttons">
            <button
                className="activate-button"
                onClick={() => handlePlanStatus(0)}
                disabled={selectedPlanIds.length === 0}
              >
                Activate
              </button>
              <button
                className="icon-button"
                onClick={()=> handlePlanStatus(1)}
                disabled={selectedPlanIds.length === 0}
              >
                De-activate
              </button>
              <button
                className="primary-button"
                onClick={() => setSelectComponent("/plans")}
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
              {loading ? (
                <tbody>
                  <tr>
                    <td colSpan={5} className="py-8 text-center">
                      <CircularProgress />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {plans_full_api_call.map((plan) => (
                    <tr key={plan.templateId} className={`${plan.templateId === selectedPlan?.templateId ? "selected_plan" : ""}`}>
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
              )}
            </table>
          </div>
        </div>
        {/* session */}

        <div className="grid-section md">
          <SessionGridAllPlans sessions={sessions}></SessionGridAllPlans>
        </div>
      </div>
    </div>
  );
}

export default AllPlans;

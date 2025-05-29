import axios from "axios";
import { useContext } from "react";
import {
  Activity_Api_call,
  Customers_Api_call,
  DataContext,
  Plan_Api_call,
  Plan_Instance_Api_call,
  Session_Api_call,
} from "./DataContext";
// import { Dispatch, SetStateAction } from 'react';
import { createAssessmentTemplate } from "./DataContext";
const API_BASE_URL = "http://3.111.32.88:8080";

export const useApiCalls = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useApiCalls must be used within a DataProvider");
  }
  const {
    setSelectComponent,
    setCustomers_Api_call,
    setAssessments_Api_call,
    setQuestionsForAPICall,
    setAssessmentInstance_expanded_Api_call,
    setActivities_api_call,
    setSessions_api_call,
    setPlans_full_api_call,
  } = context;

  const customer_creation = async (customer :any) => {
    try{
      const res = await axios.post(`${API_BASE_URL}/humans`, customer);
      console.log("Customer created successfully:", res.data);
      alert("Customer created successfully!");
      customers_fetching(); // Refresh the customer list after creation
    }catch(error){
      console.error("❌ Error creating customer:", error);
    }
  }
  const patch_user = async (userId: string) => {
    try {
      // Send PATCH requests for each userId in parallel
      await axios.patch(`${API_BASE_URL}/humans/${userId}`, {
        membershipType: "inactive"
      })
      // alert("user deactivated successfully!");
      // customers_fetching(); // Refresh the customer list
    } catch (error) {
      console.error("❌ Error deactivating users:", error);
      alert("Failed to deactivate one or more users. Please try again.");
    }
  };
  

  const customers_fetching = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/humans`);
      const data = res.data;

      setCustomers_Api_call(data);
      console.log("Status:", res.status);
    } catch (error) {
      console.error("❌ Error fetching customers:", error);
    }
  };
  const patchSession = async (sessionId: string, session: Session_Api_call) => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/session-templates/${sessionId}`,
        session
      );
      console.log("Session updated successfully:", res.data);
      alert("Session updated successfully!");
    } catch (error) {
      console.error("❌ Error updating session:", error);
      alert("Error updating session");
    }
  };
  const getPlanByPlanId = async (planId: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/plan-templates/${planId}`);
      const data = res.data;
      console.log("✅ Plan fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching plan:", error);
    }
  };
  const getSessions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/session-templates/full`);
      const data = res.data;
      setSessions_api_call(data);
      console.log("✅ Sessions fetched successfully:", data);
    } catch (error) {
      console.error("❌ Error fetching sessions:", error);
    }
  };
  const createSession = async (session: Session_Api_call) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/session-templates`,
        session
      );
      console.log("Session created successfully:", res.data);
      alert(
        "Session created successfully! You can now view it in the Sessions section."
      );
    } catch (error) {
      console.error("❌ Error creating session:", error);
      alert("Error creating session. Please fill all details.");
    }
  };

  const assessments_fetching = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/asssessmenttemplates/full`);
      const data = res.data;
      setAssessments_Api_call(data);
      // console.log("✅ Assessments fetched successfully:", data);
      console.log("Status:", res.status);
    } catch (error) {
      console.error("❌ Error fetching assessments:", error);
    }
  };
  const updateSessionInPlanInstance = async (planInstanceId: string , sessionInstanceId: string , newDate : Date) => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/plan-instances/${planInstanceId}/reschedule-session`, {
          sessionInstanceId: sessionInstanceId,
          newDate: newDate.toISOString()
        }
      );
      console.log("Session instance updated successfully:", res.data);
    } 
    catch (error) {
      console.error("❌ Error updating session instance:", error);
    }
  };
  const questions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/questions`);
      const data = res.data;
      setQuestionsForAPICall(data);
      console.log("✅ Questions fetched successfully:", data);
    } catch (error) {
      console.error("❌ Error fetching questions:", error);
    }
  };

  const submitAssesment = async (assesment: createAssessmentTemplate) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/asssessmenttemplates`,
        assesment
      );
      console.log("✅ Assessment submitted successfully:", res.data);
    } catch (error) {
      console.error("❌ Error submitting assessment:", error);
    }
  };

  const getActivities = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/activity-templates`);
      const data = res.data;
      setActivities_api_call(res.data);
      console.log("✅ Activities fetched successfully:", data);
    } catch (error) {
      console.error("❌ Error fetching activities:", error);
    }
  };

  const assessments_intsnce_fetching = async (
    assessmentInstanceIdArray: string[]
  ) => {
    try {
      if (
        !assessmentInstanceIdArray ||
        assessmentInstanceIdArray.length === 0
      ) {
        setAssessmentInstance_expanded_Api_call([]);
      }
      const requests = assessmentInstanceIdArray.map((id) =>
        axios.get(`${API_BASE_URL}/asssessmentinstances/${id}/expanded`)
      );

      // Wait for all requests to complete
      const responses = await Promise.all(requests);
      // Extract data from each response
      const allData = responses.map((res) => res.data);

      // Update the state with the array of all fetched data
      setAssessmentInstance_expanded_Api_call(allData);

      console.log("✅ Assessment instances fetched successfully:", allData);
    } catch (error) {
      console.error("❌ Error fetching assessment instances:", error);
    }
  };

  const createPlanInstance = async (
    planTemplateId: string,
    userId: string,
    plan: Plan_Instance_Api_call
  ) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/plan-instances?planTemplateId=${planTemplateId}&userId=${userId}`,
        plan
      );
      console.log("Plan instance created successfully:", res.data);
      alert(
        "Plan instance created successfully! You can now view it in the Plans section."
      );
    } catch (error) {
      console.error("❌ Error creating plan instance:", error);
    }
  };

  const createPlan = async (plan: Plan_Api_call) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/plan-templates`, plan);
      console.log("Plan created successfully:", res.data);
      alert(
        "Plan created successfully! You can now view it in the All Plans section."
      );
    } catch (error) {
      console.error("❌ Error creating plan:", error);
      alert("Error creating plan");
    }
  };

  const starting_assessment_by_user = async (
    user_id: string,
    template_id: string
  ) => {
    console.log("Starting assessment for user:", user_id);
    console.log("Template ID:", template_id);
    try {
      const res = axios.post(
        `${API_BASE_URL}/asssessmentinstances/start/${user_id}/${template_id}`
      );
      console.log("Assessment started successfully:", (await res).status);
      // console.log("Assessment started successfully:", (await res).data);
      localStorage.setItem(
        "latestAssessmentTemplate",
        JSON.stringify((await res).data.assessmentInstanceId)
      );
      console.log(
        "Latest Assessment Template ID stored in localStorage:",
        (await res).data.assessmentInstanceId
      );
    } catch (error) {
      console.error("❌ Error starting assessment:", error);
    }
  };

  const assessmet_submission = async (
    instanceId: string,
    answers: object[]
  ) => {
    try {
      console.log(answers);
      const res = await axios.patch(
        `${API_BASE_URL}/asssessmentinstances/${instanceId}/submit`,
        {
          answers: answers,
        }
      );
      console.log("Assessment submitted successfully:", (await res).status);

      setSelectComponent("responses");
      alert("Assessment submitted successfully!");
    } catch (error) {
      console.error("❌ Error submitting assessment:", error);
      alert("Error submitting assessment. Please try again.");
    }
  };

  const Question_creation_Api_call = async (questions: object[]) => {
    try {
      for (const question of questions) {
        if (question.checked) {
          const res = await axios.post(`${API_BASE_URL}/questions`, question);
          console.log("✅ Question created successfully:", res.data);
        }
      }
    } catch (error) {
      console.error("❌ Error creating question:", error);
    }
  };

  const createActivity = async (activity: Activity_Api_call) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/activity-templates`,
        activity
      );
      console.log("Activity created successfully:", res.data);
    } catch (error) {
      console.error("❌ Error creating activity:", error);
    }
  };
  const getActivityById = async (activityId: string) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/activity-templates/${activityId}`
      );
      const data = res.data;
      console.log("✅ Activity fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching activity:", error);
    }
  };

  const getPlansFull = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/plan-templates/All`);
      const data = res.data;
      setPlans_full_api_call(data);
      console.log("✅ Plans fetched successfully:", data);
    } catch (error) {
      console.error("❌ Error fetching plans:", error);
    }
  };

  const getExpandedPlanByPlanId = async (planIds: string[]) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/plan-templates/full`,
        planIds
      );
      const data = res.data;
      console.log("✅ Plan fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching plan:", error);
    }
  };

  const getSessionById = async (sessionId: string) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/session-templates/${sessionId}`
      );
      const data = res.data;
      console.log("✅ Session fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching session:", error);
    }
  };

  const getPlansForInterval = async (startDate: string, endDate: string , userId: string) => {
     try {
      const res = await axios.get(
        `${API_BASE_URL}/humans/${userId}/plan-instances-within-date?start=${startDate}&end=${endDate}`
      );
      const data = res.data;
      console.log("✅ Plans for interval fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching plans for interval:", error);
    }
  }

  const patchPlans = async (templateIds: string[], btnValue: number) => {
    console.time("patchPlans total");

    const updatePromises = templateIds.map((templateId) => {
      console.time(`patch-${templateId}`);
      let newStatus = btnValue === 0 ? "ACTIVE" : "INACTIVE";

      return axios
        .patch(`${API_BASE_URL}/plan-templates/${templateId}`, {
          status: newStatus,
        })
        .then((res) => {
          console.timeEnd(`patch-${templateId}`);
          return res.data;
        })
        .catch((err) => {
          console.timeEnd(`patch-${templateId}`);
          console.error(`Failed to patch ${templateId}`, err);
          return null;
        });
    });

    console.time("awaiting all patches");
    const results = await Promise.all(updatePromises);
    console.timeEnd("awaiting all patches");

    console.timeEnd("patchPlans total");

    // console.time("filtering results");
    return results;
    // console.timeEnd("filtering results");
  };

  const OptimisedPatchPlan = async (
    templateIds: string[],
    btnValue: number
  ) => {
    const status = btnValue === 0 ? "ACTIVE" : "INACTIVE";
    const payload = {
      templateIds,
      updates: templateIds.map(() => ({
        status,
      })),
    };

    try{
      const response = await axios.patch(`${API_BASE_URL}/plan-templates/batch`, payload);
      console.log("✅ Patch successful:", response.data);
      return response.data;
    }catch(error){
      console.error("❌ Error in OptimisedPatchPlan:", error);
    }
  };

  const getScore = async (
    questionId: string,
    userId: string,
    value: number
  ) => {
    const data = { questionId, userId, value };
    try {
      const res = await axios.post(`${API_BASE_URL}/score`, data);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching score:", error);
      return null;
    }
  };

  return {
    customers_fetching,
    assessments_fetching,
    assessments_intsnce_fetching,
    questions,
    submitAssesment,
    starting_assessment_by_user,
    assessmet_submission,
    getActivities,
    Question_creation_Api_call,
    createActivity,
    getActivityById,
    createSession,
    getSessions,
    getPlansFull,
    patchSession,
    createPlan,
    patchPlans,
    getPlanByPlanId,
    getSessionById,
    createPlanInstance,
    getExpandedPlanByPlanId,
    getScore,
    getPlansForInterval,
    updateSessionInPlanInstance,
    OptimisedPatchPlan,
    customer_creation,
    patch_user
  };
};

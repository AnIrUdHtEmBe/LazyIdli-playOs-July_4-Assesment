import axios from "axios";
import { useContext } from "react";
import {
  Activity_Api_call,
  DataContext,
  Plan_Api_call,
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
    setCustomers_Api_call,
    setAssessments_Api_call,
    setQuestionsForAPICall,
    setAssessmentInstance_expanded_Api_call,
    setActivities_api_call,
    setSessions_api_call,
    setPlans_full_api_call,
  } = context;

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
    } catch (error) {
      console.error("❌ Error updating session:", error);
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
    } catch (error) {
      console.error("❌ Error creating session:", error);
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


  const createPlan = async(plan: Plan_Api_call) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/plan-templates`, plan);
      console.log("Plan created successfully:", res.data);
    } catch (error) {
      console.error("❌ Error creating plan:", error);
    }
  }

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
    } catch (error) {
      console.error("❌ Error starting assessment:", error);
    }
  };

  const assessmet_submission = async (
    instanceId: string,
    answers: object[]
  ) => {
    try {
      const res = axios.patch(
        `${API_BASE_URL}/asssessmentinstances/${instanceId}/submit`,
        {
          answers: answers,
        }
      );
      console.log("Assessment submitted successfully:", (await res).status);
      // console.log("Assessment submitted successfully:", (await res).data);
    } catch (error) {
      console.error("❌ Error submitting assessment:", error);
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
      const res = await axios.get(`${API_BASE_URL}/plan-templates/full`);
      const data = res.data;
      setPlans_full_api_call(data);
      console.log("✅ Plans fetched successfully:", data);
    } catch (error) {
      console.error("❌ Error fetching plans:", error);
    }
  };

  const patchPlans = async (templateIds: string[]) => {
    const updatePromises = templateIds.map((templateId) =>
      axios
        .patch(`${API_BASE_URL}/plan-templates/${templateId}`, { status: "INACTIVE" })
        .then((res) => res.data)
        .catch((err) => {
          console.error(`Failed to patch ${templateId}`, err);
          return null;
        })
    );

    const results = await Promise.all(updatePromises);
    getPlansFull(); // Refresh the plans after patching
    return results;
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
  };
};

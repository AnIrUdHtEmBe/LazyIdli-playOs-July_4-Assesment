import axios from "axios";
import { useContext } from "react";
import { DataContext } from "./DataContext";
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

  const starting_assessment_by_user = async (user_id : string , template_id : string)=> {
    console.log("Starting assessment for user:", user_id);
    console.log("Template ID:", template_id);
    try{
      const res = axios.post(`${API_BASE_URL}/asssessmentinstances/start/${user_id}/${template_id}`)
      console.log("Assessment started successfully:", (await res).status);
    }
    catch(error){
      console.error("❌ Error starting assessment:", error);
    }
  }


  const assessmet_submission = async (instanceId : string) => {
    try{
      const res = axios.post(`${API_BASE_URL}/assessmentinstances/${instanceId}/submit`)
      console.log("Assessment submitted successfully:", (await res).status);
    }catch(error){
      console.error("❌ Error submitting assessment:", error);
    }
  }

  return {
    customers_fetching,
    assessments_fetching,
    assessments_intsnce_fetching,
    questions,
    submitAssesment,
    starting_assessment_by_user,
    assessmet_submission
  };
};

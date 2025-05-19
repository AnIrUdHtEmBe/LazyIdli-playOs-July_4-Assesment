import axios from "axios";
import { useContext } from "react";
import { DataContext } from "./DataContext";
// import { Dispatch, SetStateAction } from 'react';

const API_BASE_URL = "http://3.111.32.88:8080";

export const useApiCalls = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useApiCalls must be used within a DataProvider");
  }
  const { setCustomers_Api_call , setAssessments_Api_call } = context;

  const customers_fetching = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/humans`);
      const data = res.data;

      setCustomers_Api_call(data);
      //   console.log("✅ Customers fetched successfully:", data);
      console.log("Status:", res.status);
    } catch (error) {
      console.error("❌ Error fetching customers:", error);
    }
  };

  const assessments_fetching = async () => {
    try{
        const res= await axios.get(`${API_BASE_URL}/asssessmenttemplates/full`);
        const data = res.data;
        setAssessments_Api_call(data);
        // console.log("✅ Assessments fetched successfully:", data);
        console.log("Status:", res.status);
    }
    catch(error){
        console.error("❌ Error fetching assessments:", error);
      }
  }

  return { customers_fetching , assessments_fetching};
};

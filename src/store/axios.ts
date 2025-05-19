import axios from 'axios';
import { useContext } from 'react';
import { DataContext } from './DataContext';

const API_BASE_URL = "http://3.111.32.88:8080";

export const useApiCalls = () => {
  const { setCustomers_Api_call } = useContext(DataContext);

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

//   const questions = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/questions`);
//     //   setQuestionsForAPICall(response.data);
//       console.log("✅ Questions fetched successfully:", response.data);
//     } catch (error) {
//       console.error("❌ Error fetching questions:", error);
//     }
//   };

  return { customers_fetching };
};

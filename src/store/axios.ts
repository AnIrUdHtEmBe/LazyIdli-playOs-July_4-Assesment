import axios from 'axios';
import { DataContext } from './DataContext';
import { useContext } from 'react';

const context = useContext(DataContext);
const {  questionsForAPICall  , setQuestionsForAPICall} = context;
const API_BASE_URL = "http://3.111.32.88:8080";

const questions = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/questions`);
        setQuestionsForAPICall(response.data);
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}
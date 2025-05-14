import React from 'react'
import { FileText } from "lucide-react";
import "./QuestionBank.css"; 
import {selectComponent} from "../store/DataContext";
const QuestionBank = () => {
  return (
    <div>
        <div className='question-bank header-container'>
            <div className="header-top">
                <FileText size={28} className="text-gray-800" />
                <span className="header-title">Questionnaire Creation</span>
            </div>
      <div className="header-tabs">
        <button
          className={`text-xl font-medium  border-b-4 border-black}`}
        >
          Questions
        </button>
        <button className="header-tab">Settings</button>
      </div>
        </div>
        <div className='question-bank-container'>
            <div className="question-bank-top-container">
                <span>Create a Question Bank</span>
                <button className='question-bank-save-button'>Save</button>
            </div>
           
        </div>
    </div>
  )
}

export default QuestionBank
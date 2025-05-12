import React, { useContext, useState } from "react";
import { DataContext } from "../store/DataContext";
import { ChevronRight, ToggleLeft, ToggleRight, X } from "lucide-react";
import "./QuestionPaperSet.css"; // Import the CSS
import { ToggleButtonGroup } from "@mui/material";
type Question = {
  questionId: number;
  questionText: string;
  options: { text: string }[];
  required: boolean;
};
function QuestionPaperSet() {
  const context = useContext(DataContext);

  if (!context) return <div>Loading...</div>;

  const {
    setSelectComponent,
    selectComponent,
    questionsForQuestionBank,
    setQuestionsForQuestionBank,
  } = context;

  const [showOptions, setShowoptions] = useState(true);

  const [selectedQuestion, setSelectedQuestions] = useState<Question[]>([]);
  const [finalQuestion, setFinalQuestion] = useState<Question[]>([]);

  const handleSelect = (question: Object) => {
    if (selectedQuestion.includes(question)) {
      setSelectedQuestions(
        selectedQuestion.filter((item) => item !== question)
      );
    } else {
      setSelectedQuestions([...selectedQuestion, question]);
    }
  };

  const handleMoveToQp = () => {
    const newQuestions = selectedQuestion
      .filter(
        (question) =>
          !finalQuestion.some((q) => q.questionId === question.questionId)
      )
      .map((q) => ({ ...q, required: false })); // Add required field

    setFinalQuestion([...finalQuestion, ...newQuestions]);
    setSelectedQuestions([]);
  };

  const toggleRequired = (id: number) => {
    setFinalQuestion((prev) =>
      prev.map((q) =>
        q.questionId === id ? { ...q, required: !q.required } : q
      )
    );
  };

  const handleDelete = (question) => {
    const deletedSet = finalQuestion.filter(
      (item) => item.questionId !== question.questionId
    );
    setFinalQuestion(deletedSet);
  };

  return (
    <div className="qp-container">
      {/* Header */}
      <div className="qp-header">
        <div className="qp-header-text">
          <h1 className="qp-title">Assessment Name</h1>
          <p className="qp-description">Description</p>
        </div>
        <button className="qp-finish-btn">Finish</button>
      </div>

      {/* Main Content */}
      <div className="qp-content">
        {/* Question Selection Panel */}
        <div className="qp-question-bank">
          <h2 className="qp-section-title">Question Bank</h2>
          <div className="qp-question-list">
            {questionsForQuestionBank.map((question) => (
              <div key={question.questionId} className="qp-question-item">
                <input
                  type="checkbox"
                  onClick={() => handleSelect(question)}
                  checked={selectedQuestion.some(
                    (q) => q.questionId === question.questionId
                  )}
                  className="qp-checkbox"
                />
                <label className="qp-label">
                  <span className="qp-label-id">{question.questionId})</span>
                  {question.questionText}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Button Panel */}
        <div className="qp-move-btn-container">
          <button className="qp-move-btn" onClick={handleMoveToQp}>
            Move To QP <ChevronRight size={20} />
          </button>
        </div>

        {/* Final Question Paper Section */}
        <div className="qp-final-section">
          <div className="flex justify-end items-center justify-center gap-1 text-xl">
            <span>Q & A</span>
            <button
              className="qp-toggle-options"
              onClick={() => setShowoptions(!showOptions)}
            >
              {showOptions ? (
                <ToggleLeft className="text-blue-500" size={50}></ToggleLeft>
              ) : (
                <ToggleRight className="text-blue-500" size={50}></ToggleRight>
              )}
            </button>
            <span>Q Only</span>
          </div>

          {finalQuestion.length !== 0 ? (
            finalQuestion.map((question, index) => (
              <div
                key={index}
                className={`qp-final-question ${
                  showOptions ? "qp-show" : "qp-hide"
                }`}
              >
                <div className="qp-final-header">
                  <div className="flex items-center gap-5">
                    <span className="qp-question-label text-xl">
                      Question {index + 1} /
                      <span className="text-black text-xl">
                        {finalQuestion.length}
                      </span>
                    </span>
                    {/* <button className="flex" onClick={() => setRequiredQuestion(!requiredQuestion)}>{requiredQuestion ? <ToggleLeft></ToggleLeft> : <ToggleRight className="text-blue-500"></ToggleRight>} {requiredQuestion ?<span>Not-Required</span> : <span>Required</span> } </button> */}
                    <button
                      className="flex"
                      onClick={() => toggleRequired(question.questionId)}
                    >
                      {question.required ? (
                        <ToggleLeft />
                      ) : (
                        <ToggleRight className="text-blue-500" />
                      )}
                      {question.required ? (
                        <span>Required</span>
                      ) : (
                        <span>Not-Required</span>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(question)}
                    className="qp-delete-btn"
                  >
                    <X color="red" size={25} />
                  </button>
                </div>

                <p className="qp-question-text">{question.questionText}</p>

                {showOptions && (
                  <div className="qp-options">
                    {question.options.map((item, i) => (
                      <div key={i} className="qp-option">
                        <input type="checkbox" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="qp-no-questions">
              No Questions Added
              <br />
              Please select questions from the left panel
              <br />
              and click on Move to QP
              <br />
              Note: You can select multiple questions at once
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionPaperSet;

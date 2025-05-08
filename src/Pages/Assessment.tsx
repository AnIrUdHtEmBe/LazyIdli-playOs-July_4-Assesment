import React, { useContext, useState } from "react";
import { Eye, ArrowRight, X } from "lucide-react";
import { DataContext } from "../store/DataContext";
import Header from "../assessmentComponents/Header";
import './Assessment.css'; // ⬅️ Link to the custom CSS

const Assessment: React.FC = () => {
  const context = useContext(DataContext);
  const [selectedRow, setSelectedRow] = useState<Object | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<String | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (!context) return <div>Loading...</div>;

  const { assessments, mcqQuestions, setSelectComponent } = context;

  const handleStartAssignment = () => {
    setSelectComponent("Q&A");
    localStorage.setItem("assessmentDetails", JSON.stringify(selectedRow));
  };

  return (
    <div className="assessment-container">
      <Header />

      <div className="assessment-header">
        <h1 className="assessment-title">Assessments</h1>
        <button className="start-button" onClick={handleStartAssignment}>
          <span>Start</span>
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="assessment-table-wrapper">
        <table className="assessment-table">
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Assessment</th>
              <th>No.of Questions</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((assessment) => (
              <tr
                key={assessment.id}
                onClick={() => setSelectedRow(assessment)}
                className={
                  selectedRow === assessment
                    ? "selected-row"
                    : "hover-row"
                }
              >
                <td>{assessment.id}</td>
                <td>{assessment.name}</td>
                <td>{assessment.questionCount}</td>
                <td>
                  {assessment.questionCount !== "-" && (
                    <button
                      className="preview-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowModal(true);
                        setSelectedAssessment(assessment.name);
                      }}
                    >
                      <Eye size={20} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={() => setShowModal(false)}>
              <X size={24} />
            </button>
            <h1 className="modal-title">{selectedAssessment}</h1>
            <h2 className="modal-subtitle">Questions</h2>
            <div className="questions-container">
              {mcqQuestions.map((ques, index) => (
                <div key={ques.questionId} className="question">
                  <p>{index + 1}. {ques.questionText}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessment;

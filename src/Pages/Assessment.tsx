import React, { useContext, useState } from "react";
import { Eye, ArrowRight, X } from "lucide-react";
import { DataContext } from "../store/DataContext";
import Header from "../assessmentComponents/Header";
import "./Assessment.css"; // ⬅️ Link to the custom CSS

const Assessment: React.FC = () => {
  const context = useContext(DataContext);
  const [selectedRow, setSelectedRow] = useState<Object | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<String | null>(
    null
  );
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
        <button  className={`${selectedRow ? "start-button" : "disable-button"}`}   disabled={!selectedRow} onClick={handleStartAssignment}>
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
                  selectedRow === assessment ? "selected-row" : "hover-row"
                }
              >
                <td>{assessment.id}</td>
                <td className="font-medium">{assessment.name}</td>
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
            <button
              className="close-button"
              onClick={() => setShowModal(false)}
            >
              <X size={24} />
            </button>
            <h1 className="modal-title">{selectedAssessment}</h1>
            <table className="w-full table-auto border-collapse text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-b-1 border-b-gray-300 px-4 py-2 w-1/12 text-center">Sl.No</th>
                  <th className="border-b-1 border-b-gray-300 px-4 py-2 w-8/12">Questions</th>
                  <th className="border-b-1 border-b-gray-300 px-4 py-2 w-3/12 text-center">
                    Mandatory
                  </th>
                </tr>
              </thead>
              <tbody>
                {mcqQuestions.map((ques, index) => (
                  <tr key={ques.questionId} className="border-b border-b-gray-300 bg-white">
                    <td className="border-b-1 border-b-gray-300 px-4 py-4 text-center">
                      {index + 1}
                    </td>
                    <td className="border-b-1 border-b-gray-300 px-4 py-4">{ques.questionText}</td>
                    <td className="border-b-1 border-b-gray-300 px-4 py-4 text-center">Yes</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessment;

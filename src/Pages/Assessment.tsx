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
    <div>
      <Header />
      <div className="assessment-container">
        <div className="assessment-content">
          <div className="assessment-header">
            <h1 className="assessment-title">Assessments</h1>
            <button
              className={`${selectedRow ? "start-button" : "disable-button"}`}
              disabled={!selectedRow}
              onClick={handleStartAssignment}
            >
              <span>Start</span>
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="assessment-table-wrapper">
            <table className="assessment-table">
              <thead>
                <tr>
                  <th className="sl-header">Sl.No</th>
                  <th className="assess-header">Assessment</th>
                  <th className="ques-header">No.of Questions</th>
                  <th className="prev-header">Preview</th>
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
                          <Eye size={25} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                <X size={24} className="" />
              </button>
              <div className="modal">
                <h1 className="modal-title">{selectedAssessment}</h1>
                <table className="modal-table">
                  <thead>
                    <tr className="modal-table-header-row">
                      <th className="modal-th slno-header">Sl.No</th>
                      <th className="modal-th question-header">Questions</th>
                      <th className="modal-th mandatory-header">Mandatory</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mcqQuestions.map((ques, index) => (
                      <tr key={ques.questionId} className="modal-table-row">
                        <td className="modal-td slno-cell">{index + 1}</td>
                        <td className="modal-td question-cell">
                          {ques.questionText}
                        </td>
                        <td className="modal-td mandatory-cell">Yes</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;

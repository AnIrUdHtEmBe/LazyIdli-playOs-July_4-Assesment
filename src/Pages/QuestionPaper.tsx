import { useContext, useState } from "react";
import { CheckCircle, Circle, StickyNote } from "lucide-react";
import Header from "../questionPaperComponents/Header";
import { DataContext } from "../store/DataContext";
import "./QuestionPaper.css";

type Notes = {
  questionId: number;
  comment: string;
};

function QuestionPaper() {
  const paperDetails = JSON.parse(
    localStorage.getItem("assessmentDetails") || "{}"
  );
  const userDetail = JSON.parse(localStorage.getItem("user") || "{}");

  const [notes, setNotes] = useState<Notes[]>([]);
  const context = useContext(DataContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { mcqQuestions, setSelectComponent } = context;

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [commentModal, setCommentModal] = useState(false);
  const [comment, setComment] = useState<string>("");
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const allAnswered =
    mcqQuestions.length > 0 &&
    mcqQuestions.every((_, index) => answers[index] !== undefined);

  return (
    <div className="dashboard-container">
      {/* Fixed Header */}
        <Header />
      

      {/* Scrollable body area */}
      <div className="body-container">
        <div className="paper-det">
          {/* Top Info */}
          <div className="top-info">
            <div className="paper-info">
              <div className="paper-titless">{paperDetails.name}</div>
              <div className="paper-subtitle">
                For adults, optimizing strength, metabolism, and diet.{" "}
              </div>
            </div>

            <div className="user-det">
              <div className="flex space-x-2.5">
                <span className="label-bhav">Taking For: </span>
                <div> 
                  {userDetail.name} <br /> ID: {userDetail.id}
                </div>
              </div>
              <button
                disabled={!allAnswered}
                onClick={() => setSelectComponent("responses")}
                className={`submit-btn ${allAnswered ? "active" : "disabled"}`}
              >
                Submit
              </button>
            </div>
          </div>

          {/* Main Scrollable Panels */}
          <div className="main-container">
            {/* Left Scrollable Questions List */}
            <div className="questions-list">
              <div className="questions-title">Questions</div>
              <div className="questions-container">
                {mcqQuestions.map((q, index) => (
                  <div
                    key={q.questionId}
                    onClick={() => setSelectedQuestionIndex(index)}
                    className={`question-item ${
                      selectedQuestionIndex === index ? "selected" : "hover"
                    }`}
                  >
                    {answers[index] !== undefined ? (
                      <CheckCircle className="answered-icon" />
                    ) : (
                      <Circle className="unanswered-icon" />
                    )}
                    <span className="question-text">
                      <div>{index + 1})</div>
                      <div>{q.questionText}</div>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Scrollable All Questions Display */}
            <div className="questions-display">
              {mcqQuestions.map((question, questionIndex) => (
                <div key={question.questionId} className="question-header">
                  <div className="question-subheader">
                    <div>
                      <div className="question-number">
                        Question {questionIndex + 1} /{" "}
                        <span className="question-count">
                          {mcqQuestions.length}
                        </span>
                      </div>
                      <div className="font-normal mt-[5px] mb-[10px] text-[18px]">{question.questionText}</div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveQuestionId(question.questionId);
                        const existingNote = notes.find(
                          (n) => n.questionId === question.questionId
                        );
                        setComment(existingNote ? existingNote.comment : "");
                        setCommentModal(true);
                      }}
                    >
                      <StickyNote
                        className="border-1 p-2 rounded-md"
                        size={40}
                      />
                    </button>
                  </div>

                  <div className="options-container">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`option-item ${
                          answers[questionIndex] === optionIndex
                            ? "selected-option"
                            : "default-option"
                        }`}
                        onClick={() =>
                          handleOptionSelect(questionIndex, optionIndex)
                        }
                      >
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          checked={answers[questionIndex] === optionIndex}
                          onChange={() => {}}
                          className="appearance-none h-4 w-4 border border-gray-400 rounded-none checked:bg-blue-600 checked:border-blue-600 cursor-pointer"
                        />

                        <span className="option-text">{option.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {commentModal && (
        <div className="comment-modal">
          <div className="comment-modal-content">
            <h2 className="comment-modal-title">Add Comment</h2>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Write your note..."
              className="comment-textarea"
            />
            <div className="comment-modal-buttons">
              <button
                onClick={() => setCommentModal(false)}
                className="comment-modal-button cancel"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (activeQuestionId !== null) {
                    setNotes([
                      ...notes,
                      { questionId: activeQuestionId, comment },
                    ]);
                    setCommentModal(false);
                    setComment("");
                    setActiveQuestionId(null);
                  }
                }}
                className="comment-modal-button save"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionPaper;

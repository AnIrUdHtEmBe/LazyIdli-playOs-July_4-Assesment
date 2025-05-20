import { useContext, useState } from "react";
import { CheckCircle, Circle, StickyNote } from "lucide-react";
import Header from "../questionPaperComponents/Header";
import { DataContext } from "../store/DataContext";
import "./QuestionPaper.css";
import { useApiCalls } from "../store/axios";

type Notes = {
  questionId: number;
  comment: string;
};

function QuestionPaper() {

  const paperDetails = JSON.parse(
    localStorage.getItem("assessmentDetails") || "{}"
  );

  console.log(paperDetails);
  const userDetail = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(userDetail);

  const [notes, setNotes] = useState<Notes[]>([]);
  const context = useContext(DataContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { setSelectComponent } = context;
  const { assessmet_submission} = useApiCalls();

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [commentModal, setCommentModal] = useState(false);
  const [comment, setComment] = useState<string>("");
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);

  const handleOptionSelect = (questionIndex: number, optionValue: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionValue,
    }));
  };


  console.log("answers", answers);

  const allAnswered =
    paperDetails.questions.length > 0 &&
    paperDetails.questions?.every(
      (_: any, index: any) => answers[index] !== undefined
    );

    const handleSubmit = () => {
      const instanceId = JSON.parse(localStorage.getItem("latestAssessmentTemplate"));
      const ans = paperDetails.questions.map((question: any, index: number) => ({
        questionId: question.questionId,
        value: answers[index] || "", 
      }));
      console.log("ans", ans);
      assessmet_submission(instanceId, ans);
      setSelectComponent("responses");
    };
    
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
                <span className="label-bhav">Taking For : </span>
                <div>
                  {userDetail.name} <br /> ID: {userDetail.userId}
                </div>
              </div>
              <button
                disabled={!allAnswered}
                onClick={handleSubmit}
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
                {paperDetails.questions.map((q, index) => (
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
                      <div>{q.mainText}</div>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Scrollable All Questions Display */}
            <div className="questions-display">
              {paperDetails.questions.map((question, questionIndex: number) => (
                <div key={question.questionId} className="question-header">
                  <div className="question-subheader">
                    <div>
                      <div className="question-number">
                        Question {questionIndex + 1} /{" "}
                        <span className="question-count">
                          {paperDetails.questions.length}
                        </span>
                        {question.isRequired ? (
                          <span className="text-red-600"> * </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="font-normal mt-[5px] mb-[10px] text-[18px]">
                        {question.mainText}
                      </div>
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
                        className="py-1 px-2 rounded-md stick-comment"
                        size={40}
                      />
                    </button>
                  </div>

                  {question.answerType === "choose_one" ? (
                    <div className="options-container">
                      {question.options?.map((option, optionIndex) => {
                        const isSelected = answers[questionIndex] === option;

                        return (
                          <label
                            key={optionIndex}
                            className={`flex items-center gap-2 p-1 cursor-pointer transition-colors duration-200 ${
                              isSelected ? "text-black" : "bg-white text-black"
                            }`}
                            onClick={() =>
                              handleOptionSelect(questionIndex, option)
                            }
                          >
                            <div
                              className={`h-5 w-5 flex items-center justify-center border-2 rounded-sm ${
                                isSelected
                                  ? "bg-blue-600 border-blue-600"
                                  : "border-gray-400"
                              }`}
                            >
                              {isSelected && (
                                <svg
                                  className="w-3.5 h-3.5 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    d="M5 13l4 4L19 7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>

                            <input
                              type="radio"
                              name={`question-${questionIndex}`}
                              checked={isSelected}
                              onChange={() => {}}
                              className="hidden"
                            />
                            <span className="flex-1 option-text">{option}</span>
                          </label>
                        );
                      })}
                    </div>
                  ) : question.answerType === "yesno" ? (
                    <div className="options-container">
                      <div className="flex items-center gap-5 p-1">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`question-${questionIndex}`}
                            checked={answers[questionIndex] === "yes"}
                            onChange={() =>
                              handleOptionSelect(questionIndex, "yes")
                            }
                            className="scale-150"
                          />
                          <span className="option-text">Yes</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`question-${questionIndex}`}
                            checked={answers[questionIndex] === "no"}
                            onChange={() =>
                              handleOptionSelect(questionIndex, "no")
                            }
                            className="scale-150"
                          />
                          <span className="option-text">No</span>
                        </label>
                      </div>
                    </div>
                  ) : question.answerType === "text" ? (
                    <div className="options-container">
                      <textarea
                        value={answers[questionIndex] || ""}
                        onChange={(e) =>
                          handleOptionSelect(questionIndex, e.target.value)
                        }
                        rows={2}
                        placeholder="Type your answer here..."
                        className="text-input border-2 border-gray-300 rounded-md p-2 w-full"
                      />
                    </div>
                  ) : question.answerType === "number" ? (
                    <div className="options-container">
                      <input
                        type="number"
                        value={answers[questionIndex] || ""}
                        onChange={(e) =>
                          handleOptionSelect(questionIndex, e.target.value)
                        }
                        placeholder="Type your answer here..."
                        className="text-input border-2 border-gray-300 rounded-md p-2 w-full"
                      />
                    </div>
                  ) : question.answerType === "date" ? (
                    <div className="options-container">
                      <input
                        type="date"
                        value={answers[questionIndex] || ""}
                        onChange={(e) =>
                          handleOptionSelect(questionIndex, e.target.value)
                        }
                        className="text-input border-2 border-gray-300 rounded-md p-2 w-full"
                      />
                    </div>
                  ) : (
                    ""
                  )}
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

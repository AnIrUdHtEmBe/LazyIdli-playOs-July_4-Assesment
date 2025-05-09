import { useContext, useState } from "react";
import { CheckCircle, Circle, StickyNote } from "lucide-react";
import Header from "../questionPaperComponents/Header";
import { DataContext } from "../store/DataContext";

type Notes = {
  questionId: number;
  comment: string;
};

function QuestionPaper() {
  const paperDetails = JSON.parse(localStorage.getItem("assessmentDetails"));
  const userDetail = JSON.parse(localStorage.getItem("user"));

  console.log(userDetail);
  const [notes, setNotes] = useState<Notes[]>([]);
  const context = useContext(DataContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { mcqQuestions, setSelectComponent } = context;
  console.log(mcqQuestions);

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
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="w-full sticky top-0 z-50 bg-white shadow-md">
        <Header />
      </div>

      {/* Scrollable body area */}
      <div className="flex-1 overflow-hidden p-3 sm:p-6">
        <div className="p-3 sm:p-5 bg-white rounded-xl bg-blue-200 h-full">
          {/* Top Info */}
          <div className="flex justify-between flex-col sm:flex-row gap-4 sm:gap-0 p-3 border-b-2">
            <div className="text-2xl sm:text-3xl font-extralight">
              {paperDetails.name}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div>
                <span className="font-semibold">Taking For: </span>
                {userDetail.name} <br /> ID: {userDetail.id}
              </div>
              <button
                disabled={!allAnswered}
                onClick={() => setSelectComponent("responses")}
                className={`px-4 sm:px-6 py-2 rounded-md text-white transition ${
                  allAnswered
                    ? "bg-green-500 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            </div>
          </div>

          {/* Main Scrollable Panels */}
          <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
            {/* Left Scrollable Questions List */}
            <div className="w-full md:w-1/2 p-4 overflow-y-auto h-[300px] md:h-[calc(100vh-150px)] border-b md:border-b-0 md:border-r border-gray-300">
              <div className="text-lg font-semibold mb-4 text-blue-700">
                Questions
              </div>
              <div className="space-y-4">
                {mcqQuestions.map((q, index) => (
                  <div
                    key={q.questionId}
                    onClick={() => setSelectedQuestionIndex(index)}
                    className={`flex items-center gap-2 cursor-pointer p-2 rounded transition ${
                      selectedQuestionIndex === index
                        ? ""
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {answers[index] !== undefined ? (
                      <CheckCircle className="text-green-600" />
                    ) : (
                      <Circle className="text-gray-400" />
                    )}
                    <span className="text-sm font-medium">
                      {index + 1}. {q.questionText}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Scrollable All Questions Display */}
            <div className="w-full md:w-1/2 p-4 overflow-y-auto h-[300px] md:h-[calc(100vh-150px)] space-y-8">
              {mcqQuestions.map((question, questionIndex) => (
                <div key={question.questionId} className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold mb-2">
                      <div className="text-blue-700">
                        Question {questionIndex + 1} /{" "}
                        <span className="text-black">
                          {mcqQuestions.length}
                        </span>
                      </div>
                      <div className="font-normal">{question.questionText}</div>
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
                      <StickyNote />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center space-x-3 p-2 rounded-md cursor-pointer transition bg-white hover:bg-gray-100"
                        onClick={() =>
                          handleOptionSelect(questionIndex, optionIndex)
                        }
                      >
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          checked={answers[questionIndex] === optionIndex}
                          onChange={() => {}}
                          className="form-radio h-4 w-4 text-green-600 cursor-pointer"
                        />
                        <span className="text-sm">{option.text}</span>
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
        <div className="fixed inset-0 z-50 bg-black/60 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[90%] sm:w-[400px] space-y-4 shadow-xl">
            <h2 className="text-xl font-semibold">Add Comment</h2>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Write your note..."
              className="w-full p-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCommentModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setNotes([...notes, { questionId: activeQuestionId, comment }]);
                  setCommentModal(false);
                  setComment("");
                  setActiveQuestionId(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

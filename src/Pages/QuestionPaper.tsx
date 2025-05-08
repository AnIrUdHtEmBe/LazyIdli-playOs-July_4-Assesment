import { useContext, useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import Header from "../questionPaperComponents/Header";
import { DataContext } from "../store/DataContext";
import { CommentBank } from "@mui/icons-material";

function QuestionPaper() {
  const paperDetails = JSON.parse(localStorage.getItem("assessmentDetails"));
  const userDetail = JSON.parse(localStorage.getItem("user"));

  console.log(userDetail);

  const context = useContext(DataContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { mcqQuestions, setSelectComponent } = context;
  console.log(mcqQuestions);

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [commentMOdal , setCommentModal] = useState(false);
  const [comment , setComment] = useState<string>("");

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const allAnswered =
    mcqQuestions.length > 0 &&
    mcqQuestions.every((_, index) => answers[index] !== undefined);

  
  const handleComment = () => {
    setComment(comment);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>

      {/* Scrollable body area */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="p-3 bg-white rounded-xl bg-blue-200 h-full ">
          {/* Top Info */}
          <div className="flex justify-between p-3 border-b-2">
            <div className="text-3xl font-extralight">{paperDetails.name}</div>
            <div className="flex gap-4 items-center">
              <div>
                <span className="font-semibold">Taking For: </span>
                {userDetail.name} <br /> ID: {userDetail.id}
              </div>
              <button
                disabled={!allAnswered}
                onClick={() => setSelectComponent("responses")}
                className={`px-6 py-2 rounded-md text-white transition ${
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
          <div className="flex flex-1 overflow-hidden">
            {/* Left Scrollable Questions List */}
            <div className="w-1/2 p-4 overflow-y-auto h-[calc(100vh-150px)] border-r border-gray-300">
              <div className="text-lg font-semibold mb-4 text-blue-700">
                Questions
              </div>
              <div className="space-y-4">
                {mcqQuestions.map((q, index) => (
                  <div
                    key={q.questionId}
                    onClick={() => setSelectedQuestionIndex(index)}
                    className={`flex items-center gap-2 cursor-pointer p-2 rounded ${
                      selectedQuestionIndex === index ? "" : ""
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
            <div className="w-1/2 p-4 overflow-y-auto h-[calc(100vh-150px)] space-y-8">
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
                    <button onClick={() => setCommentModal(!commentMOdal)}> <CommentBank></CommentBank> </button>
                  </div>

                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`flex items-center space-x-3 p-1 rounded-md  cursor-pointer transition
      ${
        answers[questionIndex] === optionIndex
          ? ""
          : "bg-white hover:bg-gray-100"
      }
    `}
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
    </div>
  );
}

export default QuestionPaper;

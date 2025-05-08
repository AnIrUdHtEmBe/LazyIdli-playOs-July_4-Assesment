import { useContext, useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import Header from "../questionPaperComponents/Header";
import { DataContext } from "../store/DataContext";

function QuestionPaper() {
  const paperDetails = JSON.parse(localStorage.getItem("assessmentDetails"));
  const userDetail = JSON.parse(localStorage.getItem("user"));

  console.log(userDetail);  

  const context = useContext(DataContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { mcqQuestions ,setSelectComponent } = context;
  console.log(mcqQuestions)

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // questionIndex -> optionIndex

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
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>

      {/* Scrollable body area */}
      <div className="flex-1 overflow-hidden">
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
              <div className="text-lg font-semibold mb-4">All Questions</div>
              <div className="space-y-4">
                {mcqQuestions.map((q, index) => (
                  <div
                    key={q.questionId}
                    onClick={() => setSelectedQuestionIndex(index)}
                    className={`flex items-center gap-2 cursor-pointer p-2 rounded ${
                      selectedQuestionIndex === index
                        ? "bg-indigo-100"
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
            <div className="w-1/2 p-4 overflow-y-auto h-[calc(100vh-150px)] space-y-8">
              {mcqQuestions.map((question, questionIndex) => (
                <div key={question.questionId}>
                  <div className="text-lg font-semibold mb-2">
                    {questionIndex + 1}. {question.questionText}
                  </div>
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-md border cursor-pointer ${
                          answers[questionIndex] === optionIndex
                            ? "bg-green-100 border-green-600"
                            : "bg-white hover:bg-gray-100"
                        }`}
                        onClick={() =>
                          handleOptionSelect(questionIndex, optionIndex)
                        }
                      >
                        <span className="text-sm">{option.text}</span>
                      </div>
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

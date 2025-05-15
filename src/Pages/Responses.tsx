import { useContext, useState } from "react";
import Header from "../questionPaperComponents/Header";
import {
  ArrowRight,
  Dumbbell,
  CheckCircle,
  Calendar,
  Edit,
} from "lucide-react";
import { DataContext } from "../store/DataContext";
import "./Responses.css";
import { Comment, ReplayOutlined } from "@mui/icons-material";
import { StickyNote } from "lucide-react";

function Responses() {
  const paperDetails = JSON.parse(localStorage.getItem("assessmentDetails"));
  const userDetail = JSON.parse(localStorage.getItem("user"));

  const context = useContext(DataContext);
  if (!context) {
    return <div>Loading...</div>;
  }
  const [summaryNote, setSummaryNote] = useState<string>(() => {
    return localStorage.getItem("summaryNote") || "";
  });
  const [commentModal, setCommentModal] = useState(false);
  const [tempComment, setTempComment] = useState<string>(summaryNote);

  const { mcqAnswers, setSelectComponent } = context;

  const [comment, setComment] = useState<string>("");
  const handleCommentModal = () => {
    setTempComment(summaryNote); // preload saved note into modal
    setCommentModal(true);
  };

  const saveSummaryNote = () => {
    setSummaryNote(tempComment);
    localStorage.setItem("summaryNote", tempComment); // persist it
    setCommentModal(false);
  };

  // const handleComment = () => {
  //   setComment(comment);
  // };

  return (
    <div className="responses-root">
      {/* Fixed Header */}
      {/* <div className="sticky-header"> */}
      <Header />
      {/* </div> */}

      <div className="main-containers">
        <div className="main-card">
          {/* Top Info */}
          <div className="top">
            <div>
              <div className="paper-title">{paperDetails.name}</div>
              <div className="paper-subtitle">
                For adults, optimizing strength, metabolism, and diet.
              </div>
            </div>
            <div className="user-actions">
              <div className="flex space-x-2.5">
                <span className="label-bhav">Taking For: </span>
                <div>
                  {userDetail.name} <br /> ID: {userDetail.id}
                </div>
              </div>

              <button
                onClick={() => setSelectComponent("Q&A")}
                className="retake-button"
              >
                <ReplayOutlined></ReplayOutlined>
                <span>Retake Assessment</span>
              </button>
            </div>
          </div>

          {/* Main Panels */}
          <div className="main-panels relative">
            {/* Left Questions List */}
            <div className="question-list">
              <div className="question-title">Responses</div>
              <div className="question-items">
                {mcqAnswers.map((q, index) => (
                  <div key={q.questionId} className="question-box">
                    <div className="question-row">
                      <CheckCircle className="icon-success" />
                      <span className="question-text">
                        {index + 1}. {q.questionText}
                      </span>
                    </div>
                    <div className="question-answer">A) {q.correctOption}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Summary */}
            <div className="summary-panel">
              <div className="summary-header">
                <div className="summary-title">Summary</div>
                <button onClick={handleCommentModal}>
                  {" "}
                  <StickyNote
                    size={40}
                    className="p-2 rounded-md stick-comment"
                  />
                </button>
              </div>

              <div>
                {["Assignment 1", "Assignment 2", "Assignment 3"].map(
                  (label, i) => (
                    <div className={`assignment assignment-${i}`} key={i}>
                      <div className="label">{label} -</div>
                      <div className={`score-card score-${i}`}>
                        <div className={`score-icon icon-${i}`}>
                          <Dumbbell />
                          <span className={`score-card-text-${i}`}>
                            Fitness
                          </span>
                        </div>
                        <div>80 / 100</div>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="plan-text">
                The Recommended Plan for this assessment is ready! Please refer
                the monthly plan below.
              </div>
              <div className="plan-options">
                {[
                  "Prime Fitness",
                  "Golden Health",
                  "Young Changes",
                  "Custom Plan",
                ].map((plan, i) => (
                  <button key={i} className="plan-box hover:cursor-pointer">
                    {plan}
                  </button>
                ))}
              </div>

              <div className="mt-12 flex space-x-4 items-center">
                <Calendar></Calendar>{" "}
                <span className="font-normal text-xl ">
                  Next assessment On : 10/12/13
                </span>
                <Edit></Edit>
              </div>
              <div className="proceed-button-wrapper">
                <button
                  className="flex bg-blue-600 px-4 py-3 text-white rounded-xl space-x-15 absolute bottom-4 right-4"
                  onClick={() => setSelectComponent("planCreation")}
                >
                  <span>Proceed</span> <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {commentModal && (
        <div className="fixed inset-0 z-50  bg-black/60 bg-opacity-20 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-[400px] space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold">Summary Notes</h2>
            <textarea
              value={tempComment}
              onChange={(e) => setTempComment(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded p-2"
              placeholder="Write your summary notes here..."
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setCommentModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={saveSummaryNote}
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

export default Responses;

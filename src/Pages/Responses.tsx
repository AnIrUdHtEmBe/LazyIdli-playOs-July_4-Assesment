import { useContext, useState } from "react";
import Header from "../questionPaperComponents/Header";
import { ArrowRight, Dumbbell, CheckCircle } from "lucide-react";
import { DataContext } from "../store/DataContext";
import "./Responses.css"; 
import { Comment } from "@mui/icons-material";

function Responses() {
  const paperDetails = JSON.parse(localStorage.getItem("assessmentDetails"));
  const userDetail = JSON.parse(localStorage.getItem("user"));

  const context = useContext(DataContext);
  if (!context) {
    return <div>Loading...</div>;
  }

  const { mcqAnswers, setSelectComponent } = context;

  const [commentModal, setCommentModal] = useState(false);
  const [comment, setComment] = useState<string>("");
  const handleCommentModal = () => {
    setCommentModal(!commentModal);
  };
  const handleComment = () => {
    setComment(comment);
  };

  return (
    <div className="responses-root">
      {/* Fixed Header */}
      <div className="sticky-header">
        <Header />
      </div>

      <div className="main-container">
        <div className="main-card">
          {/* Top Info */}
          <div className="top-info">
            <div className="paper-title">{paperDetails.name}</div>
            <div className="user-actions">
              <div>
                <span className="bold">Taking For: </span>
                {userDetail.name} <br /> ID: {userDetail.id}
              </div>
              <button
                onClick={() => setSelectComponent("Q&A")}
                className="retake-button"
              >
                retake Assessment
              </button>
            </div>
          </div>

          {/* Main Panels */}
          <div className="main-panels">
            {/* Left Questions List */}
              <div className="question-list">
                <div className="question-title">All Questions</div>
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
                <button onClick={handleCommentModal}><Comment></Comment></button>
              </div>

              <div>
                {["Assignment 1", "Assignment 2", "Assignment 3"].map((label, i) => (
                  <div className={`assignment assignment-${i}`} key={i}>
                    <div>{label}-</div>
                    <div className={`score-card score-${i}`}>
                      <div className={`score-icon icon-${i}`}>
                        <Dumbbell /> Fitness
                      </div>
                      <div>80 / 100</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="plan-text">The recommended plan is ready</div>
              <div className="plan-options">
                {["Prime Fitness", "Golden Health", "Young Changes", "Custom Plan"].map((plan, i) => (
                  <button key={i} className="plan-box hover:cursor-pointer">{plan}</button>
                ))}
              </div>
              <div className="proceed-button-wrapper">
                <button className="proceed-button" onClick={() => setSelectComponent("planCreation")}>
                  Proceed <ArrowRight />
                </button>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Responses;

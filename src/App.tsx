import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import Layout from "./components/Layout";
import Dashboard from "./Pages/Dashboard";
import { DataContext } from "./store/DataContext";
import Assessment from "./Pages/Assessment";
import QuestionPaper from "./Pages/QuestionPaper";
import Responses from "./Pages/Responses";
import PlanCreation from "./Pages/PlanCreation";
import AssessmentPage from "./Pages/AssessmentPage";
import QuestionBankPage from "./Pages/QuestionBankPage";
import PlansPage from "./Pages/PlansPage";
import AssignmetnCreationPageTwo from "./Pages/AssignmetnCreationPageTwo";
import SessionsPage from "./Pages/SessionsPage";
import AllSessionsPage from "./Pages/AllSessionsPage";

function App() {
  const { selectComponent } = useContext(DataContext);
  console.log(selectComponent);
  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {(selectComponent === "dashboard" ||
                  selectComponent === "/") && <Dashboard />}
                {selectComponent === "assessment" && <Assessment />}
                {selectComponent === "Q&A" && <QuestionPaper />}
                {selectComponent === "responses" && <Responses />}
                {selectComponent === "planCreation" && <PlanCreation />}
              </>
            }
          />
          <Route
            path="/assignment"
            element={
              <>
                {selectComponent === "/assignment" && <AssessmentPage />}
                {selectComponent === "AssessmentCreationPage2" && (
                  <AssignmetnCreationPageTwo></AssignmetnCreationPageTwo>
                )}
              </>
            }
          />
          <Route
            path="/sessions"
            element={
            <>
            {selectComponent === "/sessions" && <SessionsPage />}
            {selectComponent === "AllSessions" && <AllSessionsPage />}
            </>}
          />
          <Route path="/question-bank" element={<QuestionBankPage />} />
          <Route path="/plans" element={<PlansPage />} />
          {/* // <Route path="/planCreation" element={< />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

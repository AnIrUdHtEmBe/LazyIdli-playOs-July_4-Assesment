import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext} from "react";
import Layout from "./components/Layout";
import Dashboard from "./Pages/Dashboard";
import { DataContext } from "./store/DataContext";
import Assessment from "./Pages/Assessment";
import QuestionPaper from "./Pages/QuestionPaper";
import Responses from "./Pages/Responses";
// import PlanCreation from "./Pages/PlanCreation";
import AssessmentPage from "./Pages/AssessmentPage";
// import QuestionBankPage from "./Pages/QuestionBankPage";
import PlansPage from "./Pages/PlansPage";
import AssignmetnCreationPageTwo from "./Pages/AssignmetnCreationPageTwo";
import SessionsPage from "./Pages/SessionsPage";
import AllSessionsPage from "./Pages/AllSessionsPage";
import AllPlans from "./planPageComponent/AllPlans";
import QuestionBank from "./QuestionBank/QuestionBank";
import UserPersonalisedPlan from "./Pages/UserPersonalisedPlan";

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
              selectComponent === "assessment" ? (
                <Assessment />
              ) : selectComponent === "Q&A" ? (
                <QuestionPaper />
              ) : selectComponent === "responses" ? (
                <Responses />
              ) : selectComponent === "planCreation" ? (
                // <PlansPage />
                <UserPersonalisedPlan></UserPersonalisedPlan>
              ) : (
                <Dashboard />
              )
            }
          />
          <Route
            path="/assignment"
            element={
              selectComponent === "AssessmentCreationPage2" ? (
                <AssignmetnCreationPageTwo></AssignmetnCreationPageTwo>
              ) : (
                <AssessmentPage />
              )
            }
          />
          <Route
            path="/sessions"
            element={
              selectComponent === "AllSessions" ? (
                <AllSessionsPage />
              ) : (
                <SessionsPage />
              )
            }
          />
          <Route
            path="/question-bank"
            element={<QuestionBank></QuestionBank>}
          />
          <Route
            path="/plans"
            element={
              selectComponent === "AllPlans" ? <AllPlans /> : <PlansPage />
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

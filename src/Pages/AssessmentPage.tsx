import React from "react";
import Header from "../AssessmentPageComponents/Header";
import AssignmentCreationModal from "../AssessmentPageComponents/AssignmentCreationModal";

function AssessmentPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-200">
      <Header />
      <div className=" bg-gray-200 flex-1 flex justify-center items-center">
        <AssignmentCreationModal />
      </div>
    </div>
  );
}


export default AssessmentPage;

import React from 'react'
import Header from '../AssessmentPageComponents/Header'
import QuestionPaperSet from '../assignmentCreationPageTwoComponents/QuestionPaperSet'

function AssignmetnCreationPageTwo() {
  return (
    <div className="h-screen flex flex-col bg-gray-200">
      <Header />
      <div className=" bg-gray-200 flex-1 flex p-5" >
       <QuestionPaperSet />
      </div>
    </div>
  )
}

export default AssignmetnCreationPageTwo
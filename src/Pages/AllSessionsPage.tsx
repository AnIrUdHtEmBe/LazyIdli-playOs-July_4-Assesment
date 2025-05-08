import React from 'react'
import Header from '../sessionsPageComponets/Header'
import AllSession from '../allSessionPage/AllSession'

function AllSessionsPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-200">
    <Header />
    <div className=" bg-gray-200 flex-1 flex" >
     <AllSession />
    </div>
  </div>
  )
}

export default AllSessionsPage
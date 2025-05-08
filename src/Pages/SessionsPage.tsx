import React from 'react'
import Header from '../sessionsPageComponets/Header'
import ActivityTable from '../sessionsPageComponets/ActivityTable'

function SessionsPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-200">
    <Header />
    <div className=" bg-gray-200 flex-1 flex p-5" >
      <ActivityTable></ActivityTable>
    </div>
  </div>
  )
}

export default SessionsPage
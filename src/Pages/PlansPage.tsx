import React from 'react'
import Header from "../planPageComponent/Header"

import AllSession from '../planPageComponent/SessionPage'
import Calender from '../planPageComponent/Calender'
import PagePreview from '../planPageComponent/planPagePreview'
import AllPlans from '../planPageComponent/AllPlans'
function PlansPage() {
  return (

    <div>
      {/* <Header/> */}
      <PagePreview/>
      {/* <AllPlans/> */}
      {/* <div className='flex '>
      <AllSession/>
      <Calender/> 
      </div>  */}
    </div>
  )
}

export default PlansPage
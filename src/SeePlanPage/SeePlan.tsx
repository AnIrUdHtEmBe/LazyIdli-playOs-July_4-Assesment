import React, { useEffect, useState } from "react";
import DateRangePicker from "./DateRangePicker"; // Adjust the path if needed
import { useApiCalls } from "../store/axios";
import dayjs from "dayjs";
import EventCalendar from "./EventCalendar"; // Adjust the path if needed
import Header from "./Header";
function SeePlan() {
  const {getPlansForInterval} = useApiCalls();
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
const [endDate, setEndDate] = useState(dayjs().endOf("month"));

  const user = JSON.parse(localStorage.getItem("user") || "{}");    
  const userId =  user.userId || "defaultUserId"; // Fallback to a default user ID if not found
    const [data, setData] = React.useState(null);
  useEffect( () => {
        // Convert dayjs objects to formatted strings 
        const getData = async () => {
            const res = await getPlansForInterval(dayjs(startDate).format("YYYY-MM-DD"), dayjs(endDate).format("YYYY-MM-DD"),userId); 
            setData(res);
            
            
        }
      if (startDate && endDate) {
         getData();
      }
    console.log(startDate, endDate, userId);
  }, [startDate, endDate, userId]);
  useEffect(() => {
  console.log("Data updated in parent:", data);
}, [data]);

    
  return (
    <div className="bg-white min-h-screen">
    <Header userData={user} ></Header>
      <DateRangePicker
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      <EventCalendar data={data}/>
    
    {/* <button className="border-2 p-3 bg-green-300 ">Update Changes</button> */}
    </div>
  );
}

export default SeePlan;

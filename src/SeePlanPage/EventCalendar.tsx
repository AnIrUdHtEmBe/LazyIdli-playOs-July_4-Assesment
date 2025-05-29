import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import { useApiCalls } from "../store/axios";

export default function EventCalendar({ data }) {
  const [events, setEvents] = useState([]);
  const { getSessionById , updateSessionInPlanInstance } = useApiCalls();

  
    const generateEvents = async () => {
      if (!data || !Array.isArray(data)) return;

      // const validSessions = data.flatMap(plan =>
      //   (plan.sessionInstances || []).filter(
      //     session => session.sessionTemplateId && session.scheduledDate
      //   )
      // );

      const validSessions = data.flatMap(plan =>
          (plan.sessionInstances || [])
            .filter(session => session.sessionTemplateId && session.scheduledDate)
            .map(session => ({
              ...session,
              planInstanceId: plan.planInstanceId,
              
            }))
        );

      const fetchedEvents = await Promise.all(
        validSessions.map(async (session) => {
          try {
            const res = await getSessionById(session.sessionTemplateId);
            return {
              id: session.sessionTemplateId,
              title: res?.title || "Untitled Session",
              start: dayjs(session.scheduledDate).format("YYYY-MM-DD"),
              sessionInstanceId: session.sessionInstanceId,
              planInstanceId: session.planInstanceId,
            };
          } catch (err) {
            console.error("Error fetching session:", session.sessionTemplateId, err);
            return null;
          }
        })
      );

      setEvents(fetchedEvents); // Filter out nulls
    };
useEffect(() => {
  console.log("Received new data in EventCalendar:", data);
  generateEvents();
}, [data]);
useEffect(() => {
  console.log("Events updated:", events);
}, [events]);
  const handleEventDrop = async (info) => {
  const { event } = info;

  const sessionInstanceId = event.extendedProps.sessionInstanceId;
  const planInstanceId = event.extendedProps.planInstanceId;
  const newDate = event.start;

  // Example: Log or call an API to update the session
  console.log("Dropped event:");
  console.log("Plan ID:", planInstanceId);
  console.log("Session ID:", sessionInstanceId);
  console.log("New Date:", newDate);
  await updateSessionInPlanInstance(planInstanceId, sessionInstanceId, newDate);
  // Optionally revert the drop on failure
  // info.revert();
};



  return (
    <div className="p-4">
    <FullCalendar
      key={events.length}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      editable={true}
      selectable={true}
      height="auto"
      dateClick={(info) => {
        console.log("New event on:", info.dateStr);
      }}
      eventClick={(info) => {
        console.log("Edit event:", info.event);
        
      }}
      eventDrop={handleEventDrop}
    />
    </div>
  );
}

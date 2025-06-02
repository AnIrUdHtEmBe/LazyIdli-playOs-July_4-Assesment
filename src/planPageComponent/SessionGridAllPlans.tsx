import React from "react";
import "./SessionGridAllPlans.css";

type Session = {
  sessionId: string;
  title: string;
  description: string;
  category: string;
  activityIds: string[];
  status: string;
  scheduledDay: number;
  activities: {
    activityId: string;
    name: string;
    description: string;
    reps: string;
  };
};

type SessionGridProps = {
  sessions: Session[];
};

const columns = 7;
const defaultRows = 4;

const SessionGridAllPlans = ({ sessions }: SessionGridProps) => {
  const heighestNumber =
    sessions?.length > 0 ? Math.max(...sessions.map((s) => s.scheduledDay)) : 0;

  const minBoxes = defaultRows * columns;
  const totalBoxes = Math.max(minBoxes, heighestNumber);
  const rows = Math.ceil(totalBoxes / columns);

  const gridData = Array.from({ length: rows * columns }, (_, index) => {
    const boxNumber = index + 1;
    const session = sessions?.find((s) => s.scheduledDay === boxNumber);
    return { boxNumber, session };
  });

  console.log(gridData);

  return (
    <div className="session-grid">
      {gridData.map(({ boxNumber, session }) => (
        <div
          key={boxNumber}
          className={`session-grid-box ${session ? "has-session" : ""} ${
            session?.status.toLowerCase() || ""
          }`}
        >
          <div className="box-header">
            <div className="box-number">Session {boxNumber}</div>
          </div>

          {session && (
            <div className="session-details">
              <div className="session-title">{session.title}</div>
              <div className="session-category">
                <span></span> {session.category}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SessionGridAllPlans;

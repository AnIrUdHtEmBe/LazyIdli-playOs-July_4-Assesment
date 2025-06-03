import { MinusCircle, PlusCircle } from "lucide-react";
import React from "react";

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

type PlanCreatorGridProps = {
  sessions: Session[];
  blocks?: number;
  selectedSession: Session | null;
  addingSessionToGrid: (day: number) => void;
  deletingSessionFromGrid: (day: number) => void;
};

const PlanCreatorGrid = ({
  sessions,
  blocks,
  selectedSession,
  addingSessionToGrid,
  deletingSessionFromGrid,
}: PlanCreatorGridProps) => {
  const calculatedRows = Math.ceil(blocks / 7);
  const gridData = Array.from({ length: calculatedRows * 7 }, (_, index) => {
    const boxNumber = index + 1;
    const session = sessions?.find((s) => s?.scheduledDay === boxNumber);
    return { boxNumber, session };
  });

  console.log(gridData);
  // console.log(selectedSession);

  return (
    <div className="session-grid">
      {gridData.map(({ boxNumber, session }) => (
        <div
          key={boxNumber}
          className={`session-grid-box ${session ? "has-session" : ""} ${
            session?.status.toLowerCase() || ""
          }`}
        >
          {/* box header */}
          <div className="box-header">
            <div className="box-number">Day {boxNumber} </div>
            <div>
              {session ? (
                <button onClick={() => deletingSessionFromGrid(boxNumber)}>
                  <MinusCircle size={15} className="text-red-600"></MinusCircle>
                </button>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* box content */}
          {session ? (
            <div
              className="session-details"
              onClick={() => {
                if (selectedSession) {
                  addingSessionToGrid(boxNumber);
                }
              }}
            >
              <div className="session-title">{session.title}</div>
              <div className="session-category">
                <span></span> {session.category}
              </div>
            </div>
          ) : (
            selectedSession && (
              <div
                className="h-full flex justify-center items-center"
                onClick={() => {
                  if (selectedSession) {
                    addingSessionToGrid(boxNumber);
                  }
                }}
              >
                <PlusCircle className="text-green-700"></PlusCircle>
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default PlanCreatorGrid;

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
  rows: number;
  editMode?: boolean;
  selectedSession: Session | null;
  onAssignSession: (day: number) => void;
};

const columns = 7;
const defaultRows = 4;

const SessionGridAllPlans = ({
  sessions,
  rows,
  editMode = false,
  selectedSession,
  onAssignSession,
}: SessionGridProps) => {
  const minBoxes = defaultRows * columns;
  const totalBoxes = Math.max(minBoxes, rows);

  const calculatedRows = Math.ceil(totalBoxes / columns);

  const gridData = Array.from(
    { length: calculatedRows * columns },
    (_, index) => {
      const boxNumber = index + 1;
      const session = sessions?.find((s) => s.scheduledDay === boxNumber);
      return { boxNumber, session };
    }
  );

  console.log(gridData);

  return (
    <div className="session-grid">
      {gridData.map(({ boxNumber, session }) => (
        <div
          key={boxNumber}
          className={`session-grid-box ${session ? "has-session" : ""} ${
            session?.status.toLowerCase() || ""
          }`}
          onClick={() => {
            if (editMode && selectedSession) {
              onAssignSession(boxNumber);
            }
          }}
        >
          <div className="box-header">
            <div className="box-number">Day {boxNumber}</div>
          </div>

          {session ? (
            <div className="session-details">
              <div className="session-title">{session.title}</div>
              <div className="session-category">
                <span></span> {session.category}
              </div>
            </div>
          ) : (
            editMode &&
            selectedSession && (
              <div className="placeholder">Click to assign</div>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default SessionGridAllPlans;

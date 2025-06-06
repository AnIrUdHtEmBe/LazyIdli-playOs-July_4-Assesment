import React, { useEffect , useState} from "react";
import { useApiCalls } from "../store/axios";
export default function EventModal({ isOpen, onClose, eventData }) {
  if (!isOpen || !eventData) return null;
  const {getSessionById , getActivityById} = useApiCalls();
  const [details, setDetails] = useState({});
  const getSessionDetails = async (eventData) => {
  try {
    const sessionDetails = await getSessionById(eventData.id);

    const activityDetailsArray = await Promise.all(
      sessionDetails.activityIds.map(async (activityId) => {
        const activityDetails = await getActivityById(activityId);
        return { activityId, activityDetails };
      })
    );

    // Store all activity details in a single object
    sessionDetails.activityDetails = {};
    for (const { activityId, activityDetails } of activityDetailsArray) {
      if (activityDetails) {
        sessionDetails.activityDetails[activityId] = activityDetails;
      }
    }

    console.log("Session Details:", sessionDetails);
    return sessionDetails;

  } catch (error) {
    console.error("Error fetching session details:", error);
    return null;
  }
};


  useEffect(() => {
    const fetchSessionDetails = async () => {
        const res = await getSessionDetails(eventData);
        if (res) {
            setDetails(res);
        } else {
            console.error("Failed to fetch session details");
        }
    };
    fetchSessionDetails();
    
  }
  , []);
  useEffect(() => {
    console.log(details);
  }
  , [details]); 
    
  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-2">{eventData.title}</h2>
        <div className="text-sm text-gray-700 space-y-2">
          {/* <p><strong>Plan ID:</strong> {eventData.extendedProps.planInstanceId}</p> */}
          <p><strong>Plan Name: </strong>{eventData.extendedProps.planTitle}</p>
            {details?.activityDetails && (
                <div>
                <strong>Activities:</strong>
                <ul className="list-disc pl-5">
                    {Object.entries(details.activityDetails).map(
                    ([activityId, activity]) => (
                        <li key={activityId}>
                        {activity.name} : {activity.description}
                        </li>
                    )
                    )}
                </ul>
                </div>
            )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";


// ----------------- TYPES ----------------- //

export type createAssessmentTemplate = {
  name: string;
  questions: {
    questionId: string;
    isRequired: boolean;
  }[];
}

export type Activity_Api_call = {
  activityId?: string;
  name: string,
  description: string,
  reps: string,
  icon?: string
}

export type Session_Api_call = {
  sessionId?: string;
  title: string;
  description: string;
  category: string;
  activityIds?: string[];
  activities?: Activity_Api_call[];
}
export type Customers_Api_call ={
  userId: string;
  name: string;
  age: number;
  gender: string;
  mobile?: string;
  email?: string;
  height?: string;
  weight?: string;
  healthCondition?: string;
  created_on :string;
  updated_on?: string;
  membershipType: string;
  plansAllocated: string[];
  assessments?: string[];
}


// Assessments (dashboard page)
export type Assessment_Api_call = {
  tempelateId: string;
  name: string;
  created_on: string;
  questions: object[];
}


//  assessmentInstance for each user 
export type Assessment_instance_expanded_Api_call = {
  assessmentInstanceId: string;
  tempelateId: string;
  userId: string;
  answers: Object[];
  startedOn: string;
  submittedOn: string;
  nextAssessmentOn: string;
  totalScore: number;
  template: object[];
}


type MCQQuestion = {
  questionId: number;
  questionText: string;
  options: MCQOption[];
};

export type Question_Api_call = {
  created_on: string;
  questionId: string;
  mainText: string;
  answerType: string;
  options?: string[];
}
export type Plan_Api_call = {
  templateId ?: string;
  title : string;
  description : string;
  category : string;
  sessions : object[];
}


export type plans_full_api_call = {
  templateId : string;
  title : string;
  description : string;
  category : string;
  sessionIds : string[];
  sessions : object[];
  status : string;
}


type MCQOption = {
  text: string;
  selected: boolean;
};

type MCQAnswer = {
  questionId: number;
  questionText: string;
  correctOption: string;
};

type Plan = {
  id: number;
  planName: string;
  category: string;
};

type ActivityType = {
  id: number;
  activityType: string;
};


type Activity = {
  id: number;
  activityType: ActivityType[];
  description: string;
  timeInMinutes: number;
};

type Session = {
  id?: number;
  sessionName : string,
  sessionType: string ,
  activities : Activity[],
}

type DataContextType = {
  // customers 

  customers_Api_call: Customers_Api_call[];
  setCustomers_Api_call: Dispatch<SetStateAction<Customers_Api_call[]>>;


  // Assessments -> Dashboard page
  assessments_Api_call: Assessment_Api_call[];
  setAssessments_Api_call: Dispatch<SetStateAction<Assessment_Api_call[]>>;

  // Assessment instance for each user
  assessmentInstance_expanded_Api_call: Assessment_instance_expanded_Api_call[];
  setAssessmentInstance_expanded_Api_call: Dispatch<SetStateAction<Assessment_instance_expanded_Api_call[]>>;

  // plans api call
  plans_full_api_call: plans_full_api_call[];
  setPlans_full_api_call: Dispatch<SetStateAction<plans_full_api_call[]>>;
  

  // plan api call
  plan_api_call: Plan_Api_call[];
  setPlan_api_call: Dispatch<SetStateAction<Plan_Api_call[]>>;

  header: string;
  setHeader: Dispatch<SetStateAction<string>>;
  selectComponent: string;
  setSelectComponent: Dispatch<SetStateAction<string>>;

  mcqAnswers: MCQAnswer[];
  setMcqAnswers: Dispatch<SetStateAction<MCQAnswer[]>>;
  plans: Plan[];
  setPlans: Dispatch<SetStateAction<Plan[]>>;
  questionsForQuestionBank: MCQQuestion[];
  setQuestionsForQuestionBank: Dispatch<SetStateAction<MCQQuestion[]>>;
  activityTypePlan: Activity[];
  setActivityTypePlan: Dispatch<SetStateAction<Activity[]>>;
  sessions: Session[];
  setSessions: Dispatch<SetStateAction<Session[]>>;

  // activity type for plan creation
  activities_api_call : Activity_Api_call[];
  setActivities_api_call: Dispatch<SetStateAction<Activity_Api_call[]>>;

  //questions for api call
  questionsForAPICall: Question_Api_call[];
  setQuestionsForAPICall: Dispatch<SetStateAction<Question_Api_call[]>>

  // sessions for api call
  sessions_api_call: Session_Api_call[];
  setSessions_api_call: Dispatch<SetStateAction<Session_Api_call[]>>;
};

export const DataContext = createContext<DataContextType | undefined>(
  undefined
);

type DataProviderProps = {
  children: ReactNode;
};


// ----------------- DUMMY DATA -----------------


const initialPlans: Plan[] = [
  { id: 1, planName: "Prime Fitness", category: "Fitness" },
  { id: 2, planName: "Golden Health", category: "Sports" },
  { id: 3, planName: "Young Champs", category: "Wellness" },
  { id: 4, planName: "Golden Health", category: "Sports" },
  { id: 5, planName: "Young Champs", category: "Wellness" },
  { id: 6, planName: "Golden Health", category: "Sports" },
  { id: 7, planName: "Young Champs", category: "Wellness" },
  { id: 8, planName: "Custom Plan", category: "Fitness" },
];

const activityTablePlam: Activity[] = [
  {
    id: 1,
    activityType: [
      { id: 1.1, activityType: "Cardio" },
      { id: 1.2, activityType: "Treadmill" },
    ],
    description: "Light cardio session using treadmill",
    timeInMinutes: 30,
  },
  {
    id: 2,
    activityType: [
      { id: 2.1, activityType: "Strength Training" },
      { id: 2.2, activityType: "Bench Press" },
      { id: 2.3, activityType: "Deadlift" },
    ],
    description: "Upper body strength workout focusing on core lifts",
    timeInMinutes: 60,
  },
  {
    id: 3,
    activityType: [
      { id: 3.1, activityType: "Yoga" },
      { id: 3.2, activityType: "Meditation" },
    ],
    description: "Yoga session with guided meditation for stress relief",
    timeInMinutes: 45,
  },
  {
    id: 4,
    activityType: [{ id: 4.1, activityType: "Cycling" }],
    description: "Indoor cycling routine for stamina building",
    timeInMinutes: 40,
  },
  {
    id: 5,
    activityType: [
      { id: 5.1, activityType: "HIIT" },
      { id: 5.2, activityType: "Jump Squats" },
      { id: 5.3, activityType: "Burpees" },
    ],
    description: "High-intensity interval training with bodyweight exercises",
    timeInMinutes: 25,
  },
  {
    id: 6,
    activityType: [
      { id: 6.1, activityType: "Pilates" },
      { id: 6.2, activityType: "Core Stability" },
    ],
    description: "Pilates workout for core strength and posture",
    timeInMinutes: 35,
  },
  {
    id: 7,
    activityType: [
      { id: 7.1, activityType: "Boxing" },
      { id: 7.2, activityType: "Jump Rope" },
    ],
    description: "Boxing drills with jump rope warm-up",
    timeInMinutes: 50,
  },
  {
    id: 8,
    activityType: [
      { id: 8.1, activityType: "Dance Fitness" },
      { id: 8.2, activityType: "Zumba" },
    ],
    description: "Dance-based aerobic session with upbeat music",
    timeInMinutes: 55,
  },
  {
    id: 9,
    activityType: [{ id: 9.1, activityType: "Swimming" }],
    description: "Freestyle swimming for endurance and full-body workout",
    timeInMinutes: 45,
  },
  {
    id: 10,
    activityType: [
      { id: 10.1, activityType: "Cool Down" },
      { id: 10.2, activityType: "Stretching" },
    ],
    description: "Recovery session post intense workout",
    timeInMinutes: 20,
  },
];

const dummySessions: Session[] = [
  {
    id: 1,
    sessionName: "Morning Energy Boost",
    sessionType: "Fitness",
    activities: [
      {
        id: 1,
        activityType: [
          { id: 1.1, activityType: "Cardio" },
          { id: 1.2, activityType: "Treadmill" },
        ],
        description: "Light cardio session using treadmill",
        timeInMinutes: 30,
      },
      {
        id: 2,
        activityType: [
          { id: 2.1, activityType: "Strength Training" },
          { id: 2.2, activityType: "Bench Press" },
        ],
        description: "Quick upper body workout",
        timeInMinutes: 25,
      },
    ],
  },
  {
    id: 2,
    sessionName: "Evening Flex & Flow",
    sessionType: "Wellness",
    activities: [
      {
        id: 3,
        activityType: [
          { id: 3.1, activityType: "Yoga" },
          { id: 3.2, activityType: "Meditation" },
        ],
        description: "Yoga session with guided meditation",
        timeInMinutes: 45,
      },
      {
        id: 10,
        activityType: [
          { id: 10.1, activityType: "Cool Down" },
          { id: 10.2, activityType: "Stretching" },
        ],
        description: "Cool down routine",
        timeInMinutes: 20,
      },
    ],
  },
  {
    id: 3,
    sessionName: "Total Burn",
    sessionType: "Sports",
    activities: [
      {
        id: 5,
        activityType: [
          { id: 5.1, activityType: "HIIT" },
          { id: 5.2, activityType: "Jump Squats" },
          { id: 5.3, activityType: "Burpees" },
        ],
        description: "High-intensity interval training",
        timeInMinutes: 25,
      },
      {
        id: 4,
        activityType: [{ id: 4.1, activityType: "Cycling" }],
        description: "Indoor cycling for stamina",
        timeInMinutes: 40,
      },
    ],
  },
  {
    id: 4,
    sessionName: "Power Core Session",
    sessionType: "Fitness",
    activities: [
      {
        id: 6,
        activityType: [
          { id: 6.1, activityType: "Pilates" },
          { id: 6.2, activityType: "Core Stability" },
        ],
        description: "Pilates for posture and core strength",
        timeInMinutes: 35,
      },
      {
        id: 2,
        activityType: [
          { id: 2.1, activityType: "Strength Training" },
          { id: 2.3, activityType: "Deadlift" },
        ],
        description: "Deadlift session for core and back",
        timeInMinutes: 30,
      },
    ],
  },
  {
    id: 5,
    sessionName: "Fun Fit Friday",
    sessionType: "Fitness",
    activities: [
      {
        id: 8,
        activityType: [
          { id: 8.1, activityType: "Dance Fitness" },
          { id: 8.2, activityType: "Zumba" },
        ],
        description: "Dance-based cardio fun",
        timeInMinutes: 55,
      },
      {
        id: 9,
        activityType: [{ id: 9.1, activityType: "Swimming" }],
        description: "Swimming for endurance",
        timeInMinutes: 45,
      },
    ],
  },
];

// ----------------- PROVIDER -----------------

export const DataProvider = ({ children }: DataProviderProps) => {
  // customers
  const [customers_Api_call , setCustomers_Api_call] = useState<Customers_Api_call[]>([]);

  // Assessments -> dashboard page
  const [assessments_Api_call , setAssessments_Api_call] = useState<Assessment_Api_call[]>([]);

  //questions
  const [questionsForAPICall, setQuestionsForAPICall] = useState<Question_Api_call[]>([]);
  // Assessment instance for each user
  const [assessmentInstance_expanded_Api_call , setAssessmentInstance_expanded_Api_call] = useState<Assessment_instance_expanded_Api_call[]>([]);
  
  // activities api call
  const [activities_api_call, setActivities_api_call] = useState<Activity_Api_call[]>([]);

  // plans api call
  const [plans_full_api_call, setPlans_full_api_call] = useState<plans_full_api_call[]>([]);
 

  const [header, setHeader] = useState<string>("Customer Dashboard");
  const [selectComponent, setSelectComponent] = useState<string>("dashboard");

  const [plans, setPlans] = useState<Plan[]>(initialPlans);

  const [activityTypePlan, setActivityTypePlan] =
    useState<Activity[]>(activityTablePlam);

  const [sessions , setSessions] = useState<Session[]>(dummySessions);
  const [sessions_api_call , setSessions_api_call] = useState<Session_Api_call[]>([]);

  const [plan_api_call , setPlan_api_call] = useState<Plan_Api_call[]>([]);
  return (
    <DataContext.Provider
      value={{
        // customers ---
        // customers,
        // setCustomers,
        customers_Api_call,
        setCustomers_Api_call,
        // customers ---

        // questions for api call
        questionsForAPICall,
        setQuestionsForAPICall,


        // Assessments (dashboard page)
        assessments_Api_call,
        setAssessments_Api_call,
        // Assessments (dashboard page)

        // Assessment instance for each user
        assessmentInstance_expanded_Api_call,
        setAssessmentInstance_expanded_Api_call,


        //activities 
        activities_api_call,
        setActivities_api_call,

        
        // plans api call
        plans_full_api_call,
        setPlans_full_api_call,
        // plans api call


        header,
        setHeader,
        selectComponent,
        setSelectComponent,

        plans,
        setPlans,

        activityTypePlan,
        setActivityTypePlan,
        sessions,
        setSessions,

        // sessions for api call
        sessions_api_call,
        setSessions_api_call,

        // plan api call
        plan_api_call,
        setPlan_api_call,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

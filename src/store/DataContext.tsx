import { Male } from "@mui/icons-material";
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


// Assessment submission
export type Assessment_submission_Api_call = {
  questionId: string;
  answer: string;
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
  sessionName : String,
  sessionType: string ,
  activities : Activity[],
}

type DataContextType = {
  // customers 
  // customers: Customer[];
  // setCustomers: Dispatch<SetStateAction<Customer[]>>;

  customers_Api_call: Customers_Api_call[];
  setCustomers_Api_call: Dispatch<SetStateAction<Customers_Api_call[]>>;


  // Assessments -> Dashboard page
  assessments_Api_call: Assessment_Api_call[];
  setAssessments_Api_call: Dispatch<SetStateAction<Assessment_Api_call[]>>;

  // Assessment instance for each user
  assessmentInstance_expanded_Api_call: Assessment_instance_expanded_Api_call[];
  setAssessmentInstance_expanded_Api_call: Dispatch<SetStateAction<Assessment_instance_expanded_Api_call[]>>;

  // Assessment submission
  assessmentSubmission_Api_call: Assessment_submission_Api_call[];
  setAssessmentSubmission_Api_call: Dispatch<SetStateAction<Assessment_submission_Api_call[]>>;


  header: string;
  setHeader: Dispatch<SetStateAction<string>>;
  selectComponent: string;
  setSelectComponent: Dispatch<SetStateAction<string>>;
  mcqQuestions: MCQQuestion[];
  setMcqQuestions: Dispatch<SetStateAction<MCQQuestion[]>>;
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

  //questions for api call
  questionsForAPICall: Question_Api_call[];
  setQuestionsForAPICall: Dispatch<SetStateAction<Question_Api_call[]>>
};

export const DataContext = createContext<DataContextType | undefined>(
  undefined
);

type DataProviderProps = {
  children: ReactNode;
};


// ----------------- DUMMY DATA -----------------

const QuestionForQuestionBank: MCQQuestion[] = [
  {
    questionId: 1,
    questionText: "What is the capital of France?",
    options: [
      { text: "Paris", selected: false },
      { text: "Berlin", selected: false },
      { text: "Madrid", selected: false },
      { text: "Rome", selected: false },
    ],
  },
  {
    questionId: 2,
    questionText: "Which planet is known as the Red Planet?",
    options: [
      { text: "Earth", selected: false },
      { text: "Mars", selected: false },
      { text: "Jupiter", selected: false },
      { text: "Venus", selected: false },
    ],
  },
  {
    questionId: 3,
    questionText: "What is the largest ocean on Earth?",
    options: [
      { text: "Atlantic Ocean", selected: false },
      { text: "Indian Ocean", selected: false },
      { text: "Pacific Ocean", selected: false },
      { text: "Arctic Ocean", selected: false },
    ],
  },
  {
    questionId: 4,
    questionText:
      "Which language is primarily used for Android app development?",
    options: [
      { text: "Swift", selected: false },
      { text: "Kotlin", selected: false },
      { text: "JavaScript", selected: false },
      { text: "Python", selected: false },
    ],
  },
  {
    questionId: 5,
    questionText: "Which of the following is a JavaScript framework?",
    options: [
      { text: "Laravel", selected: false },
      { text: "Django", selected: false },
      { text: "React", selected: false },
      { text: "Spring", selected: false },
    ],
  },
  {
    questionId: 6,
    questionText: "Who developed the theory of relativity?",
    options: [
      { text: "Isaac Newton", selected: false },
      { text: "Albert Einstein", selected: false },
      { text: "Nikola Tesla", selected: false },
      { text: "Galileo Galilei", selected: false },
    ],
  },
  {
    questionId: 7,
    questionText: "Which data structure uses LIFO (Last In First Out)?",
    options: [
      { text: "Queue", selected: false },
      { text: "Linked List", selected: false },
      { text: "Stack", selected: false },
      { text: "Tree", selected: false },
    ],
  },
  {
    questionId: 8,
    questionText: "What does HTML stand for?",
    options: [
      { text: "HyperText Markup Language", selected: false },
      { text: "HighText Machine Language", selected: false },
      { text: "Hyperlinking and Text Marking Language", selected: false },
      { text: "Hyper Transfer Markup Language", selected: false },
    ],
  },
  {
    questionId: 9,
    questionText: "Which one is a NoSQL database?",
    options: [
      { text: "MySQL", selected: false },
      { text: "PostgreSQL", selected: false },
      { text: "MongoDB", selected: false },
      { text: "SQLite", selected: false },
    ],
  },
  {
    questionId: 10,
    questionText: "In which year did World War II end?",
    options: [
      { text: "1942", selected: false },
      { text: "1945", selected: false },
      { text: "1939", selected: false },
      { text: "1950", selected: false },
    ],
  },
  {
    questionId: 11,
    questionText: "Which company developed the TypeScript language?",
    options: [
      { text: "Google", selected: false },
      { text: "Facebook", selected: false },
      { text: "Microsoft", selected: false },
      { text: "Amazon", selected: false },
    ],
  },
  {
    questionId: 12,
    questionText: "Which method is used to fetch data in React?",
    options: [
      { text: "getData()", selected: false },
      { text: "useFetch()", selected: false },
      { text: "useEffect()", selected: false },
      { text: "fetch()", selected: false },
    ],
  },
  {
    questionId: 13,
    questionText: "CSS stands for?",
    options: [
      { text: "Cascading Style Sheets", selected: false },
      { text: "Colorful Style Sheets", selected: false },
      { text: "Computer Style Sheets", selected: false },
      { text: "Creative Style Sheets", selected: false },
    ],
  },
  {
    questionId: 14,
    questionText: "What is the square root of 144?",
    options: [
      { text: "10", selected: false },
      { text: "11", selected: false },
      { text: "12", selected: false },
      { text: "13", selected: false },
    ],
  },
  {
    questionId: 15,
    questionText: "Which planet has the most moons?",
    options: [
      { text: "Earth", selected: false },
      { text: "Jupiter", selected: false },
      { text: "Mars", selected: false },
      { text: "Saturn", selected: false },
    ],
  },
];

const initialMCQQuestions: MCQQuestion[] = [
  {
    questionId: 1,
    questionText: "What is the capital of France?",
    options: [
      { text: "Paris", selected: false },
      { text: "Berlin", selected: false },
      { text: "Madrid", selected: false },
      { text: "Rome", selected: false },
    ],
  },
  {
    questionId: 2,
    questionText: "Which planet is known as the Red Planet?",
    options: [
      { text: "Earth", selected: false },
      { text: "Mars", selected: false },
      { text: "Jupiter", selected: false },
      { text: "Venus", selected: false },
    ],
  },
  {
    questionId: 3,
    questionText: "What is the largest ocean on Earth?",
    options: [
      { text: "Atlantic Ocean", selected: false },
      { text: "Indian Ocean", selected: false },
      { text: "Pacific Ocean", selected: false },
      { text: "Arctic Ocean", selected: false },
    ],
  },
  {
    questionId: 4,
    questionText:
      "Which language is primarily used for Android app development?",
    options: [
      { text: "Swift", selected: false },
      { text: "Kotlin", selected: false },
      { text: "JavaScript", selected: false },
      { text: "Python", selected: false },
    ],
  },
  {
    questionId: 5,
    questionText: "Which of the following is a JavaScript framework?",
    options: [
      { text: "Laravel", selected: false },
      { text: "Django", selected: false },
      { text: "React", selected: false },
      { text: "Spring", selected: false },
    ],
  },
];

const initialMCQAnswers: MCQAnswer[] = [
  {
    questionId: 1,
    questionText: "What is the capital of France?",
    correctOption: "Paris",
  },
  {
    questionId: 2,
    questionText: "Which planet is known as the Red Planet?",
    correctOption: "Mars",
  },
  {
    questionId: 3,
    questionText: "What is the largest ocean on Earth?",
    correctOption: "Pacific Ocean",
  },
  {
    questionId: 4,
    questionText:
      "Which language is primarily used for Android app development?",
    correctOption: "Kotlin",
  },
  {
    questionId: 5,
    questionText: "Which of the following is a JavaScript framework?",
    correctOption: "React",
  },
  {
    questionId: 5,
    questionText: "Which of the following is a JavaScript framework?",
    correctOption: "React",
  },
  {
    questionId: 5,
    questionText: "Which of the following is a JavaScript framework?",
    correctOption: "React",
  },
  {
    questionId: 5,
    questionText: "Which of the following is a JavaScript framework?",
    correctOption: "React",
  },
  {
    questionId: 5,
    questionText: "Which of the following is a JavaScript framework?",
    correctOption: "React",
  },
  {
    questionId: 5,
    questionText: "Which of the following is a JavaScript framework?",
    correctOption: "React",
  },
];

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
  // const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [customers_Api_call , setCustomers_Api_call] = useState<Customers_Api_call[]>([]);

  // Assessments -> dashboard page
  const [assessments_Api_call , setAssessments_Api_call] = useState<Assessment_Api_call[]>([]);

  //questions
  const [questionsForAPICall, setQuestionsForAPICall] = useState<Question_Api_call[]>([]);
  // Assessment instance for each user
  const [assessmentInstance_expanded_Api_call , setAssessmentInstance_expanded_Api_call] = useState<Assessment_instance_expanded_Api_call[]>([]);
  
// assessment submission
  const [assessmentSubmission_Api_call , setAssessmentSubmission_Api_call] = useState<Assessment_submission_Api_call[]>([]);
  const [header, setHeader] = useState<string>("Customer Dashboard");
  const [selectComponent, setSelectComponent] = useState<string>("dashboard");
  const [mcqQuestions, setMcqQuestions] =
    useState<MCQQuestion[]>(initialMCQQuestions);
  const [mcqAnswers, setMcqAnswers] = useState<MCQAnswer[]>(initialMCQAnswers);
  const [plans, setPlans] = useState<Plan[]>(initialPlans);

  const [questionsForQuestionBank, setQuestionsForQuestionBank] = useState<
    MCQQuestion[]
  >(QuestionForQuestionBank);
  const [activityTypePlan, setActivityTypePlan] =
    useState<Activity[]>(activityTablePlam);

  const [sessions , setSessions] = useState<Session[]>(dummySessions);

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

        // Assessment submission
        assessmentSubmission_Api_call,
        setAssessmentSubmission_Api_call,
        // Assessment submission


        header,
        setHeader,
        selectComponent,
        setSelectComponent,
        mcqQuestions,
        setMcqQuestions,
        mcqAnswers,
        setMcqAnswers,
        plans,
        setPlans,
        questionsForQuestionBank,
        setQuestionsForQuestionBank,
        activityTypePlan,
        setActivityTypePlan,
        sessions,
        setSessions,
       
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

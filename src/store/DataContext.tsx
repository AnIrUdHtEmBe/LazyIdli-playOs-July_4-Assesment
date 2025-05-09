import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// ----------------- TYPES -----------------
type Customer = {
  id: number;
  name: string;
  age: number;
  joinedOn: string;
  phone: string;
  membership: string;
  lastAssessed: string;
  plan: string;
};

type Assessment = {
  id: number;
  name: string;
  questionCount: string;
};

type MCQQuestion = {
  questionId: number;
  questionText: string;
  options: MCQOption[];
};

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
  customers: Customer[];
  setCustomers: Dispatch<SetStateAction<Customer[]>>;
  assessments: Assessment[];
  setAssessments: Dispatch<SetStateAction<Assessment[]>>;
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
};

export const DataContext = createContext<DataContextType | undefined>(
  undefined
);

type DataProviderProps = {
  children: ReactNode;
};

// ----------------- DUMMY DATA -----------------



const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Brandon",
    age: 18,
    joinedOn: "2025-05-20", // YYYY-MM-DD
    phone: "1234567890",
    membership: "Union Select",
    lastAssessed: "2025-03-27",
    plan: "Golden Health",
  },
  {
    id: 2,
    name: "Davis",
    age: 20,
    joinedOn: "2025-03-21",
    phone: "0987654321",
    membership: "Union Standard",
    lastAssessed: "2025-03-28",
    plan: "Young Champs",
  },
  {
    id: 3,
    name: "Talen",
    age: 21,
    joinedOn: "2025-03-22",
    phone: "5674321890",
    membership: "Union Classic",
    lastAssessed: "2025-03-28",
    plan: "Prime Health",
  },
  {
    id: 4,
    name: "Martin",
    age: 22,
    joinedOn: "2025-03-23",
    phone: "1209348567",
    membership: "Union Plus",
    lastAssessed: "-",
    plan: "-",
  },
  {
    id: 5,
    name: "Ahmad",
    age: 28,
    joinedOn: "2025-03-24",
    phone: "5643782190",
    membership: "Union Prime",
    lastAssessed: "-",
    plan: "-",
  },
  {
    id: 6,
    name: "Brandon",
    age: 18,
    joinedOn: "2025-03-20", // YYYY-MM-DD
    phone: "1234567890",
    membership: "Union Select",
    lastAssessed: "2025-03-27",
    plan: "Golden Health",
  },
  {
    id: 7,
    name: "Davis",
    age: 20,
    joinedOn: "2025-03-21",
    phone: "0987654321",
    membership: "Union Standard",
    lastAssessed: "2025-03-28",
    plan: "Young Champs",
  },
  {
    id: 8,
    name: "Talen",
    age: 21,
    joinedOn: "2025-03-22",
    phone: "5674321890",
    membership: "Union Classic",
    lastAssessed: "2025-03-28",
    plan: "Prime Health",
  },
  {
    id: 9,
    name: "Martin",
    age: 22,
    joinedOn: "2025-03-23",
    phone: "1209348567",
    membership: "Union Plus",
    lastAssessed: "-",
    plan: "-",
  },
  {
    id: 10,
    name: "Ahmad",
    age: 28,
    joinedOn: "2025-03-24",
    phone: "5643782190",
    membership: "Union Prime",
    lastAssessed: "-",
    plan: "-",
  },
  {
    id: 11,
    name: "Brandon",
    age: 18,
    joinedOn: "2025-05-20", // YYYY-MM-DD
    phone: "1234567890",
    membership: "Union Select",
    lastAssessed: "2025-03-27",
    plan: "Golden Health",
  },
  {
    id: 12,
    name: "Brandon",
    age: 18,
    joinedOn: "2025-05-20", // YYYY-MM-DD
    phone: "1234567890",
    membership: "Union Select",
    lastAssessed: "2025-03-27",
    plan: "Golden Health",
  },
  {
    id: 13,
    name: "Brandon",
    age: 18,
    joinedOn: "2025-05-20", // YYYY-MM-DD
    phone: "1234567890",
    membership: "Union Select",
    lastAssessed: "2025-03-27",
    plan: "Golden Health",
  },
  {
    id: 14,
    name: "Brandon",
    age: 18,
    joinedOn: "2025-05-20", // YYYY-MM-DD
    phone: "1234567890",
    membership: "Union Select",
    lastAssessed: "2025-03-27",
    plan: "Golden Health",
  },
  {
    id: 15,
    name: "Brandon",
    age: 18,
    joinedOn: "2025-05-20", // YYYY-MM-DD
    phone: "1234567890",
    membership: "Union Select",
    lastAssessed: "2025-03-27",
    plan: "Golden Health",
  },
  {
    id: 16,
    name: "Davis",
    age: 20,
    joinedOn: "2025-03-21",
    phone: "0987654321",
    membership: "Union Standard",
    lastAssessed: "2025-03-28",
    plan: "Young Champs",
  },
  {
    id: 17,
    name: "Davis",
    age: 20,
    joinedOn: "2025-03-21",
    phone: "0987654321",
    membership: "Union Standard",
    lastAssessed: "2025-03-28",
    plan: "Young Champs",
  },
  {
    id: 18,
    name: "Davis",
    age: 20,
    joinedOn: "2025-03-21",
    phone: "0987654321",
    membership: "Union Standard",
    lastAssessed: "2025-03-28",
    plan: "Young Champs",
  },
  {
    id: 19,
    name: "Davis",
    age: 20,
    joinedOn: "2025-03-21",
    phone: "0987654321",
    membership: "Union Standard",
    lastAssessed: "2025-03-28",
    plan: "Young Champs",
  },
  {
    id: 20,
    name: "Davis",
    age: 20,
    joinedOn: "2025-03-21",
    phone: "0987654321",
    membership: "Union Standard",
    lastAssessed: "2025-03-28",
    plan: "Young Champs",
  },
  {
    id: 27,
    name: "Davis",
    age: 20,
    joinedOn: "2025-03-21",
    phone: "0987654321",
    membership: "Union Standard",
    lastAssessed: "2025-03-28",
    plan: "Young Champs",
  },
  {
    id: 37,
    name: "Davis",
    age: 20,
    joinedOn: "2025-03-21",
    phone: "0987654321",
    membership: "Union Standard",
    lastAssessed: "2025-03-28",
    plan: "Young Champs",
  },

  {
    id: 47,
    name: "Davis",
    age: 20,
    joinedOn: "2025-03-21",
    phone: "0987654321",
    membership: "Union Standard",
    lastAssessed: "2025-03-28",
    plan: "Young Champs",
  },
  {
    id: 57,
    name: "Davis",
    age: 20,
    joinedOn: "2025-03-21",
    phone: "0987654321",
    membership: "Union Standard",
    lastAssessed: "2025-03-28",
    plan: "Young Champs",
  },
];


const initialAssessments: Assessment[] = [
  { id: 1, name: "Prime Health", questionCount: "30 Q" },
  { id: 2, name: "Golden Health", questionCount: "50 Q" },
  { id: 3, name: "Young Champs", questionCount: "20 Q" },
  { id: 4, name: "Assessment 4", questionCount: "" },
  { id: 5, name: "Assessment 5", questionCount: "" },
  { id: 6, name: "Assessment 6", questionCount: "" },
  { id: 7, name: "Assessment 7", questionCount: "" },
];

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
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [assessments, setAssessments] =
    useState<Assessment[]>(initialAssessments);
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
        customers,
        setCustomers,
        assessments,
        setAssessments,
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

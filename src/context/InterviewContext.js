import { createContext, useContext, useState } from "react";

const InterviewContext = createContext();

const InterviewContextProvider = ({ children }) => {
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [questionNaviagte, setQuestionNavigate] = useState(false);
  const [speechtext, setSpeechText] = useState("");
  const [thankyouPage,setThankyouPage]=useState(false);


  const [generatedQuestion, setGeneratedQuestion] = useState([]);
  const [user, setUser] = useState(null);

  const [userName, setUserName] = useState("User");
  const [result, setResult] = useState([]);

  //for side bar code language selection and code
  const [submitedCode, setSubmitedCode] = useState(null);
  const [language, setLanguage] = useState("cpp");



   const [role,setRole]=useState("");
   const [aiMode,setAiMode]=useState(false);

  // TESTING STATE FOR DIRECT AVATAR
  // const [generatedQuestion, setGeneratedQuestion] = useState([
  //   {
  //     question:"What is overfitting, and how can you prevent it ?",
  //     timing:180
  //   },
  //   {question:"What is the difference between L1 and L2 regularization ?",
  //     timing:180
  //   },
  //   {question:"How does gradient descent work?",
  //     timing:180
  //   },
  //   {question:"What is Machine Learning ?",
  //     timing:180
  //   },
  //   {question:"What are hyperparameters, and how do you tune them ?",
  //     timing:180
  //   },
  //   {
  //     question:"What is overfitting, and how can you prevent it ?",
  //     timing:180
  //   },
  //   {
  //     question:"What is overfitting, and how can you prevent it ?",
  //     timing:180
  //   },
  //   {
  //     question:"What is overfitting, and how can you prevent it ?",
  //     timing:180
  //   },
  //   {
  //     question:"What is overfitting, and how can you prevent it ?",
  //     timing:180
  //   },
  //   {
  //     question:"What is overfitting, and how can you prevent it ?",
  //     timing:180
  //   },

  // ]);
  // const [user, setUser] = useState({_id:1,fullName:"vivek yadav"});



  return (
    <InterviewContext.Provider
      value={{
        submitedCode,setSubmitedCode,language,setLanguage,
        interviewOpen,
        setInterviewOpen,
        questionNaviagte,
        setQuestionNavigate,
        speechtext,
        setSpeechText,
        setGeneratedQuestion,
        generatedQuestion,
        user,
        setUser,
        setResult,
        result,
        userName,
        setUserName,
        setThankyouPage,
        thankyouPage,
        role,setRole,aiMode,setAiMode
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

// Custom hook to consume the context
const useInterviewStart = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error(
      "useInterviewStart must be used within an InterviewContextProvider"
    );
  }
  return context;
};

export { InterviewContextProvider, useInterviewStart };

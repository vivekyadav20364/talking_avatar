
import React, { useState, useEffect, useRef } from "react";
import { useInterviewStart } from "../context/InterviewContext";
import { useTranscriptionStatus } from "../context/SpeechRecognizationContext";
import axios from "axios";
import { baseUrl,Base_Url_Landing_Page_Frontend } from "../utils/baseUri";
import { Backdrop, Dialog, DialogActions, DialogContent, DialogTitle,Button, Box,Modal, Typography} from "@mui/material";
import { toast } from "react-toastify";
import WarningIcon from "@mui/icons-material/Warning"; // Import the warning icon
import Warning from "@mui/icons-material/Warning";
import { useNavigate } from "react-router-dom";

const InterviewFullyAI = ({ setText,speak,setSpeak }) => {
  const {
    interviewOpen,
    setInterviewOpen,
    speechtext,
    setSpeechText,
    // questionNaviagte,
    // setQuestionNavigate,
    // generatedQuestion,
    user,
    setResult,
    submitedCode,
    setSubmitedCode,
    setThankyouPage,
    role
  } = useInterviewStart();
//   const questions = generatedQuestion;

//   const totalCoin=generatedQuestion?.length*10;


  // State to hold interview data for sending to server
  const [interviewData, setInterviewData] = useState([]);

  const { stopRecording, startRecording } = useTranscriptionStatus();

  const [currentQuestion, setCurrentQuestion] = useState(`Hello ${user?.fullName} Please Start with a brief introduction about yourself`);
  const [remainingTime, setRemainingTime] = useState(
     300
  );
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isInterviewFinished, setIsInterviewFinished] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [totalQestion,setTotalQuestion]=useState(10);

  const [loading,setLoading]=useState(false);

  const intervalRef = useRef(null);

  const [showWarning, setShowWarning] = useState(false); // Control the display of the warning
  const [warningCount, setWarningCount] = useState(0); // Track warnings
  
  const navigate=useNavigate();

  // Add fullscreen change listeners
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (isInterviewStarted && !document.fullscreenElement) {
        // User has exited fullscreen, show warning
        setWarningCount((prev) => prev + 1);
        setShowWarning(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isInterviewStarted]);



  useEffect(() => {
    // Start the interview when interviewOpen becomes true from context
    if (interviewOpen) {
     // console.log("Called UseEffect=======>");
      setIsInterviewStarted(true);
      setText(currentQuestion); // Set text for the first question
      setSpeak(true);
      setRemainingTime(300); // Set the initial remaining time
      setIsTimerRunning(true); // Start the timer for the first question
      startRecording();
      enterFullScreen(); // Enter fullscreen mode when the interview starts

    }
  }, [interviewOpen]);

  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(intervalRef.current);
            handleNextQuestion();
            return 0; // Ensure timer doesn't go below 0
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
  
    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, [isTimerRunning, currentQuestion]);
    
  useEffect(() => {

    if (isInterviewFinished) {
      sendInterviewDataToServer();
    }
  }, [isInterviewFinished]);


  useEffect(() => {
    if (isInterviewStarted && !isInterviewFinished && speak === false) {
      // Ensure speaking is only triggered when needed and avoids duplicate triggers
      //console.log("Current Question's speak setting", questions[currentQuestion]?.question);
      setText(currentQuestion || "");
      setSpeak(true);  // Trigger speaking of the updated text
    }
  }, [currentQuestion, isInterviewStarted, isInterviewFinished, speak]);
  

    // Function to save interview data for each question in a state
  const saveInterviewData = (questionIndex, question, speechText,submitedCode) => {
    setInterviewData((prevData) => [
      ...prevData,
      { questionIndex, question, speechText,submitedCode },
    ]);
  };

  //NEW HANDLENEXT FUNCTION


const sendInterviewDataToServer = async () => {
    setPageLoading(true);
    try {
      const currentUserId = user?._id;
      if (!currentUserId) {
        toast.error("User not found",{
          position: "top-right",
          autoClose: 3000,
        });
        setPageLoading(false);
        return;
      }
  
      const response = await axios.post(
        `${baseUrl}/api/questions/evaluate-answer`,
        { interviewData, currentUserId,totalCoin }
      );
      // console.log("Response from server evaluate answer", response.data);
      setResult(response.data);
      toast.success("Check your result on Dashboard",{
        position: "top-right",
        autoClose: 3000,
      });
      
      setPageLoading(false);
      setThankyouPage(true);
      // Redirect user to another website after 2 seconds
      setTimeout(() => {
        navigate("/interview-completed");
      }, 3000);  // Delay of 3000 milliseconds (2 seconds)
  
    } catch (error) {
      console.log(error);
      toast.error("Error Occurred while submitting",{
        position: "top-right",
        autoClose: 3000,
      });
      setPageLoading(false);
    }
  };
  
  console.log("SAVING INTERVIEW DATA",interviewData);

  const handleNextQuestion = async() => {
    setLoading(true);
    
    const resp=await axios.post("http://localhost:8080/api/fully-ai/next-question",{prevQuestion:currentQuestion,userResponse:speechtext,role:role})
    console.log("FULL AI RESP",resp);
    
      setInterviewData([...interviewData,{question:currentQuestion,feedback:resp?.data?.suggestion,score:resp?.data?.score}])
      if(resp){
        setTotalQuestion(totalQestion-1);
      }
      // Move to the next question
      setCurrentQuestion(resp?.data?.nextQuestion || "sorry some error occured");
      setRemainingTime(60);
  
      // Delay speak trigger until the question changes
      stopRecording();
      setSpeechText("");
      setSpeak(false); // Reset speaking state
      startRecording();
      setSubmitedCode("");
    


       
      // setIsInterviewFinished(true);
      // setIsTimerRunning(false);
      // setInterviewOpen(false);
      // stopRecording();
      // setSpeechText("");
    }
  

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };


  const enterFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
    setShowWarning(false); // Hide warning when entering fullscreen
  };  

  return (
    <div className="h-full flex flex-col justify-start relative ">
      <Backdrop open={pageLoading} style={{ zIndex: 1300, color: "#fff" }}>
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 w-full h-full rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div>
            </div>
            <p className="mt-4 text-lg font-semibold text-blue-600">
              EZSync calculating your score, please wait...
            </p>
            <p className="mt-2 text-sm text-black italic">
              Great things take time. We're carefully crafting your results...
            </p>
          </div>
        </div>
      </Backdrop>


      {/* Backdrop for the blur effect * and  Warning Modal */}
      <Backdrop
        open={showWarning}
        sx={{ zIndex: 999, backdropFilter: "blur(10px)" }}
      />

      <Dialog
        open={showWarning}
        onClose={() => {}} // Prevent closing by clicking outside
        aria-labelledby="warning-modal-title"
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "10px",
            padding: "20px",
            backgroundColor: "#ffebee", // Light red background
            textAlign: "center",
          },
        }}
      >
        <DialogTitle id="warning-modal-title">
          <WarningIcon sx={{ fontSize: 80, color: "#d32f2f" }} />
          <Typography variant="h6" sx={{ color: "#d32f2f", mt: 2 }}>
            Warning!
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please return to fullscreen mode to continue the interview.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Warnings: {warningCount}
          </Typography>

          <Button
            variant="contained"
            color="error"
            onClick={enterFullScreen}
            sx={{
              backgroundColor: "#d32f2f",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            Return to Fullscreen
          </Button>
        </DialogContent>
      </Dialog>


      <div className="p-2 text-center flex flex-row justify-between items-center ">
        <h2 className="text-lg font-semibold text-white">
          Question:{" "}
          {isInterviewStarted && !isInterviewFinished && (
            <span>
              {/* {currentQuestion + 1}/{questions.length} */}
              {/* {currentQuestion} */}
            </span>
          )}
        </h2>
        <h3 className="text-white">
          Time Remaining:
          {isInterviewStarted && !isInterviewFinished ? (
            <span className="px-2">{formatTime(remainingTime)}</span>
          ) : (
            <span className="px-1">0:00</span>
          )}
        </h3>
      </div>

      <div className="bg-[#182737] overflow-auto flex flex-col p-2 flex-1 ">
        {!interviewOpen && !isInterviewFinished && (
          <div className="flex flex-col justify-center items-center h-full">
            <h2 className="text-lg ">Waiting for your interview to start!😊</h2>
          </div>
        )}

        {isInterviewFinished ? (
          <div className="flex flex-col justify-center items-center h-full">
            <h2 className="text-lg ">Thank you</h2>
            <h2 className="text-lg ">Your Interview Finished!😊</h2>
          </div>
        ) : (
          <>
            {isInterviewStarted && (
              <>
                <h2 className="text-white">
                  <span className="text-lg">Question:-</span>{" "}
                  {currentQuestion}
                </h2>

                <div className="flex flex-row gap-x-3 justify-start items-end h-full">
                  {isTimerRunning && (
                    <div className="flex flex-row justify-end items-center w-full">
                      <button
                        className=" bg-green-600 text-white py-2 px-4 rounded inline-block font-semibold hover:bg-green-500 transition-colors duration-75 "
                        onClick={handleNextQuestion}
                      >
                        Next Question
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewFullyAI;
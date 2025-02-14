//NOW MAKING 3 STEP MODAL

import React, { useState, useEffect } from "react";
import QuestionTypeSelection from "./QuestionTypeSelection";
import PermissionModal from "./PermissionModal";
import PhotoCapture from "./PhotoCapture";
import VoiceRecorder from "./VoiceRecorder";
import { baseUrl } from "../../utils/baseUri";
import { toast } from "react-toastify";
import { useInterviewStart } from "../../context/InterviewContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import API from "../../utils/api";

const MultiStepModal = ({ open, handleClose }) => {
  const { user, setGeneratedQuestion, generatedQuestion,setRole, setAiMode } = useInterviewStart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [existingQuestions, setExistingQuestions] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [voiceUrl, setVoiceUrl] = useState(null);
  const [isChecked,setIsChecked]=useState(false);
  const [publicIdImage,setPublicIdImage]=useState(null);
  const [publicIdVoice,setPublicIdVoice]=useState(null);
  const [MediaReportLoading,setMediaReportLoading]=useState(false);

 // console.log("Photo url:",photoUrl)
  const quotes = [
    "EZSync, the best AI for interviews.",
    "Preparing your questions with advanced algorithms...",
    "Enhance your hiring process with EZSync AI...",
    "Crafting tailored interview questions just for you...",
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentQuote((prevQuote) => (prevQuote + 1) % quotes.length);
      }, 3000); // Change quote every 3 seconds
      return () => clearInterval(interval);
    }
  }, [loading, quotes.length]);

  useEffect(() => {
    if (open && user?._id) {
      checkForExistingQuestions(user._id);
    }
  }, [open, user]);

  const checkForExistingQuestions = async () => {
    try {
      setLoading(true);
      const currentUserId = user._id;
      if (!currentUserId) {
        toast.error("User not found",{
          position: "top-right",
          autoClose: 3000,
        });
        setLoading(false);
        return;
      }

      const response = await API.get(
        `${baseUrl}/api/questions/previous-question?currentUserId=${currentUserId}`
      );
      // console.log("Previously Generated Question", response.data);

      if (response) {
        setExistingQuestions(response.data.question);
      }
      setLoading(false);
    } catch (error) {
     // console.error("Error checking for existing questions:", error);
      toast.error("Failed to check for existing questions.",{
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
    }
  };

  const handleContinueWithExisting = () => {
    if (existingQuestions) {
      setGeneratedQuestion(existingQuestions);
      toast.success("Loaded previously generated questions!",{
        position: "top-right",
        autoClose: 3000,
      });
      setStep(step + 1);
    }
  };

  function toCamelCase(str) {

    //console.log("Upcomming is:",str);

    if(str==="C++") return "c++";
    else if(str==="DevOps") return "DevOps"
    return str
      .toLowerCase() // Convert the string to lowercase
      .replace(/\s+(.)/g, (match, letter) => letter.toUpperCase()) // Convert the first letter of each word to uppercase
      .replace(/\s+/g, ""); // Remove spaces
  }
  

const handleNext = async (
    selectedType,
    jobDescription,
    selectedQuestionBank,
    selectedNumQuestions
  ) => {
    const selectedTypeQuestion = toCamelCase(selectedQuestionBank)
     //console.log("After converting",selectedTypeQuestion)

    //  if (selectedType === "Smart AI Interview") {
    //   toast.warning("This interview type is coming soon. Please select a different interview type.");
    //   return;
    // }
    

    try {
      setLoading(true);
      const currentUserId = user?._id;
      if (!currentUserId) {
        toast.error("User not found",{
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      let apiUrl = "";
      let questionResp = "";

      if (selectedType === "Paste Job Description") {
        apiUrl = `${baseUrl}/api/questions/job-description`;
        questionResp = await API.post(apiUrl, {
          jobDescription,
          currentUserId,
          selectedNumQuestions,
        });
      } else if (selectedType === "Question Bank") {
        apiUrl = `${baseUrl}/api/questions/fetch-question-by-category?category=${selectedTypeQuestion}&numQuestions=${selectedNumQuestions}&currentUserId=${currentUserId}`;
        questionResp = await API.get(apiUrl);
      }

      else if(selectedType==="Smart AI Interview"){
         setAiMode(true);
         setRole(selectedQuestionBank);
         setStep(step+1);
         return;
      }

      //console.log("RESPONCE RECIEVED:",questionResp);

      if (questionResp && questionResp.data) {
        const questionsWithoutAnswers = questionResp.data?.questions.map((q) => ({
          question: q.question,
          timing: q.timing || 60,
        }));
        setGeneratedQuestion(questionsWithoutAnswers);
        toast.success("Questions prepared for you!",{
          position: "top-right",
          autoClose: 3000,
        });
        setStep(step + 1);
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      //console.error("Error during API call", error);
      toast.error(
        "Server Error: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleModalClose = () => {
    setStep(1); // Reset to the first step when modal closes
    handleClose();
  };

  const analysisOfImageAndAudio=async()=>{
    // console.log("analysisOfImageAndAudio working")
    // console.log(publicIdImage,publicIdVoice);
    if(!photoUrl || !publicIdImage){
      toast.error("Unable to Proceed",{
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setMediaReportLoading(true);
      const userId=user?._id;
      // console.log("UserId for the analysis report is:",userId);
      const response= await API.post(`${baseUrl}/api/capture-media`,{photoUrl,publicIdImage,userId})
      // console.log("Analysis Report",response.data);
      setStep(step + 1);
      setMediaReportLoading(false);
    } catch (error) {
      setMediaReportLoading(false);
      //console.log("Error Occured",error);
      toast.error("Something went wrong",{
        position: "top-right",
        autoClose: 3000,
      });
    }

  }

  return (
    <>
      <Dialog open={open} fullWidth>
        <DialogTitle>
          {step === 1
            ? "Question Type Selection"
            : step === 2
            ? "Capture Media"
            : "Permissions"}
        </DialogTitle>
        <DialogContent>
          {(loading || MediaReportLoading) ? (
            <div className="flex flex-col items-center p-4 bg-white bg-opacity-80 z-50">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 w-full h-full rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div>
              </div>
              <p className="mt-4 text-lg font-semibold text-blue-600">
              {MediaReportLoading? "Please wait for a minute.." : "EZSync preparing questions for you..."}
              </p>
              <p className="mt-2 text-sm text-black italic">
                {quotes[currentQuote]}
              </p>
            </div>
          ) : step === 1 ? (
            <QuestionTypeSelection
              open={open}
              handleNext={handleNext}
              loading={loading}
              existingQuestions={existingQuestions}
              handleContinueWithExisting={handleContinueWithExisting}
            />
          ) : step === 2 ? (
            <div className="flex flex-col items-center w-full">
              {<PhotoCapture onPhotoCaptured={setPhotoUrl} setPublicIdImage={setPublicIdImage} analysisOfImageAndAudio={analysisOfImageAndAudio} isChecked={isChecked} setIsChecked={setIsChecked} />}
              {/* {photoUrl && <VoiceRecorder voiceUrl={voiceUrl} onVoiceRecorded={setVoiceUrl} isChecked={isChecked} setIsChecked={setIsChecked} analysisOfImageAndAudio={analysisOfImageAndAudio} setPublicIdVoice={setPublicIdVoice} />} */}
              <div className="flex space-x-4 mt-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={analysisOfImageAndAudio}
                  disabled={!photoUrl || !isChecked}
                >
                  Next Step
                </Button>
                {/* <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleBack}
                >
                  Back
                </Button> */}
              </div>
            </div>
          ) : (
            <PermissionModal
              open={open}
              handleBack={handleBack}
              handleModalClose={handleModalClose}
            />
            
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MultiStepModal;

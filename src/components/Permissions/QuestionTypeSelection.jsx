import React, { useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Backdrop,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import PostAddIcon from "@mui/icons-material/PostAdd";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useInterviewStart } from "../../context/InterviewContext";

const QuestionTypeSelection = ({
  handleNext,
  open,
  loading,
  existingQuestions,
  handleContinueWithExisting,
}) => {
  const [selectedType, setSelectedType] = useState("Question Bank"); // Track selected question type
  const [jobDescription, setJobDescription] = useState(""); // For "Paste Job Description"
  const [selectedQuestionBank, setSelectedQuestionBank] = useState(""); // For "Question Bank"
  const [selectedNumQuestions, setSelectedNumQuestions] = useState(""); // For selecting number of questions
  const { user } = useInterviewStart();
  const coins = user?.coins;

  const questionOptions = [
    { label: "Question Bank", icon: <DeveloperModeIcon /> },
    { label: "Paste Job Description", icon: <PostAddIcon /> },
    { label: "Smart AI Interview", icon: <SmartToyIcon /> },
  ];

  // console.log("existingQuestions,", existingQuestions);

  console.log("selected question bank", selectedQuestionBank);

  const questionBankOptions = [
    "Web Development",
    "Android Development",
    "Java",
    "Python",
    "Machine Learning",
    "Deep Learning",
    "Data Structure",
    "DevOps",
    "Cyber Security",
    "Digital Marketing",
    "Taxation",
    "Managerial Accounting",
    "Financial Analysis",
    "Investment Banking",
  ];

  const numQuestionsOptions = [
    { value: 5, coins: 50 },
    { value: 10, coins: 100 },
    { value: 15, coins: 150 },
  ];

  const handleOptionClick = (option) => {
    setSelectedType(option.label);
  };

  const isNextDisabled = () => {
    if (!selectedNumQuestions) return true;
    if (selectedType === "Question Bank" && !selectedQuestionBank) return true;
    if (selectedType === "Paste Job Description" && !jobDescription)
      return true;
    return false;
  };

  return (
    <>
      <Backdrop
        open={open}
        sx={{ zIndex: 999, backdropFilter: "blur(10px)" }}
      />
      <Dialog
        open={open}
        aria-labelledby="question-type-selection-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="question-type-selection-title">
          <Typography variant="h6">Select Question Type</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} justifyContent="center" sx={{mt:2}}>
            {questionOptions.map((option) => (
              <Grid item xs={12} sm={6} md={4} key={option.label}>
                <Card
                  onClick={() => handleOptionClick(option)}
                  sx={{
                    cursor: "pointer",
                    transition: "0.1s",
                    "&:hover": { boxShadow: 6 },
                    backgroundColor:
                      selectedType === option.label ? "lightblue" : "",
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    {option.icon}
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      {option.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} sx={{ mt: 3 }}>
            {(selectedType === "Question Bank" || selectedType==="Smart AI Interview") && (
              <Grid item xs={12}>
                <Typography variant="h6">Select a Topic:</Typography>
                <Select
                  fullWidth
                  value={selectedQuestionBank}
                  onChange={(e) => setSelectedQuestionBank(e.target.value)}
                >
                  {questionBankOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            )}

            {selectedType === "Paste Job Description" && (
              <Grid item xs={12}>
                <Typography variant="h6">Paste Job Description:</Typography>
                <TextField
                  placeholder="Paste job description here"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="h6">Select Number of Questions:</Typography>
              <Select
                fullWidth
                value={selectedNumQuestions}
                onChange={(e) => setSelectedNumQuestions(e.target.value)}
              >
                {numQuestionsOptions.map((option) => (
                  <MenuItem
                    disabled={coins < option.coins}
                    key={option.value}
                    value={option.value}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {option.value} Questions - {option.coins}
                      <img
                        src="/ezsync-coin.png"
                        alt="Coin"
                        style={{
                          width: "20px",
                          height: "20px",
                          marginLeft: "4px",
                        }}
                      />
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>

          {existingQuestions && (
            <Grid container justifyContent="center" sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleContinueWithExisting}
                sx={{
                  background: "linear-gradient(45deg, #FF6F00, #FF8E53)",
                  color: "#fff",
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  transition:
                    "background 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    background: "linear-gradient(45deg, #FF8E53, #FF6F00)",
                    transform: "scale(1.05)",
                    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                    boxShadow: "0 4px 5px rgba(0, 0, 0, 0.2)",
                  },
                  "&:focus": {
                    outline: "none",
                    boxShadow: "0 0 0 4px rgba(255, 110, 0, 0.5)", // Focus ring for accessibility
                  },
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: "8px",
                    background: "linear-gradient(45deg, #FF6F00, #FF8E53)",
                    filter: "blur(10px)",
                    zIndex: -1,
                    transition: "opacity 0.3s ease",
                    opacity: 0,
                  },
                  "&:hover:before": {
                    opacity: 1,
                  },
                }}
              >
                Continue with Previously Generated Questions
              </Button>
            </Grid>
          )}

          <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                handleNext(
                  selectedType,
                  jobDescription,
                  selectedQuestionBank,
                  selectedNumQuestions
                )
              }
              disabled={isNextDisabled()}
            >
              Next
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestionTypeSelection;






































































// import React, { useState } from "react";
// import {
//   Button,
//   Grid,
//   Typography,
//   Card,
//   CardContent,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   Backdrop,
//   MenuItem,
//   Select,
//   TextField,
// } from "@mui/material";
// import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
// import PostAddIcon from "@mui/icons-material/PostAdd";
// import { useInterviewStart } from "../../context/InterviewContext";

// const QuestionTypeSelection = ({
//   handleNext,
//   open,
//   loading,
//   existingQuestions,
//   handleContinueWithExisting,
// }) => {
//   const [selectedType, setSelectedType] = useState("Question Bank"); // Track selected question type
//   const [jobDescription, setJobDescription] = useState(""); // For "Paste Job Description"
//   const [selectedQuestionBank, setSelectedQuestionBank] = useState(""); // For "Question Bank"
//   const [selectedNumQuestions, setSelectedNumQuestions] = useState(""); // For selecting number of questions
//   const [selectedDifficulty, setSelectedDifficulty] = useState(""); // Track difficulty level
//   const { user } = useInterviewStart();
//   const coins = user?.coins;

//   const questionOptions = [
//     { label: "Question Bank", icon: <DeveloperModeIcon /> },
//     { label: "Paste Job Description", icon: <PostAddIcon /> },
//   ];

//   const questionBankOptions = [
//     "Web Development",
//     "Android Development",
//     "Java",
//     "Python",
//     "Machine Learning",
//     "Deep Learning",
//     "DevOps",
//     "Cyber Security",
//     "Digital Marketing",
//     "Taxation",
//     "Managerial Accounting",
//     "Financial Analysis",
//     "Investment Banking",
//   ];

//   const numQuestionsOptions = [
//     { value: 5, coins: 50 },
//     { value: 10, coins: 100 },
//     { value: 15, coins: 150 },
//   ];

//   const difficultyOptions = ["Easy", "Medium", "Hard"];

//   const handleOptionClick = (option) => {
//     setSelectedType(option.label);
//   };

//   const isNextDisabled = () => {
//     if (!selectedNumQuestions || !selectedDifficulty) return true;
//     if (selectedType === "Question Bank" && !selectedQuestionBank) return true;
//     if (selectedType === "Paste Job Description" && !jobDescription)
//       return true;
//     return false;
//   };

//   return (
//     <>
//       <Backdrop
//         open={open}
//         sx={{ zIndex: 999, backdropFilter: "blur(10px)" }}
//       />
//       <Dialog
//         open={open}
//         aria-labelledby="question-type-selection-title"
//         maxWidth="md"
//         fullWidth
//         sx={{ maxWidth: "800px", margin: "auto" }} // Proper size for laptop screens
//       >
//         <DialogTitle id="question-type-selection-title">
//           <Typography variant="h6">Select Question Type</Typography>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={3} justifyContent="center">
//             {questionOptions.map((option) => (
//               <Grid item xs={12} sm={6} key={option.label}>
//                 <Card
//                   onClick={() => handleOptionClick(option)}
//                   sx={{
//                     cursor: "pointer",
//                     transition: "0.1s",
//                     "&:hover": { boxShadow: 6 },
//                     backgroundColor:
//                       selectedType === option.label ? "lightblue" : "",
//                   }}
//                 >
//                   <CardContent sx={{ textAlign: "center" }}>
//                     {option.icon}
//                     <Typography variant="h6" sx={{ mt: 2 }}>
//                       {option.label}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>

//           <Grid container spacing={3} sx={{ mt: 3 }}>
//             {selectedType === "Question Bank" && (
//               <Grid item xs={12}>
//                 <Typography variant="h6">Select a Topic:</Typography>
//                 <Select
//                   fullWidth
//                   value={selectedQuestionBank}
//                   onChange={(e) => setSelectedQuestionBank(e.target.value)}
//                 >
//                   {questionBankOptions.map((option) => (
//                     <MenuItem key={option} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </Grid>
//             )}

//             {selectedType === "Paste Job Description" && (
//               <Grid item xs={12}>
//                 <Typography variant="h6">Paste Job Description:</Typography>
//                 <TextField
//                   placeholder="Paste job description here"
//                   fullWidth
//                   multiline
//                   rows={4}
//                   variant="outlined"
//                   onChange={(e) => setJobDescription(e.target.value)}
//                 />
//               </Grid>
//             )}

//             <Grid item xs={12}>
//               <Typography variant="h6">Select Number of Questions:</Typography>
//               <Select
//                 fullWidth
//                 value={selectedNumQuestions}
//                 onChange={(e) => setSelectedNumQuestions(e.target.value)}
//               >
//                 {numQuestionsOptions.map((option) => (
//                   <MenuItem
//                     disabled={coins < option.coins}
//                     key={option.value}
//                     value={option.value}
//                   >
//                     <div style={{ display: "flex", alignItems: "center" }}>
//                       {option.value} Questions - {option.coins}
//                       <img
//                         src="/ezsync-coin.png"
//                         alt="Coin"
//                         style={{
//                           width: "20px",
//                           height: "20px",
//                           marginLeft: "4px",
//                         }}
//                       />
//                     </div>
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Grid>

//             {/* New Difficulty Selection */}
//             <Grid item xs={12}>
//               <Typography variant="h6">Select Difficulty Level:</Typography>
//               <Select
//                 fullWidth
//                 value={selectedDifficulty}
//                 onChange={(e) => setSelectedDifficulty(e.target.value)}
//               >
//                 {difficultyOptions.map((option) => (
//                   <MenuItem key={option} value={option}>
//                     {option}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Grid>
//           </Grid>

//           {/* Tailwind styled Continue with Existing Questions Button */}
//           {existingQuestions && (
//             <Grid container justifyContent="center" sx={{ mt: 3 }}>
//               <Button
//                 className="bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 px-6 text-lg font-bold rounded-lg shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
//                 onClick={handleContinueWithExisting}
//               >
//                 Continue with Previously Generated Questions
//               </Button>
//             </Grid>
//           )}

//           <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() =>
//                 handleNext(
//                   selectedType,
//                   jobDescription,
//                   selectedQuestionBank,
//                   selectedNumQuestions,
//                   selectedDifficulty
//                 )
//               }
//               disabled={isNextDisabled()}
//             >
//               Next
//             </Button>
//           </Grid>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default QuestionTypeSelection;

import React, { useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { motion } from "framer-motion";
import { useInterviewStart } from "../context/InterviewContext";
import { Base_Url_Landing_Page_Frontend } from "../utils/baseUri";
import { useNavigate } from "react-router-dom";
const ThankyouPage = () => {
  const { user, thankyouPage } = useInterviewStart();
  const navigate = useNavigate();
  useEffect(() => {
    if (!thankyouPage) {
      navigate("/");
    }
  }, []);

  // Clear the history stack to prevent back navigation
  //   useEffect(() => {
  //     // Push the current URL to history and replace it, which clears the back stack
  //     window.history.pushState(null, "", window.location.href);
  //     window.onpopstate = () => {
  //       window.history.pushState(null, "", window.location.href);
  //     };
  //   }, []);

  const handleDashboardRedirect = () => {
    // Navigate to dashboard when button is clicked
    window.location.href = `${Base_Url_Landing_Page_Frontend}/studentDashboard/interview`; // Replace with the desired website URL
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 px-4 overflow-y-hidden scrollbar-hidden ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="bg-white shadow-lg rounded-lg p-8 text-center w-full max-w-md lg:max-w-lg md:max-w-md sm:max-w-full"
      >
        <CheckCircleIcon
          className="text-green-500 mb-4"
          style={{ fontSize: 60 }}
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Thank You, {user?.fullName}!
        </h1>
        {/* <p className="text-lg text-gray-600 mb-4">
          We appreciate you completing the interview practice with{" "}
          <span className="text-teal-500 font-bold">EZSync</span>. Your dedication and time are valuable to us!
        </p> */}
        <p className="text-lg text-gray-600 mb-6">
          Thank you for attending this interview with{" "}
          <span className="text-teal-500 font-bold">EZSync</span>. We hope this
          practice benefits you in tackling your real interviews. Have a great
          day!{" "}
        </p>

        <motion.button
          onClick={handleDashboardRedirect}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-teal-500 text-white px-6 py-3 rounded-full flex items-center justify-center space-x-2 shadow-md hover:bg-teal-600 transition-colors duration-300 w-full max-w-xs"
        >
          <DashboardIcon />
          <span>Check your result on Dashboard</span>
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="text-white mt-8 text-sm sm:text-base"
      >
        Powered by <span className="font-bold">EZSync</span> - We build your
        future.
      </motion.p>
    </div>
  );
};

export default ThankyouPage;

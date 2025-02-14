import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useInterviewStart } from './context/InterviewContext';
import { baseUrl,Base_Url_Landing_Page_Backend,Base_Url_Landing_Page_Frontend } from './utils/baseUri';
import ThankyouPage from './components/ThankyouPage';
import API from './utils/api';

const Main = () => {
  const [verifyUserLoading, setVerifyUserLoading] = useState(false); // Set initial state to true
  const { setUser } = useInterviewStart();

  useEffect(() => {
    // Get the encrypted token from URL parameters
    const params = new URLSearchParams(window.location.search);
    const encryptedToken = params.get('user'); // 'user' is the token parameter
    //console.log('Encrypted token received from main website:', encryptedToken);
   
    if (encryptedToken) {
      // Send the token to the backend for verification via middleware
      API
        .get(`${baseUrl}/api/verify`, {
          params: { token: encryptedToken }, // Send token as query parameter
        })
        .then((response) => {
          // Token is valid, extract the user ID
         // console.log('Token is valid and verified:', response.data);
          const userId = response.data.user.id;  // Assuming the user ID is in the token response
          localStorage.setItem("interview-user",JSON.stringify(response.data?.user));
          // Make an API call to the first website to fetch the full user details
          API
            .get(`${Base_Url_Landing_Page_Backend}/student/fetch-user-by-id/${userId}`, 
              // headers: { Authorization: `Bearer ${encryptedToken}` }, // Pass the token for authentication
            )
            .then((userResponse) => {
              // Set the user in context
              setUser(userResponse.data);
              //console.log('Full user details fetched:', userResponse.data);
  
              // Indicate loading is complete
              setVerifyUserLoading(false);
              toast.success(`Welcome ${userResponse.data.fullName}`,{
                position: "top-right",
                autoClose: 3000,
              });
            })
            .catch((error) => {
              // Handle error fetching full user details
             // console.error('Error fetching user details:', error);
              toast.error('Failed to fetch user details. Please try again.',{
                position: "top-right",
                autoClose: 3000,
              });
             window.location.href = `${Base_Url_Landing_Page_Frontend}/login`;
            });
        })
        .catch((error) => {
          // Handle invalid token
          //console.error('Token verification failed:', error);
          toast.error('Token verification failed. Please login again.',{
            position: "top-right",
            autoClose: 3000,
          });
          // Redirect back to the login page
          window.location.href = `${Base_Url_Landing_Page_Frontend}/login`;
        });
    } else {
      // No token found, redirect to login
      toast.error('Please login again.',{
        position: "top-right",
        autoClose: 3000,
      });
      window.location.href = `${Base_Url_Landing_Page_Frontend}/login`;
    }
  }, [setUser]);
  

  return (
    <div>
      {verifyUserLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 w-full h-full rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div>
            </div>
            <p className="mt-4 text-lg font-semibold text-blue-600">
              EZSync verifying you, please wait...
            </p>
            <p className="mt-2 text-sm text-black italic">
              Crafting tailored interview questions just for you...
            </p>
          </div>
        </div>
      ) : (
        <>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/interview-completed" element={<ThankyouPage/>}/>
          </Routes>
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default Main;



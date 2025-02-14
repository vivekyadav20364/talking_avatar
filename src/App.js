import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  useTexture,
  Loader,
  Environment,
  OrthographicCamera,
} from "@react-three/drei";
import ReactAudioPlayer from "react-audio-player";
import _ from "lodash";

import Avatar from "./components/Avatar";
import CameraCapture from "./components/WebCam";
import InterviewCheck from "./components/InterviewQueSec";
import { useInterviewStart } from "./context/InterviewContext";
import { useTranscriptionStatus } from "./context/SpeechRecognizationContext";
import SideBarCode from "./components/SideBarCode";
import UserMenu from "./components/UserMenu"; // Import the Avatar menu
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import NotStartedOutlinedIcon from "@mui/icons-material/NotStartedOutlined";
import MultiStepModal from "./components/Permissions/MultiStepModal";
import { TextureLoader } from "three";
import InterviewFullyAI from "./components/InterviewFullyAI";

import { FaCode, FaVideoSlash, FaPhone, FaClosedCaptioning } from "react-icons/fa";
import Clock from "./components/Clock";

function App() {
  const audioPlayer = useRef(null);
  const [speak, setSpeak] = useState(false);
  const { speechtext, setSpeechText } = useInterviewStart();
  const [audioSource, setAudioSource] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [openSideDrawer, setOpenSideDrawer] = useState(false);

  const { setInterviewOpen, interviewOpen, user, thankyouPage, aiMode } =
    useInterviewStart();
  const { stopRecording, startRecording } = useTranscriptionStatus();

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isCCActive, setIsCCActive] = useState(false);

  const name = user?.fullName;
  // console.log("Usename:",name)

  const [text, setText] = useState(
    // "Hello Yadav ji welcome to Easy sync. I'm your virtual Interviewer. And I will be conducting your scheduled interview for today. Let's start with a brief introduction of yourself. You can start by pressing the 'Start Interview' button whenever you are ready."
    `Hello ${name} welcome to Easy sync`
  );

  useEffect(() => {
    if (!isModalOpen) {
      const timer = setTimeout(() => {
        setIsButtonDisabled(false);
      }, 10000);

      // Cleanup timer on component unmount or if `isModalOpen` changes again
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  const handleClose = () => {
    // console.log("Called handleClose")
    setIsModalOpen(!isModalOpen);
    // Update the text state to include the user's name
    if (user && user.fullName) {
      setText(
        `Hello ${user.fullName}, welcome to Easy Sync. I'm your virtual interviewer, and I will be conducting your scheduled interview today. Please click on the start interview button to begin the interview.`
      );
    } else {
      setText(
        "Hello, welcome to Easy Sync. I'm your virtual interviewer, and I will be conducting your scheduled interview today.Please click on the start interview button to begin the interview."
      );
    }

    setSpeak(true); // Trigger the avatar to speak
  };

  return (
    <>
      {isModalOpen && <MultiStepModal open={isModalOpen} handleClose={handleClose} />} 

      <header className="bg-white p-4 flex justify-between items-center text-white rounded-b-md">
        {/* Company Logo */}
        <img
          src="logo.png"
          alt="Company Logo"
          className="h-12 w-auto object-contain"
        />

        {/* Navigation Buttons */}
        <div className="nav-buttons flex space-x-4">
          <button
            onClick={startRecording}
            disabled={isButtonDisabled}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-800"
          >
            <NotStartedOutlinedIcon fontSize="medium" /> Start Interview
          </button>
          {/* <button
            onClick={() => setOpenSideDrawer(!openSideDrawer)}
            disabled={isButtonDisabled}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-800"
          >
            <CodeOutlinedIcon fontSize="medium" /> Write Code
          </button> */}

          {/* Profile Avatar */}
          <UserMenu dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
        </div>
      </header>
      <SideBarCode open={openSideDrawer} setOpen={setOpenSideDrawer} />
      <div className="main_sec bg-darkGray min-h-[88vh] h-full text-white m-auto px-2 ">
        <div className="main_sec_middle flex flex-col justify-start items-center w-full h-full m-auto ">
          <div className="main_sec_middle_bottom flex flex-row justify-between h-full w-full m-auto overflow-hidden gap-x-2 p-2 mt-10">
            <div className="faceCam_sec w-[30%] flex flex-row justify-center items-center shadow-md h-[58vh] my-auto bg-black rounded-md">
              <CameraCapture className="h-[58vh] flex flex-1" />
            </div>
            <div className="avtarFace_sec w-[40%] m-auto h-[57vh] bg-black rounded-md">
              <ReactAudioPlayer
                src={audioSource}
                ref={audioPlayer}
                onEnded={() => {
                  setSpeak(false);
                  setPlaying(false);
                  setAudioSource(null);
                }}
                onCanPlayThrough={() => {
                  audioPlayer.current.audioEl.current.play();
                  setPlaying(true);
                }}
              />
              <Canvas dpr={2}>
                <OrthographicCamera
                  makeDefault
                  zoom={1000}
                  position={[0, 1.65, 1]}
                />
                <Suspense fallback={null}>
                  <Environment
                    background={false}
                    files="/images/photo_studio_loft_hall_1k.hdr"
                  />
                  <Bg />
                  <Avatar
                    avatar_url="/model.glb"
                    speak={speak}
                    setSpeak={setSpeak}
                    text={text}
                    setAudioSource={setAudioSource}
                    playing={playing}
                  />
                </Suspense>
              </Canvas>
              <Loader dataInterpolation={(p) => `Loading... please wait`} />
            </div>
            {!aiMode && (
              <div className="question_sec w-[30%] my-auto bg-black h-[58vh] rounded-md">
                <InterviewCheck
                  setText={setText}
                  speak={speak}
                  setSpeak={setSpeak}
                />
              </div>
            )}
            {aiMode && (
              <div className="question_sec w-[30%] my-auto bg-black h-[58vh] rounded-md">
                <InterviewFullyAI
                  setText={setText}
                  speak={speak}
                  setSpeak={setSpeak}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-start ml-3"> <Clock/>  &nbsp;&nbsp;| &nbsp;<b>{name}</b></div>
        <div className="flex justify-center mt-10 space-x-4">
          <button
            onClick={() => setOpenSideDrawer(!openSideDrawer)}
            disabled={isButtonDisabled}
            className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer"
          >
            <FaCode />
            Code Editor
          </button>

          {/* <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500">
        <FaVideoSlash />
        Turn Off Camera
      </button> */}

      <button
      onClick={() => setIsCCActive(!isCCActive)}
      disabled={!isCCActive}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg 
        ${isCCActive ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-500 text-gray-300 cursor-not-allowed"}
      `}
    >
      <FaClosedCaptioning className="text-xl" />
      CC
    </button>

          <button
            onClick={() => setDialogOpen(!dialogOpen)}
            className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            <FaPhone />
            End Interview
          </button>
        </div>
      </div>
    </>
  );
}

// function Bg() {
//   const texture = useTexture("/images/bg.webp");
//   return (
//     <mesh position={[0, 1.5, -2]} scale={[0.8, 0.8, 0.8]}>
//       <planeBufferGeometry />
//       <meshBasicMaterial map={texture} />
//     </mesh>
//   );
// }

function Bg() {
  const bgTexture = useTexture("/images/bg.webp");
  // const texture = useTexture('/images/bg.webp');
  const overlayTexture = useLoader(TextureLoader, "/images/overlay.png"); // Load the overlay PNG

  return (
    <>
      {/* Background plane */}
      <mesh position={[0, 1.5, -2]} scale={[0.8, 0.8, 0.8]}>
        <planeBufferGeometry />
        <meshBasicMaterial map={bgTexture} />
      </mesh>

      {/* Overlay PNG plane */}
      <mesh position={[0.2, 1.65, -2]} scale={[0.1, 0.1, 0.1]} transparent>
        <planeBufferGeometry />
        <meshBasicMaterial map={overlayTexture} transparent={true} />
      </mesh>
    </>
  );
}

export default App;

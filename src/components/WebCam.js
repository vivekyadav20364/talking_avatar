// =========================================================================================

// import React, { useState, useRef, useEffect } from 'react';
// import Webcam from 'react-webcam';
// import { useInterviewStart } from '../context/InterviewContext';

// const CameraCapture = () => {
//   const webcamRef = useRef(null);
//   const [isCameraOn, setIsCameraOn] = useState(false);
//   const [imageData, setImageData] = useState(null);
//   const { interviewOpen } = useInterviewStart();

//   useEffect(() => {
//     if (interviewOpen) {
//       startCamera();
//     } else {
//       stopCamera();
//     }
//   }, [interviewOpen]);

//   const startCamera = () => {
//     setIsCameraOn(true);
//   };

//   const stopCamera = () => {
//     if (webcamRef.current && webcamRef.current.video) {
//       const tracks = webcamRef.current.video.srcObject.getTracks();
//       tracks.forEach(track => track.stop());
//     }
//     setIsCameraOn(false);
//     setImageData(null);
//   };

//   const capturePicture = () => {
//     if (webcamRef.current) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       setImageData(imageSrc);
//     }
//   };

//   const handleError = (error) => {
//     console.error('Camera capture error:', error);
//   };

//   return (
//     <div className='w-full h-full flex flex-col justify-center items-center'>
//       {!isCameraOn ? (
//         // <button onClick={startCamera}>Start Camera</button>
//         <div className='flex flex-col justify-center items-center'>
//         <img src='/staticImages/user.png' alt='user-icon'className='w-48 h-48'/>
//         {/* <h2 className='text-lg font-semibold '>User FaceCam</h2> */}
//         <h2 className='text-lg font-semibold '>EZSync Welcomes You</h2>
//         </div>
//       ) : (
//         <div>
//           <Webcam
//             audio={false}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             width={450}
//             height={600}
            
//             onError={handleError}
//           />
//           <div>
//             {/* <button onClick={capturePicture}>Capture Picture</button>
//             <button onClick={stopCamera}>Stop Camera</button> */}
//           </div>
//         </div>
//       )}
//       {imageData && <img src={imageData} alt="Captured camera image" />}
//     </div>
//   );
// };

// export default CameraCapture;

// CORRECT CODE

// import React, { useState, useRef, useEffect } from 'react';
// import Webcam from 'react-webcam';
// import { useInterviewStart } from '../context/InterviewContext';
// import * as faceapi from '@vladmandic/face-api';

// const CameraCapture = () => {
//   const webcamRef = useRef(null);
//   const [isCameraOn, setIsCameraOn] = useState(false);
//   const [warning, setWarning] = useState('');
//   const { interviewOpen } = useInterviewStart();

//   useEffect(() => {
//     const loadModels = async () => {
//       try {
//         console.log('Loading face-api models...');
//         const MODEL_URL = '/models';
//         await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//         await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
//         await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
//         console.log('Face-api models loaded successfully');
//       } catch (error) {
//         console.error('Error loading face-api models:', error);
//       }
//     };

//     loadModels();
//   }, []);

//   useEffect(() => {
//     console.log('Interview state changed:', interviewOpen);
//     if (interviewOpen) {
//       startCamera();
//     } else {
//       stopCamera();
//     }
//   }, [interviewOpen]);

//   const startCamera = () => {
//     console.log('Starting camera...');
//     setIsCameraOn(true);
  
//     // Wait for the webcamRef to be ready before starting face detection
//     const interval = setInterval(() => {
//       if (webcamRef.current && webcamRef.current.video.readyState === 4) {
//         console.log('Camera is ready for face detection.');
//         clearInterval(interval);
//         detectFaces();
//       }
//     }, 500);
//   };

//   const stopCamera = () => {
//     console.log('Stopping camera...');
//     if (webcamRef.current && webcamRef.current.video) {
//       const tracks = webcamRef.current.video.srcObject.getTracks();
//       tracks.forEach(track => track.stop());
//       console.log('Camera stopped.');
//     }
//     setIsCameraOn(false);
//     setWarning('');
//   };

//   const detectFaces = async () => {
//     console.log('Starting face detection...');
//     const video = webcamRef.current.video;
//     const canvas = faceapi.createCanvasFromMedia(video);
//     document.body.append(canvas);

//     const displaySize = {
//       width: video.width,
//       height: video.height
//     };
//     faceapi.matchDimensions(canvas, displaySize);

//     setInterval(async () => {
//       try {
//         const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
//         console.log('Detections:', detections);

//         if (detections.length === 0) {
//           setWarning('No face detected. Please align your face properly.');
//           // console.warn('No face detected.');
//         } else if (detections.length > 1) {
//           setWarning('Multiple faces detected. Please ensure only one person is in the frame.');
//           // console.warn('Multiple faces detected.');
//         } else {
//           setWarning('');
//           // console.log('Single face detected.');
//         }

//         const resizedDetections = faceapi.resizeResults(detections, displaySize);
//         canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//       } catch (error) {
//         console.error('Error during face detection:', error);
//       }
//     }, 1000);
//   };

//   return (
//     <div className='w-full h-full flex flex-col justify-center items-center'>
//       {!isCameraOn ? (
//         <div className='flex flex-col justify-center items-center'>
//           <img src='/staticImages/user.png' alt='user-icon' className='w-48 h-48'/>
//           <h2 className='text-lg font-semibold '>EZSync Welcomes You</h2>
//         </div>
//       ) : (
//         <div>
//           <Webcam
//             audio={false}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             width={450}
//             height={600}
//             onError={(error) => console.error('Camera capture error:', error)}
//           />
//           {/* {warning && <div className="warning">{warning}</div>} */}

//           {warning && (
//       <div className="flex items-center p-4 mt-4 mx-2 text-sm text-yellow-800 bg-yellow-100 rounded-lg border border-yellow-300" role="alert">
//     <svg
//       className="w-5 h-5 mr-2 text-yellow-700"
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 20 20"
//       fill="currentColor"
//       aria-hidden="true"
//     >
//       <path
//         fillRule="evenodd"
//         d="M8.257 3.099c.366-.446.98-.518 1.428-.153a.75.75 0 0 1 .102 1.06L4.732 9.97h4.82c.414 0 .75.336.75.75s-.336.75-.75.75H2.25a.75.75 0 0 1-.673-1.065l5.38-6.888ZM3.18 12h4.82c.414 0 .75.336.75.75s-.336.75-.75.75H2.25a.75.75 0 0 1-.673-1.065l1.603-2.425Zm6.822 2a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5c0-.414.336-.75.75-.75Z"
//         clipRule="evenodd"
//       />
//     </svg>
//     <span className="font-medium">{warning}</span>
//   </div>
// )}

//         </div>
//       )}
//     </div>
//   );
// };

// export default CameraCapture;














import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useInterviewStart } from '../context/InterviewContext';
import * as faceapi from '@vladmandic/face-api';

const CameraCapture = () => {
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [warning, setWarning] = useState('');
  const { interviewOpen} = useInterviewStart();

  useEffect(() => {
    const loadModels = async () => {
      try {
        // console.log('Loading face-api models...');
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        // console.log('Face-api models loaded successfully');
      } catch (error) {
        console.error('Error loading face-api models:', error);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    // console.log('Interview state changed:', interviewOpen);
    if (interviewOpen) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [interviewOpen]);

  const startCamera = () => {
    // console.log('Starting camera...');
    setIsCameraOn(true);

    const interval = setInterval(() => {
      if (webcamRef.current && webcamRef.current.video.readyState === 4) {
        // console.log('Camera is ready for face detection.');
        clearInterval(interval);
        detectFaces();
      }
    }, 500);
  };

  const stopCamera = () => {
    // console.log('Stopping camera...');
    if (webcamRef.current && webcamRef.current.video) {
      const tracks = webcamRef.current.video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      // console.log('Camera stopped.');
    }
    setIsCameraOn(false);
    setWarning('');
  };

  const detectFaces = async () => {
    // console.log('Starting face detection...');
    const video = webcamRef.current.video;
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = {
      width: video.videoWidth,
      height: video.videoHeight
    };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      try {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        // console.log('Detections:', detections);

        if (detections.length === 0) {
          setWarning('No face detected. Please align your face properly.');
        } else if (detections.length > 1) {
          setWarning('Multiple faces detected. Please ensure only one person is in the frame.');
        } else {
          setWarning('');
        }

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      } catch (error) {
        console.error('Error during face detection:', error);
      }
    }, 1000);
  };

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      {!isCameraOn ? (
        <div className='flex flex-col justify-center items-center'>
          <img src='/staticImages/user.png' alt='user-icon' className='w-48 h-48' />
          <h2 className='text-lg font-semibold mt-4'>EZSync Welcomes You</h2>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center w-full overflow-y-hidden'>
          <div className="flex justify-center items-center p-4 bg-black rounded-lg shadow-md border border-gray-700 overflow-y-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={450}
              height={600}
              className="rounded-md"
              onError={(error) => console.error('Camera capture error:', error)}
            />
          </div>
          {/* Warning Message */}
          {warning && (
            <div className="flex items-center p-4 mt-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg border border-yellow-300 w-96" role="alert">
              <svg
                className="w-5 h-5 mr-2 text-yellow-700"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.366-.446.98-.518 1.428-.153a.75.75 0 0 1 .102 1.06L4.732 9.97h4.82c.414 0 .75.336.75.75s-.336.75-.75.75H2.25a.75.75 0 0 1-.673-1.065l5.38-6.888ZM3.18 12h4.82c.414 0 .75.336.75.75s-.336.75-.75.75H2.25a.75.75 0 0 1-.673-1.065l1.603-2.425Zm6.822 2a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5c0-.414.336-.75.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{warning}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraCapture;


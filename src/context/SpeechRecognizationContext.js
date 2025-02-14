// import { createContext, useState, useEffect, useContext, useRef } from 'react';
// import { useInterviewStart } from './InterviewContext';

// const transcriptionContext = createContext();

// const SpeechRecognizationProvider = ({ children }) => {
//     const recognition = useRef(null);
//     const [transcriptionOn, setTranscriptionOn] = useState(false);
//     const {setSpeechText,setInterviewOpen,interviewOpen}  = useInterviewStart();

//     let initializeSpeechRecognition = () => {
//         if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
//             const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//             recognition.current = new SpeechRecognition();
//             recognition.current.continuous = true;
//             recognition.current.interimResults = true;
//             recognition.current.lang = "en-US";

//             recognition.current.onresult = (event) => {
//                 const transcript = Array.from(event.results)
//                     .map((result) => result[0].transcript)
//                     .join("");
//                 setSpeechText(transcript);
//             };
//         } else {
//             alert("Speech recognition not available in this browser.");
//         }
//     };


//     const startRecording = () => {
    
//             initializeSpeechRecognition()
//             recognition.current?.start();
//             setTranscriptionOn(true);
//             setInterviewOpen(true);   // it set the interviewOpen true every time when user startRecording it may not show any impact b/c it is already true every time........
        
      
//     };

//     const stopRecording = () => {
//         recognition.current?.stop();
//         setTranscriptionOn(false); // Set transcriptionOn state to false when recording stops
       
//     };

//     return (
//         <transcriptionContext.Provider value={{ startRecording, stopRecording, setTranscriptionOn,transcriptionOn }}>
//             {children}
//         </transcriptionContext.Provider>
//     );
// };

// // Custom hook to consume the context
// const useTranscriptionStatus = () => {
//     const context = useContext(transcriptionContext);
//     if (!context) {
//         throw new Error("useTranscriptionStatus must be used within an SpeechRecognizationContext");
//     }
//     return context;
// };

// export { SpeechRecognizationProvider, useTranscriptionStatus };






// import { createContext, useState, useContext, useRef } from 'react';
// import { useInterviewStart } from './InterviewContext';
// import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

// const transcriptionContext = createContext();

// const SpeechRecognizationProvider = ({ children }) => {
//     const [transcriptionOn, setTranscriptionOn] = useState(false);
//     const [speechRecognizer, setSpeechRecognizer] = useState(null);
//     const { setSpeechText, setInterviewOpen } = useInterviewStart();
//     const lastRecognizedTextRef = useRef("");  // To store the last recognized text to avoid duplicates

//     const apiKey = "28aaea61d2c54e23a42188bec636646c"; // Replace with your Azure Speech API key
//     const region = "eastus"; // Replace with your Azure Speech region

//      // Enable built-in speech enhancement for noise cancellation
//      speechConfig.enableSpeechEnhancement = true;

//     const startRecording = () => {
//         const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey, region);
//         speechConfig.speechRecognitionLanguage = "en-US";

//         const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
//         const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

//         // Setting properties for the recognizer (optional)
//         recognizer.properties.setProperty(
//             SpeechSDK.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs,
//             "60000"
//         );
//         recognizer.properties.setProperty(
//             SpeechSDK.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs,
//             "20000"
//         );

//         // Recognized event (finalized speech transcription)
//         recognizer.recognized = (s, e) => {
//             if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
//                 const finalTranscript = e.result.text;

//                 // Only append the new transcription if it's different from the last recognized text
//                 if (finalTranscript !== lastRecognizedTextRef.current) {
//                     console.log(`RECOGNIZED (final): ${finalTranscript}`);
//                     setSpeechText((prevText) => prevText + finalTranscript + " ");
//                     lastRecognizedTextRef.current = finalTranscript; // Update the last recognized text
//                 }
//             } else if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
//                 console.log("NOMATCH: Speech could not be recognized.");
//             }
//         };

//         recognizer.canceled = (s, e) => {
//             console.log(`CANCELED: Reason=${e.reason}`);
//             recognizer.stopContinuousRecognitionAsync();
//         };

//         recognizer.sessionStopped = (s, e) => {
//             console.log("Session stopped.");
//             recognizer.stopContinuousRecognitionAsync();
//         };

//         recognizer.startContinuousRecognitionAsync();
//         setSpeechRecognizer(recognizer);
//         setTranscriptionOn(true);
//         setInterviewOpen(true);
//     };

//     const stopRecording = () => {
//         if (speechRecognizer) {
//             speechRecognizer.stopContinuousRecognitionAsync(() => {
//                 console.log("Stopped recognition.");
//                 setSpeechRecognizer(null);
//                 setTranscriptionOn(false);
//             });
//         }
//     };

//     return (
//         <transcriptionContext.Provider value={{ startRecording, stopRecording, setTranscriptionOn, transcriptionOn }}>
//             {children}
//         </transcriptionContext.Provider>
//     );
// };

// // Custom hook to consume the context
// const useTranscriptionStatus = () => {
//     const context = useContext(transcriptionContext);
//     if (!context) {
//         throw new Error("useTranscriptionStatus must be used within an SpeechRecognizationContext");
//     }
//     return context;
// };

// export { SpeechRecognizationProvider, useTranscriptionStatus };




import { createContext, useState, useContext, useRef } from 'react';
import { useInterviewStart } from './InterviewContext';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

const transcriptionContext = createContext();

const SpeechRecognizationProvider = ({ children }) => {
    const [transcriptionOn, setTranscriptionOn] = useState(false);
    const [speechRecognizer, setSpeechRecognizer] = useState(null);
    const { setSpeechText, setInterviewOpen } = useInterviewStart();
    const lastRecognizedTextRef = useRef("");  // To store the last recognized text to avoid duplicates
 
    const apiKey = process.env.REACT_APP_AZURE_KEY;
    const region = process.env.REACT_APP_AZURE_REGION;


 

    //console.log("APIKEY",apiKey,region);

    const startRecording = () => {
        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey, region);
        
        // Set the recognition language to Indian English (en-IN)
        speechConfig.speechRecognitionLanguage = "en-IN";
        
        // Enable built-in speech enhancement for noise cancellation
        speechConfig.enableSpeechEnhancement = true;

        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

        // Setting properties for the recognizer
        recognizer.properties.setProperty(
            SpeechSDK.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs,
            "60000" // 1 minute timeout for silence before starting recognition
        );
        recognizer.properties.setProperty(
            SpeechSDK.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs,
            "20000" // 20 seconds timeout for silence before ending recognition
        );

        // Recognized event (finalized speech transcription)
        recognizer.recognized = (s, e) => {
            if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                const finalTranscript = e.result.text;

                // Only append new transcription if it's different from the last recognized text
                if (finalTranscript !== lastRecognizedTextRef.current) {
                   // console.log(`RECOGNIZED (final): ${finalTranscript}`);
                    setSpeechText((prevText) => prevText + finalTranscript + " ");
                    lastRecognizedTextRef.current = finalTranscript; // Update the last recognized text
                }
            } else if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
                //console.log("NOMATCH: Speech could not be recognized.");
            }
        };

        // Error or cancellation event
        recognizer.canceled = (s, e) => {
            //console.log(`CANCELED: Reason=${e.reason}`);
            recognizer.stopContinuousRecognitionAsync();
        };

        // Session stopped event
        recognizer.sessionStopped = (s, e) => {
           // console.log("Session stopped.");
            recognizer.stopContinuousRecognitionAsync();
        };

        // Start continuous recognition
        recognizer.startContinuousRecognitionAsync();
        setSpeechRecognizer(recognizer);
        setTranscriptionOn(true);
        setInterviewOpen(true);
    };

    const stopRecording = () => {
        if (speechRecognizer) {
            speechRecognizer.stopContinuousRecognitionAsync(() => {
                //console.log("Stopped recognition.");
                setSpeechRecognizer(null);
                setTranscriptionOn(false);
            });
        }
    };

    return (
        <transcriptionContext.Provider value={{ startRecording, stopRecording, setTranscriptionOn, transcriptionOn }}>
            {children}
        </transcriptionContext.Provider>
    );
};

// Custom hook to consume the transcription context
const useTranscriptionStatus = () => {
    const context = useContext(transcriptionContext);
    if (!context) {
        throw new Error("useTranscriptionStatus must be used within a SpeechRecognizationContext");
    }
    return context;
};

export { SpeechRecognizationProvider, useTranscriptionStatus };

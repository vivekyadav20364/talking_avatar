
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Recorder from 'recorder-js';  // Import the Recorder class
import CircularProgress from '@mui/material/CircularProgress';

const VoiceRecorder = ({ voiceUrl, onVoiceRecorded, isChecked, setIsChecked, setPublicIdVoice }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [flag, setFlag] = useState(false);
  const [buttonLoading,setButtonLoading]=useState(false);

  const mediaRecorderRef = useRef(null);
  const recorderRef = useRef(null);

  const startRecording = () => {
    //console.log("Start called");
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const recorder = new Recorder(audioContext);
        recorder.init(stream);
        recorder.start();

        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      })
      .catch(err => {
        console.error("Error accessing microphone:", err);
        toast.error("Failed to access microphone.");
      });
  };

  const stopRecording = () => {
    //console.log("Stop called");
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop().then(({ blob }) => {
        setAudioBlob(blob);
        setFlag(true);
      });
      setIsRecording(false);
    }
  };

  const handleRetakeVoice = () => {
    setFlag(false);
    setAudioBlob(null);
  };

  const uploadVoice = async () => {
   // console.log("Upload button clicked");
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('file', audioBlob, 'voice.wav');
    formData.append('upload_preset', 'EZSync-user'); // Set your upload preset here
    formData.append("resource_type", "raw");

    try {
      setButtonLoading(true);
      const response = await axios.post('https://api.cloudinary.com/v1_1/daruus6qx/raw/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const { secure_url, public_id } = response.data;
      onVoiceRecorded(secure_url);
      setPublicIdVoice(public_id);

     // console.log("AUDIO URL IS:", secure_url);
      //console.log("PublicID Audio IS:", public_id);

      toast.success("Voice message uploaded successfully!",{
        position: "top-right",
        autoClose: 3000,
      });
      setButtonLoading(false);
    } catch (error) {
      console.error('Error uploading voice message:', error);
      toast.error('Failed to upload voice message.',{
        position: "top-right",
        autoClose: 3000,
      });
      setButtonLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Please read the below text:</h2>
      <p className="mb-6 text-gray-700 text-center">
        The quick brown fox jumps over the lazy dog. It is a beautiful day, and I am ready to showcase my communication skills.
      </p>
      <div className="w-full">
            {!flag && (
                <button
                    className={`w-full py-3 px-4 rounded-lg shadow-md transition-colors duration-300 ${isRecording ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'} ${isRecording ? 'animate-pulse' : 'hover:bg-blue-700'}`}
                    onClick={isRecording ? stopRecording : startRecording}
                >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
            )}
            {flag && (
                <div className="flex flex-col space-y-4">
                    <button
                        className={`${voiceUrl ? 'cursor-not-allowed' : ''} w-full py-3 px-4 bg-teal-600 text-white rounded-lg shadow-md transition-colors duration-300 hover:bg-teal-700 flex items-center justify-center`}
                        onClick={uploadVoice}
                        disabled={voiceUrl || buttonLoading}
                    >
                        {buttonLoading ? (
                            <div className="flex items-center">
                                <CircularProgress
                                    size={24}
                                    sx={{ color: 'white', marginRight: 1 }}
                                />
                                <span>Uploading...</span>
                            </div>
                        ) : (
                            !voiceUrl ? "Upload Voice" : "Voice Uploaded"
                        )}
                    </button>
                    {!voiceUrl && (
                        <button
                            className="w-full py-3 px-4 bg-yellow-500 text-white rounded-lg shadow-md transition-colors duration-300 hover:bg-yellow-600"
                            onClick={handleRetakeVoice}
                        >
                            Retake Voice
                        </button>
                    )}
                </div>
            )}
        </div>
      {onVoiceRecorded && <div className="flex mt-3">
        <input
          type="checkbox"
          id="terms"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          className="mr-2"
        />
        <label htmlFor="terms" className="text-gray-700 font-thin">
          Accept all terms and conditions
        </label>
      </div>
      }
    </div>
  );
};

export default VoiceRecorder;

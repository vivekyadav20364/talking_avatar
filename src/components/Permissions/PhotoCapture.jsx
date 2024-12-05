import React, { useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

const PhotoCapture = ({
  onPhotoCaptured,
  setPublicIdImage,
  isChecked,
  setIsChecked,
}) => {
  const [bolb, setBolb] = useState(null);
  const [image, setImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(true);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // useEffect(() => {
  //   startCamera();
  // }, []);

  useEffect(() => {
    // Call startCamera after the component has mounted and videoRef is available
   // console.log("Videoref", videoRef.current);

    startCamera();
  }, [videoRef]);

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraStarted(true);
      })
      .catch((err) => {
        setCameraStarted(false);
        console.error("Error accessing camera:", err);
      });
  };

  // const startCamera = () => {
  //   if (videoRef.current) {
  //     navigator.mediaDevices.getUserMedia({ video: true })
  //       .then(stream => {
  //         videoRef.current.srcObject = stream; // Accessing the videoRef only if it's not null
  //         videoRef.current.play();
  //         setCameraStarted(true);
  //       })
  //       .catch(err => {
  //         console.error("Error accessing camera:", err);
  //       });
  //   }
  // };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setImage(URL.createObjectURL(blob));
      setBolb(blob);
      setIsCapturing(false);
    }, "image/jpeg");
  };

  const uploadPhoto = async () => {
    if (!(bolb instanceof Blob)) {
      toast.error("Failed to upload photo: Image is not valid.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", bolb, "photo.jpg");
    formData.append("upload_preset", "chat-app");

    try {
      setButtonLoading(true);
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/daruus6qx/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        setButtonLoading(false);
        throw new Error("Upload failed");
      }

      const result = await response.json();
      const { secure_url, public_id } = result;
      onPhotoCaptured(secure_url);
      setPublicIdImage(public_id);

      toast.success("Photo uploaded successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setButtonLoading(false);
      setPhotoUploaded(true);
    } catch (error) {
      toast.error("Failed to upload photo.", {
        position: "top-right",
        autoClose: 3000,
      });
      setButtonLoading(false);
    }
  };

  const retakePhoto = () => {
    setImage(null);
    setIsCapturing(true);
    startCamera();
  };

  // console.log("CAMERA",cameraStarted)

  return (
    <div className="flex flex-col items-center p-6 space-y-4 bg-gray-100 rounded-lg shadow-md">
      {false ? (
        <button
          className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
          onClick={() => {
            startCamera();
            setIsCapturing(true);
          }}
        >
          Start Camera
        </button>
      ) : (
        <>
          {isCapturing ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-64 mb-4 border-2 border-gray-300 rounded-lg"
                autoPlay
              ></video>
              {cameraStarted && 
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300"
                  onClick={capturePhoto}
                >
                  Capture Photo
                </button>
              }
             
             { !cameraStarted && 
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300"
                  onClick={() => startCamera()}
                >
                  Allow Camera
                </button>
             }
            </>
          ) : (
            <>
              <img
                src={image}
                alt="Captured"
                className="w-full h-64 mb-4 border-2 border-gray-300 rounded-lg object-cover"
              />
              <div className="flex space-x-4">
                <button
                  className={`py-2 px-4 rounded-lg shadow-md flex items-center transition-colors duration-300 ${
                    buttonLoading || photoUploaded
                      ? "bg-teal-400 cursor-not-allowed opacity-60"
                      : "bg-teal-500 hover:bg-teal-600"
                  }`}
                  onClick={uploadPhoto}
                  disabled={buttonLoading || photoUploaded}
                  style={{ filter: photoUploaded ? "blur(1px)" : "none" }}
                >
                  {buttonLoading ? (
                    <div className="flex items-center">
                      <CircularProgress
                        size={24}
                        sx={{ color: "white", marginRight: 1 }}
                      />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <span>
                      {photoUploaded ? "Photo Uploaded" : "Upload Photo"}
                    </span>
                  )}
                </button>
                <button
                  className={`py-2 px-4 rounded-lg shadow-md transition-colors duration-300 ${
                    photoUploaded
                      ? "bg-yellow-400 cursor-not-allowed opacity-60"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                  onClick={retakePhoto}
                  disabled={photoUploaded}
                  style={{ filter: photoUploaded ? "blur(1px)" : "none" }}
                >
                  Retake Photo
                </button>
              </div>
            </>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="hidden"></canvas>

      <div className="flex mt-3">
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
    </div>
  );
};

export default PhotoCapture;

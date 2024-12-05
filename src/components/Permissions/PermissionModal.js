import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import MicIcon from "@mui/icons-material/Mic";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const PermissionModal = ({ open,handleBack,handleModalClose}) => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [microphonePermission, setMicrophonePermission] = useState(null);
  const [internetSpeed, setInternetSpeed] = useState(null);
  const [fullscreenPermission, setFullscreenPermission] = useState(false);
  useEffect(() => {
    checkCameraPermission();
    checkMicrophonePermission();
  }, []);

  const checkCameraPermission = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setCameraPermission(true))
      .catch(() => setCameraPermission(false));
  };

  const checkMicrophonePermission = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => setMicrophonePermission(true))
      .catch(() => setMicrophonePermission(false));
  };

  const requestCameraPermission = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setCameraPermission(true))
      .catch(() => setCameraPermission(false));
  };

  const requestMicrophonePermission = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => setMicrophonePermission(true))
      .catch(() => setMicrophonePermission(false));
  };

  const checkInternetSpeed = () => {
    const image = new Image();
    const startTime = new Date().getTime();
    const testImageUrl =
      "https://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg"; // URL of a small test image

    image.onload = () => {
      const endTime = new Date().getTime();
      const duration = (endTime - startTime) / 1000; // Time in seconds
      const imageSize = 183739; // Size of the image in bytes (approx 183 KB)
      const speedMbps = (imageSize * 8) / (duration * 1024 * 1024); // Convert to Mbps

      setInternetSpeed(speedMbps.toFixed(2));
    };

    image.onerror = () => {
      setInternetSpeed("unknown");
    };

    image.src = `${testImageUrl}?t=${startTime}`; // Adding a query parameter to prevent caching
  };

  const checkFullscreenPermission = () => {
    if (document.fullscreenEnabled) {
      setFullscreenPermission(true);
    } else {
      setFullscreenPermission(false);
    }
  };

  const requestFullscreenPermission = () => {
    document.documentElement.requestFullscreen().then(() => {
      setFullscreenPermission(true);
    }).catch(() => {
      setFullscreenPermission(false);
    });
  };

  const canProceed =
    cameraPermission &&
    microphonePermission &&
    internetSpeed > 2 &&
    fullscreenPermission;

  return (
    <>
      <Backdrop open={open} sx={{ zIndex: 999, backdropFilter: "blur(10px)" }} />
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="permission-modal-title"
        aria-describedby="permission-modal-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="permission-modal-title">
          <Typography variant="h6">Provide Permissions</Typography>
        </DialogTitle>
        <DialogContent>
          <Timeline position="alternate">
            <TimelineItem>
              <TimelineOppositeContent
                sx={{ m: "auto 0" }}
                align="right"
                variant="body2"
                color="text.secondary"
              >
                Camera Permission
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color={cameraPermission ? "primary" : "secondary"}>
                  <CameraAltIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Typography variant="h6" component="span">
                  {cameraPermission === null
                    ? "Checking..."
                    : cameraPermission
                    ? "Granted"
                    : "Denied"}
                </Typography>
                &nbsp;&nbsp;
                {cameraPermission === false && (
                  <Button variant="contained" onClick={requestCameraPermission}>
                    Give Access
                  </Button>
                )}
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineOppositeContent
                sx={{ m: "auto 0" }}
                align="right"
                variant="body2"
                color="text.secondary"
              >
                Microphone Permission
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot
                  color={microphonePermission ? "primary" : "secondary"}
                >
                  <MicIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Typography variant="h6" component="span">
                  {microphonePermission === null
                    ? "Checking..."
                    : microphonePermission
                    ? "Granted"
                    : "Denied"}
                </Typography>
                &nbsp;&nbsp;{" "}
                {microphonePermission === false && (
                  <Button
                    variant="contained"
                    onClick={requestMicrophonePermission}
                  >
                    Give Access
                  </Button>
                )}
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineOppositeContent
                sx={{ m: "auto 0" }}
                align="right"
                variant="body2"
                color="text.secondary"
              >
                Fullscreen Permission
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot
                  color={fullscreenPermission ? "primary" : "secondary"}
                >
                  <FullscreenIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Typography variant="h6" component="span">
                  {fullscreenPermission === null
                    ? "Not Checked"
                    : fullscreenPermission
                    ? "Granted"
                    : "Denied"}
                </Typography>
                &nbsp;&nbsp;
                {fullscreenPermission === false && (
                  <Button
                    variant="contained"
                    onClick={requestFullscreenPermission}
                  >
                    Request Fullscreen
                  </Button>
                )}
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineOppositeContent
                sx={{ m: "auto 0" }}
                align="right"
                variant="body2"
                color="text.secondary"
              >
                Internet Speed
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot
                  color={internetSpeed > 2 ? "primary" : "secondary"}
                >
                  <NetworkCheckIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Button variant="contained" onClick={checkInternetSpeed}>
                  Check Speed
                </Button>
                &nbsp;&nbsp;
                {internetSpeed !== null && (
                  <Typography variant="h6" component="span">
                    {internetSpeed === "unknown"
                      ? "Unknown"
                      : `${internetSpeed} Mbps`}
                  </Typography>
                )}
              </TimelineContent>
            </TimelineItem>

          </Timeline>

          <Button
            variant="contained"
            color="primary"
            onClick={handleModalClose}
            disabled={!canProceed}
            sx={{ mt: 2 }}
          >
            Proceed
          </Button>
          {/* <Button
            variant="outlined"
            color="secondary"
            onClick={handleBack}
            sx={{ mt: 2, ml: 2 }}
          >
            Back
          </Button> */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PermissionModal;

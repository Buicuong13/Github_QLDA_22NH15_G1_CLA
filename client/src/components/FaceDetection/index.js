import { useEffect, useState, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./FaceDetection.module.scss";

const cx = classNames.bind(styles);

const FaceDetection = ({ onSuccess }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [captureStatus, setCaptureStatus] = useState("");
  const [faceId, setFaceId] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [recognizing, setRecognizing] = useState(false);
  const pollInterval = useRef(null);

  useEffect(() => {
    return () => {
      if (isStreaming || recognizing) {
        stopStreaming();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStreaming, recognizing]);

  // Polling function to check recognize status
  useEffect(() => {
    if (recognizing) {
      pollInterval.current = setInterval(async () => {
        try {
          const res = await fetch("http://localhost:8000/recognize_status");
          const data = await res.json();
          if (data.success) {
            clearInterval(pollInterval.current);
            setRecognizing(false);
            setImgSrc("");
            setTimeout(() => {
              if (onSuccess) onSuccess();
            }, 800); // delay 0.8s cho camera kịp hiện
          }
        } catch (err) {
          // ignore
        }
      }, 1500);
    } else {
      clearInterval(pollInterval.current);
    }
    return () => clearInterval(pollInterval.current);
  }, [recognizing, onSuccess]);

  const startStreaming = () => {
    if (!faceId.trim()) {
      setCaptureStatus("Please enter your name before starting the camera");
      return;
    }

    const streamUrl = `http://localhost:8000/get_face?face_id=${encodeURIComponent(
      faceId
    )}&timestamp=${Date.now()}`;
    setImgSrc(streamUrl);
    setIsStreaming(true);
    setCaptureStatus("");
  };

  const recognizeFace = () => {
    if (!faceId.trim()) {
      setCaptureStatus("Please enter your name before recognizing");
      return;
    }
    const streamUrl = `http://localhost:8000/recognize_face?face_id=${encodeURIComponent(
      faceId
    )}&timestamp=${Date.now()}`;
    setImgSrc(streamUrl);
    setRecognizing(true);
    setCaptureStatus("");
  };

  const stopStreaming = async () => {
    try {
      const stopUrl = recognizing
        ? "http://localhost:8000/stop_recognize_face"
        : "http://localhost:8000/stop_get_face";

      const response = await fetch(stopUrl);
      if (!response.ok) {
        console.error("Error stopping the camera");
      }
    } catch (error) {
      console.error("Connection error to the server:", error);
    } finally {
      setImgSrc("");
      setIsStreaming(false);
      setRecognizing(false);
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("videoWrapper")}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt="Face Detection Stream"
            className={cx("video")}
          />
        ) : (
          <div className={cx("video", "videoPlaceholder")}>Camera Off</div>
        )}
      </div>

      <div className={cx("controls")}>
        <div className={cx("row")}>
          <input
            type="text"
            value={faceId}
            onChange={(e) => setFaceId(e.target.value)}
            placeholder="Enter your name"
            className={cx("input")}
            disabled={isStreaming || recognizing}
          />
          {!isStreaming ? (
            <button
              onClick={startStreaming}
              className={cx("button", {
                disabled: !faceId.trim() || recognizing,
                blue: faceId.trim() && !recognizing,
              })}
              disabled={!faceId.trim() || recognizing}
            >
              Start Streaming
            </button>
          ) : (
            <button onClick={stopStreaming} className={cx("button", "red")}>
              Stop Streaming
            </button>
          )}
        </div>

        <div className={cx("row")}>
          {!recognizing ? (
            <button
              onClick={recognizeFace}
              disabled={!faceId.trim() || isStreaming}
              className={cx("button", {
                disabled: !faceId.trim() || isStreaming,
                green: faceId.trim() && !isStreaming,
              })}
            >
              Recognize Face
            </button>
          ) : (
            <button onClick={stopStreaming} className={cx("button", "red")}>
              Stop Recognizing
            </button>
          )}
        </div>

        {captureStatus && (
          <div className={cx("statusMessage")}>
            <p>{captureStatus}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceDetection;

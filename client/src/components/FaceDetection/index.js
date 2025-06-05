import { useEffect, useState, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./FaceDetection.module.scss";
import * as userService from "../../services/userService.js";

const cx = classNames.bind(styles);

const FaceDetection = ({ onSuccess }) => {
  const [imgSrc, setImgSrc] = useState("");
  const [recognizing, setRecognizing] = useState(false);
  const pollInterval = useRef(null);

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await userService.getUser();
        setUser({
          name: res.name,
          email: res.email,
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (localStorage.getItem("authToken")) {
      fetchApi();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (recognizing) {
        stopStreaming();
      }
    };
  }, [recognizing]);

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
            setTimeout(() => {
              setImgSrc("");
              if (onSuccess) onSuccess();
            }, 3000); // delay 5s để hiển thị nhận diện khuôn mặt trước khi chuyển trang
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

  const recognizeFace = () => {
    // const faceId = "default"; // hardcoded or backend handles default
    const streamUrl = `http://localhost:8000/recognize_face?face_id=${
      user.name
    }&timestamp=${Date.now()}`;
    setImgSrc(streamUrl);
    setRecognizing(true);
  };

  const stopStreaming = async () => {
    try {
      const stopUrl = "http://localhost:8000/stop_recognize_face";
      const response = await fetch(stopUrl);
      if (!response.ok) {
        console.error("Error stopping the camera");
      }
    } catch (error) {
      console.error("Connection error to the server:", error);
    } finally {
      setImgSrc("");
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
          {!recognizing ? (
            <button onClick={recognizeFace} className={cx("button", "green")}>
              Recognize Face
            </button>
          ) : (
            <button onClick={stopStreaming} className={cx("button", "red")}>
              Stop Recognizing
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceDetection;

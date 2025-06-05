import { useEffect, useState, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./FaceScan.module.scss";
import * as userService from "../../services/userService.js";

const cx = classNames.bind(styles);

const FaceScan = ({ onSuccess }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [captureStatus, setCaptureStatus] = useState("");
  const [imgSrc, setImgSrc] = useState("");
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
      if (isStreaming) {
        stopStreaming();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStreaming]);

  const startStreaming = () => {
    // Nếu bạn không dùng input nữa thì có thể dùng faceId cố định

    const streamUrl = `http://localhost:8000/get_face?face_id=${
      user.name
    }&timestamp=${Date.now()}`;
    setImgSrc(streamUrl);
    setIsStreaming(true);
    setCaptureStatus("");
  };

  const stopStreaming = async () => {
    try {
      const response = await fetch("http://localhost:8000/stop_get_face");
      if (!response.ok) {
        console.error("Error stopping the camera");
      }
    } catch (error) {
      console.error("Connection error to the server:", error);
    } finally {
      setImgSrc("");
      setIsStreaming(false);
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
          {!isStreaming ? (
            <button onClick={startStreaming} className={cx("button", "blue")}>
              Start Streaming
            </button>
          ) : (
            <button onClick={stopStreaming} className={cx("button", "red")}>
              Stop Streaming
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

export default FaceScan;

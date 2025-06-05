import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatBox.module.scss";

const botIcon = "🤖";
const userIcon = "🧑";

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Bạn cần hỗ trợ gì?" }
  ]);
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [iconPosition, setIconPosition] = useState({ right: 32, bottom: 32 });
  const chatEndRef = useRef(null);
  const iconRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, minimized]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging.current) return;
      const x = window.innerWidth - e.clientX - dragOffset.current.x;
      const y = window.innerHeight - e.clientY - dragOffset.current.y;
      setIconPosition({ right: Math.max(x, 0), bottom: Math.max(y, 0) });
    };
    const handleMouseUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startDrag = (e) => {
    dragging.current = true;
    const rect = iconRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: rect.right - e.clientX,
      y: rect.bottom - e.clientY
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const question = input.trim();
    setMessages(msgs => [...msgs, { from: "user", text: question }]);
    setInput("");
    try {
      const res = await fetch("http://localhost:8080/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      setMessages(msgs => [
        ...msgs,
        { from: "bot", text: data.answer || "Xin lỗi, tôi chưa có câu trả lời." }
      ]);
    } catch (error) {
      setMessages(msgs => [
        ...msgs,
        { from: "bot", text: "Có lỗi xảy ra, vui lòng thử lại sau." }
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!showChat) {
    return (
      <div
        ref={iconRef}
        className={styles.floatingIcon}
        style={{ right: iconPosition.right, bottom: iconPosition.bottom }}
        onMouseDown={startDrag}
        onClick={() => setShowChat(true)}
        title="Chatbot hỗ trợ"
      >
        🤖
      </div>
    );
  }

  return (
    <div
      className={`${styles.chatbox} ${minimized ? styles.minimized : ""}`}
      style={{ right: iconPosition.right, bottom: iconPosition.bottom }}
    >
      <div className={styles.header}>
        Hỗ trợ trực tuyến
        <div className={styles['header-actions']}>
          <button
            className={styles.minimizeBtn}
            onClick={() => setMinimized(!minimized)}
            title={minimized ? "Mở rộng" : "Thu nhỏ"}
          >
            {minimized ? "🔼" : "🔽"}
          </button>
          <button
            className={styles.minimizeBtn}
            onClick={() => setShowChat(false)}
            title="Đóng chatbot"
          >
            ❌
          </button>
        </div>
      </div>
      {!minimized && (
        <>
          <div className={styles.messages}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.from === "user"
                    ? styles.userMsgWrapper
                    : styles.botMsgWrapper
                }
              >
                <span className={styles.icon}>
                  {msg.from === "user" ? userIcon : botIcon}
                </span>
                <div
                  className={
                    msg.from === "user" ? styles.user : styles.bot
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className={styles.inputArea}>
            <input
              type="text"
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
            />
            <button type="button" onClick={handleSend}>Gửi</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
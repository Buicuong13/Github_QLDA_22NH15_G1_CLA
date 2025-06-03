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
  const [isComposing, setIsComposing] = useState(false); // Thêm dòng này
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, minimized]);

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

  return (
    <div className={`${styles.chatbox} ${minimized ? styles.minimized : ""}`}>
      <div className={styles.header}>
        Hỗ trợ trực tuyến
        <button
          className={styles.minimizeBtn}
          onClick={() => setMinimized(!minimized)}
          title={minimized ? "Mở rộng" : "Thu nhỏ"}
        >
          {minimized ? "🔼" : "🔽"}
        </button>
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
              onCompositionStart={() => setIsComposing(true)}   // Thêm dòng này
              onCompositionEnd={() => setIsComposing(false)}    // Thêm dòng này
            />
            <button type="button" onClick={handleSend}>Gửi</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
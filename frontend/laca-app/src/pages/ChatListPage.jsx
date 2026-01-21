import React from "react";
import { useNavigate } from "react-router-dom";

const ChatListPage = () => {
  const navigate = useNavigate();

  // Dữ liệu giả lập
  const chatData = [
    { id: 1, name: "user A", msg: "Contents", time: "Date/Time" },
    { id: 2, name: "user A", msg: "Contents", time: "Date/Time" },
    { id: 3, name: "user A", msg: "Contents", time: "Date/Time" },
    { id: 4, name: "user A", msg: "Contents", time: "Date/Time" },
  ];

  return (
    <div className="auth-form">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h2 className="page-title">Chat</h2>
      </div>

      {/* Danh sách Chat */}
      <div className="chat-list">
        {chatData.map((chat) => (
          <div
            key={chat.id}
            className="chat-item"
            onClick={() => navigate("/chat/detail")}
          >
            {/* Avatar tròn xám */}
            <div className="avatar-circle"></div>

            <div className="chat-info">
              <h4 className="chat-name">{chat.name}</h4>
              <p className="chat-preview">{chat.msg}</p>
            </div>

            <span className="chat-time">{chat.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatListPage;

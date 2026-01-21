import React from "react";
import { useNavigate } from "react-router-dom";
import "./Chat.css";

const ChatDetailPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="auth-form"
      style={{ position: "relative", minHeight: "80vh" }}
    >
      {/* Header: User A + Status */}
      <div className="page-header" style={{ borderBottom: "1px solid #ccc" }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <div
          className="avatar-circle"
          style={{ width: "40px", height: "40px" }}
        ></div>
        <div className="chat-header-info">
          <span style={{ fontWeight: "bold" }}>User A</span>
          <span className="status-text">On/Offline</span>
        </div>
      </div>

      {/* Khu vực nội dung tin nhắn */}
      <div className="message-container">
        {/* 1. Tin nhắn Hình ảnh (Bên trái - Người khác gửi) */}
        <div className="message-row">
          <div className="message-image">
            {/* Dùng ảnh demo trên mạng cho giống cái kệ hàng */}
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=60"
              alt="Snack shelf"
            />
          </div>
        </div>

        {/* 2. Tin nhắn text (Bên trái) */}
        <div className="message-row">
          <div
            className="avatar-circle"
            style={{ width: "30px", height: "30px" }}
          ></div>
          <div className="bubble received">...</div>
        </div>

        {/* 3. Tin nhắn text (Bên phải - Mình gửi) */}
        <div className="message-row me">
          <div className="bubble sent">...</div>
        </div>

        {/* 4. Tin nhắn text (Bên trái) */}
        <div className="message-row">
          <div
            className="avatar-circle"
            style={{ width: "30px", height: "30px" }}
          ></div>
          <div className="bubble received">...</div>
        </div>
      </div>

      {/* Thanh nhập liệu ở dưới cùng */}
      <div className="chat-input-bar">
        <input type="text" className="input-rounded" placeholder="" />
        <button className="send-btn-circle">↑ {/* Dấu mũi tên lên */}</button>
      </div>
    </div>
  );
};

export default ChatDetailPage;

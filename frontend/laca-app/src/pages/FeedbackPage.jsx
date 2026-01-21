import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Dùng để làm nút Back
import GradientButton from "../components/ui/GradientButton";
import TextArea from "../components/ui/TextArea";

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    // Logic gửi Feedback sẽ viết ở đây
    console.log("Feedback sent:", content);
    alert("Cảm ơn bạn đã gửi góp ý!");
    navigate("/"); // Gửi xong quay về trang chủ (hoặc trang trước đó)
  };

  return (
    <div className="auth-form">
      {/* Header: Nút Back + Tiêu đề */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h2 className="page-title">Feedback</h2>
      </div>

      {/* Ô nhập nội dung */}
      <TextArea
        placeholder="Hi LACA team, I want LACA has a function that..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={12} // Độ cao của ô nhập
      />

      {/* Nút Submit */}
      <div style={{ marginTop: "20px" }}>
        <GradientButton text="SUBMIT" onClick={handleSubmit} />
      </div>
    </div>
  );
};
export default FeedbackPage;

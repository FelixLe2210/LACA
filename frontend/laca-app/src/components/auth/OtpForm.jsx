// src/components/auth/OtpForm.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GradientButton from '../ui/GradientButton';
import './OtpForm.css';

// Hàm che email (Vd: user@gmail.com -> u***r@gmail.com)
const maskEmail = (email) => {
  if (!email) return 'your@email.com'; // Giá trị mặc định nếu không có email
  const [name, domain] = email.split('@');
  if (name.length <= 2) {
    // Nếu tên quá ngắn, chỉ giữ lại ký tự đầu
    return `${name[0]}***@${domain}`;
  }
  // Giữ ký tự đầu và cuối của tên
  const maskedName = `${name[0]}***${name[name.length - 1]}`;
  return `${maskedName}@${domain}`;
};

const OtpForm = ({ email, onOtpSuccess }) => {
  const [countdown, setCountdown] = useState(60); // Đếm ngược 60 giây
  const [canResend, setCanResend] = useState(false); // Trạng thái nút gửi lại

  // Logic đếm ngược
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      setCanResend(true); // Cho phép gửi lại khi đếm ngược về 0
    }
    // Dọn dẹp timer khi component bị hủy hoặc countdown thay đổi
    return () => clearTimeout(timer);
  }, [countdown]);

  // Xử lý khi bấm nút "Resend"
  const handleResend = () => {
    if (canResend) {
      console.log("Resending OTP to:", email);
      // Gọi API gửi lại OTP ở đây...
      
      // Reset lại bộ đếm
      setCountdown(60);
      setCanResend(false);
    }
  };

  // Logic tự động nhảy sang ô tiếp theo khi nhập
  const handleInputChange = (e) => {
    if(e.target.value.length === 1 && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  // Xử lý khi bấm nút xóa (Backspace) để quay lui
  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  return (
    <div>
      <h3 className="step-title">Verify Email Address</h3>
      
      <div className="otp-container">
        {[...Array(6)].map((_, index) => (
          <input 
            key={index} 
            type="text" 
            maxLength="1" 
            className="otp-box" 
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        ))}
      </div>

      {/* Hiển thị email đã bị che */}
      <p className="sub-text">
        We have sent a reset <strong>OTP</strong> to <strong>{maskEmail(email)}</strong>
      </p>

      {/* Phần hiển thị bộ đếm và nút gửi lại */}
      <p className="resend-container">
        Can’t get email? 
        {canResend ? (
          // Nếu được phép gửi lại thì hiện link
          <span className="link-text" onClick={handleResend}> Resend</span>
        ) : (
          // Nếu đang đếm ngược thì hiện text màu xám
          <span className="countdown-text"> Resend (CD {countdown}s)</span>
        )}
      </p>
      
      <GradientButton text="SUBMIT" onClick={onOtpSuccess} />
      
      <div className="footer-container">
          <span className="footer-text">Remember password? </span>
          <Link to="/login" className="link-bold">Log in</Link>
      </div>
    </div>
  );
};

export default OtpForm;

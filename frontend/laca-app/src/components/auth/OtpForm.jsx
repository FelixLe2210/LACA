import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GradientButton from '../ui/GradientButton';
import './OtpForm.css';

// Hàm che email (Ví dụ: nhat.huy@gmail.com -> n***y@gmail.com)
const maskEmail = (email) => {
  if (!email) return 'your@email.com';
  const [name, domain] = email.split('@');

  if (name.length <= 2) {
    return `${name[0]}***@${domain}`;
  }

  // Lấy ký tự đầu + *** + ký tự cuối của tên
  const maskedName = `${name[0]}***${name[name.length - 1]}`;
  return `${maskedName}@${domain}`;
};

const OtpForm = ({ email, onOtpSuccess }) => {
  const [countdown, setCountdown] = useState(60); // Đếm ngược 60s
  const [canResend, setCanResend] = useState(false);

  // Logic đếm ngược
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = () => {
    if (canResend) {
      console.log("Resending OTP to:", email);
      setCountdown(60);
      setCanResend(false);
    }
  };

  const handleInputChange = (e) => {
    if(e.target.value.length === 1 && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

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
            key={index} type="text" maxLength="1" 
            className="otp-box" 
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        ))}
      </div>

      {/* Hiển thị email đã được che */}
      <p className="sub-text">
        We have sent a reset <strong>OTP</strong> to <strong>{maskEmail(email)}</strong>
      </p>

      {/* Bộ đếm ngược theo đúng thiết kế */}
      <p className="resend-container">
        Can’t get email? 
        {canResend ? (
          <span className="link-text" onClick={handleResend}> Resend</span>
        ) : (
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
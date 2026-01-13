import React from "react";
import { Link } from "react-router-dom";
import GradientButton from "../ui/GradientButton";
import "./OtpForm.css";

const OtpForm = ({ email, onOtpSuccess }) => {
  const handleInputChange = (e) => {
    if (e.target.value.length === 1 && e.target.nextSibling) {
      e.target.nextSibling.focus();
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
          />
        ))}
      </div>
      <p className="sub-text">
        We have sent an <strong>OTP</strong> to {email}
      </p>
      <p className="resend-text">
        Can't get email? <span className="link-text">Resend</span>
      </p>

      <GradientButton text="SUBMIT" onClick={onOtpSuccess} />

      <div className="footer-container">
        <span className="footer-text">Remember password? </span>
        <Link to="/login" className="link-bold">
          Log in
        </Link>
      </div>
    </div>
  );
};

export default OtpForm;

// src/components/auth/ForgotPassword.jsx
// Component quên mật khẩu đã tích hợp API

import React, { useState, useRef, useEffect } from "react";
import {
  sendOTP,
  verifyOTP,
  resendOTP,
  resetPassword,
} from "../../api/auth.api";
import "./ForgotPassword.css";
import logo from "../../assets/images/laca-logo.png";

const ForgotPassword = () => {
  // State quản lý bước hiện tại (1-5)
  const [step, setStep] = useState(1);

  // State lưu email người dùng nhập
  const [email, setEmail] = useState("");

  // State lưu mã OTP (mảng 6 số)
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // State lưu mật khẩu mới
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State đếm ngược thời gian gửi lại OTP
  const [countdown, setCountdown] = useState(0);

  // State loading và error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Refs cho các ô input OTP
  const otpRefs = useRef([]);

  // Hook đếm ngược thời gian
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Hàm xử lý khi nhấn nút OTP ở bước 1
  const handleRequestOTP = async () => {
    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setLoading(true);
    setError("");

    /* Gọi API gửi OTP
    const result = await sendOTP(email); */

    // Mock response cho demo
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Giả lập delay 1s
    const result = { success: true, message: "OTP sent successfully" };

    setLoading(false);

    if (result.success) {
      setStep(2); // Chỉ chuyển sang bước 2 khi request thành công
      setCountdown(60); // Bắt đầu đếm ngược 60 giây
      // Focus vào ô OTP đầu tiên
      setTimeout(() => {
        if (otpRefs.current[0]) {
          otpRefs.current[0].focus();
        }
      }, 100);
    } else {
      setError(result.message);
      // Giữ nguyên ở bước 1 khi request thất bại
    }
  };

  // Hàm xử lý khi thay đổi giá trị OTP
  const handleOtpChange = (index, value) => {
    // Chỉ cho phép nhập số
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(""); // Clear error khi user nhập

    // Tự động chuyển sang ô tiếp theo khi nhập xong
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  // Hàm xử lý khi nhấn phím trong ô OTP
  const handleOtpKeyDown = (index, e) => {
    // Xử lý phím Backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // Hàm xử lý submit OTP
  const handleSubmitOTP = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 số OTP");
      return;
    }

    setLoading(true);
    setError("");

    /* Gọi API xác thực OTP
    const result = await verifyOTP(email, otpCode); */

    // Mock response cho demo
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const result = { success: true, message: "OTP verified" };

    setLoading(false);

    if (result.success) {
      setStep(4); // Chuyển sang màn hình SUCCESS
    } else {
      setError(result.message);
      // Clear OTP khi sai
      setOtp(["", "", "", "", "", ""]);
      if (otpRefs.current[0]) {
        otpRefs.current[0].focus();
      }
    }
  };

  // Hàm xử lý gửi lại OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setError("");

    /* Gọi API gửi lại OTP
    const result = await resendOTP(email); */

    // Mock response cho demo
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const result = { success: true, message: "OTP resent" };

    setLoading(false);

    if (result.success) {
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      if (otpRefs.current[0]) {
        otpRefs.current[0].focus();
      }
    } else {
      setError(result.message);
    }
  };

  // Hàm xử lý reset mật khẩu ở bước 5
  const handleResetPassword = async () => {
    // Validation
    if (!newPassword) {
      setError("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    setError("");

    /* Gọi API reset password
    const otpCode = otp.join("");
    const result = await resetPassword(email, otpCode, newPassword); */

    // Mock response cho demo
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const result = { success: true, message: "Password reset successfully" };

    setLoading(false);

    if (result.success) {
      alert("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
      // Chuyển về trang đăng nhập
      window.location.href = "/login";
    } else {
      setError(result.message);
    }
  };

  // Hàm ẩn email (ví dụ: user@gmail.com -> u***r@gmail.com)
  const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (name.length <= 2) return email;
    return `${name[0]}${"*".repeat(name.length - 2)}${
      name[name.length - 1]
    }@${domain}`;
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="LACA Logo" className="logo" />
        </div>

        {/* Hiển thị error message */}
        {error && <div className="error-message">{error}</div>}

        {/* BƯỚC 1: Nhập email */}
        {step === 1 && (
          <>
            <h2 className="title">FORGET PASSWORD</h2>
            <p className="subtitle">Enter your registered email bellow</p>

            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="email-input"
                placeholder="Enter your email"
                disabled={loading}
              />
              <button
                onClick={handleRequestOTP}
                className="otp-button"
                disabled={loading || !email}
              >
                {loading ? "Sending..." : "OTP"}
              </button>
            </div>

            <button
              onClick={handleRequestOTP}
              className="submit-button"
              disabled={loading || !email}
            >
              {loading ? "SUBMITTING..." : "SUBMIT"}
            </button>

            <p className="footer">
              Remember password?{" "}
              <a href="/login" className="link">
                Log in
              </a>
            </p>
          </>
        )}

        {/* BƯỚC 2 & 3: Nhập OTP */}
        {(step === 2 || step === 3) && (
          <>
            <h2 className="title">Forget Password</h2>
            <p className="subtitle">Enter your registered email bellow</p>

            <div className="input-group">
              <input
                type="email"
                value={email}
                readOnly
                className="email-input"
              />
              <button className="otp-button">OTP</button>
            </div>

            <div className="otp-boxes">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="otp-box-input"
                  disabled={loading}
                />
              ))}
            </div>

            <p className="otp-sent-message">
              We have sent a reset <strong>OTP</strong> to {maskEmail(email)}
            </p>

            <p className="resend-text">
              Can't get email?{" "}
              <button
                onClick={handleResendOTP}
                className="resend-link"
                disabled={countdown > 0 || loading}
              >
                Resumit {countdown > 0 && `(CD ${countdown}s)`}
              </button>
            </p>

            <button
              onClick={handleSubmitOTP}
              className="submit-button"
              disabled={loading || otp.join("").length !== 6}
            >
              {loading ? "VERIFYING..." : "SUBMIT"}
            </button>

            <p className="footer">
              Remember password?{" "}
              <a href="/login" className="link">
                Log in
              </a>
            </p>
          </>
        )}

        {/* BƯỚC 4: Thành công - Chuyển hướng */}
        {step === 4 && (
          <>
            <h1 className="success-title">SUCCESS</h1>
            <p className="success-message">
              Now we will transfer you to
              <br />
              reset password page
            </p>

            <button onClick={() => setStep(5)} className="continue-button">
              CONTINUE
            </button>
          </>
        )}

        {/* BƯỚC 5: Đặt lại mật khẩu mới */}
        {step === 5 && (
          <>
            <h2 className="title">New Password</h2>

            <div className="password-group">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                className="password-input"
                placeholder="Enter new password"
                disabled={loading}
              />
            </div>

            <h2 className="title">Confirm Password</h2>

            <div className="password-group">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                className="password-input"
                placeholder="Confirm password"
                disabled={loading}
              />
            </div>

            <button
              onClick={handleResetPassword}
              className="submit-button reset-btn"
              disabled={
                loading || !newPassword || newPassword !== confirmPassword
              }
            >
              {loading ? "RESETTING..." : "RESET PASSWORD"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

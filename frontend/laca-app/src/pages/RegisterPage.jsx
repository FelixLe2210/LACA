import React, { useState } from "react";
import { Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import OtpForm from "../components/auth/OtpForm";
import GradientButton from "../components/ui/GradientButton"; // Import nút bấm
import lacaLogo from "../assets/images/laca_logo.png";

const RegisterPage = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Success
  const [registeredEmail, setRegisteredEmail] = useState("");

  // Xử lý khi xong Step 1
  const handleRegisterSuccess = (email) => {
    setRegisteredEmail(email);
    setStep(2);
  };

  // Xử lý khi xong Step 2 (Bấm Submit OTP)
  const handleOtpSuccess = () => {
    // Tại đây có thể gọi API verify OTP...
    // Nếu OK thì chuyển sang bước 3
    setStep(3);
  };

  return (
    <div className="auth-form">
      <div className="logo-section">
        <img src={lacaLogo} alt="LACA Logo" className="brand-logo" />
      </div>

      {/* --- BƯỚC 1: NHẬP THÔNG TIN --- */}
      {step === 1 && <RegisterForm onRegisterSuccess={handleRegisterSuccess} />}

      {/* --- BƯỚC 2: NHẬP OTP --- */}
      {step === 2 && (
        <OtpForm
          email={registeredEmail}
          onOtpSuccess={handleOtpSuccess} // Truyền hàm chuyển bước vào đây
        />
      )}

      {/* --- BƯỚC 3: THÔNG BÁO THÀNH CÔNG --- */}
      {step === 3 && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <h2
            style={{
              color: "#000",
              fontSize: "28px",
              fontWeight: "800",
              marginBottom: "10px",
            }}
          >
            SUCCESS
          </h2>
          <p style={{ color: "#555", marginBottom: "30px", fontSize: "16px" }}>
            Welcome to LACA Family!
          </p>

          <Link to="/login" style={{ textDecoration: "none" }}>
            <GradientButton text="BACK TO LOG IN" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;

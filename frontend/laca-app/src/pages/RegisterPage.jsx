// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import RegisterForm from "../components/auth/RegisterForm";
import OtpForm from "../components/auth/OtpForm";
// Đảm bảo đường dẫn ảnh đúng
import lacaLogo from "../assets/images/laca_logo.png";

const RegisterPage = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: OTP

  return (
    <div className="auth-form">
      <div className="logo-section">
        {/* Luôn hiển thị logo LACA ở mọi bước đăng ký */}
        <img src={lacaLogo} alt="LACA Logo" className="brand-logo" />
      </div>

      {step === 1 && <RegisterForm onRegisterSuccess={() => setStep(2)} />}

      {step === 2 && <OtpForm />}
    </div>
  );
};

export default RegisterPage;

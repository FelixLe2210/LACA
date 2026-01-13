import React, { useState } from "react";
import { Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import OtpForm from "../components/auth/OtpForm";
import GradientButton from "../components/ui/GradientButton";
import lacaLogo from "../assets/images/laca_logo.png";
import lacaText from "../assets/images/laca_text.png";

const RegisterPage = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Success
  const [registeredEmail, setRegisteredEmail] = useState("");

  return (
    <div className="auth-form">
      {/* Logo Logic */}
      <div className="logo-section">
        {step === 1 ? (
          <img src={lacaText} alt="LACA Text" className="text-logo-img" />
        ) : (
          <img src={lacaLogo} alt="LACA Logo" className="brand-logo" />
        )}
      </div>

      {/* Step 1: Form Đăng ký */}
      {step === 1 && (
        <RegisterForm
          onRegisterSuccess={(email) => {
            setRegisteredEmail(email);
            setStep(2);
          }}
        />
      )}

      {/* Step 2: Nhập OTP */}
      {step === 2 && (
        <OtpForm email={registeredEmail} onOtpSuccess={() => setStep(3)} />
      )}

      {/* Step 3: Thành công */}
      {step === 3 && (
        <div className="success-screen">
          <h2 className="success-title">SUCCESS</h2>
          <p className="sub-text">Welcome to LACA Family</p>
          <Link to="/login">
            <GradientButton text="BACK TO LOG IN" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;

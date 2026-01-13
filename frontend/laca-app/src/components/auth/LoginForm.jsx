import React, { useState } from "react";
import { Link } from "react-router-dom"; // Dùng Link để chuyển trang
import InputField from "../ui/InputField";
import GradientButton from "../ui/GradientButton";
import "./LoginForm.css"; // Import CSS riêng

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", email);
    alert("Đăng nhập thành công (Demo)!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="login-options">
        <label className="checkbox-container">
          <input type="checkbox" /> <span>Remember me</span>
        </label>
        {/* Link tạm thời về trang chủ vì chưa làm chức năng này */}
        <Link to="/" className="forgot-link">
          Forgot password?
        </Link>
      </div>

      <GradientButton text="LOG IN" type="submit" />

      <p className="footer-text">
        Don't have an account?
        <Link to="/register" className="link-bold">
          {" "}
          Sign Up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;

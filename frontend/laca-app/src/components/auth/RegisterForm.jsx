import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../ui/InputField";
import GradientButton from "../ui/GradientButton";

const RegisterForm = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate dữ liệu (nếu cần)
    console.log("Register data:", formData);

    // QUAN TRỌNG: Truyền email ra ngoài kèm theo sự kiện thành công
    onRegisterSuccess(formData.email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Full Name"
        type="text"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
      />
      <InputField
        label="Username"
        type="text"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <InputField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <InputField
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <InputField
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) =>
          setFormData({ ...formData, confirmPassword: e.target.value })
        }
      />

      <GradientButton text="GET STARTED" type="submit" />

      <p className="footer-text">
        Already have an account?
        <Link to="/login" className="link-bold">
          {" "}
          Log in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;

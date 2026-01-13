import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const sendOTP = async (email) => {
  try {
    const res = await apiClient.post("/auth/forgot-password/send-otp", {
      email,
    });
    return { success: true, message: "OTP đã được gửi", data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Gửi OTP thất bại",
    };
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const res = await apiClient.post("/auth/forgot-password/verify-otp", {
      email,
      otp,
    });
    return { success: true, message: "OTP hợp lệ", data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "OTP không hợp lệ",
    };
  }
};

export const resendOTP = async (email) => {
  try {
    const res = await apiClient.post("/auth/forgot-password/resend-otp", {
      email,
    });
    return { success: true, message: "OTP mới đã gửi", data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Không thể gửi lại OTP",
    };
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    const res = await apiClient.post("/auth/forgot-password/reset", {
      email,
      otp,
      new_password: newPassword,
    });
    return {
      success: true,
      message: "Reset mật khẩu thành công",
      data: res.data,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Reset thất bại",
    };
  }
};

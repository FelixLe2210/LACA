import { Routes, Route } from "react-router-dom";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ForgotPasswordPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    </Routes>
  );
}

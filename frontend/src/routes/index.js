import { Routes, Route } from "react-router-dom";

import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import Map from "../pages/Map";

import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../components/admin/AdminDashboard";
import UserManagement from "../components/admin/UserManagement";
import ContentModeration from "../components/admin/ContentModeration";
import MapManagement from "../components/admin/MapManagement";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<ForgotPasswordPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/map" element={<Map />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="content" element={<ContentModeration />} />
        <Route path="map" element={<MapManagement />} />
      </Route>
    </Routes>
  );
}

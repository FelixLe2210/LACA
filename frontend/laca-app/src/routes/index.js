import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import FeedbackPage from '../pages/FeedbackPage';
import ReportPage from '../pages/ReportPage';
import ChatListPage from '../pages/ChatListPage';
import ChatDetailPage from '../pages/ChatDetailPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Vào trang chủ tự động chuyển sang login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/chat" element={<ChatListPage />} />
        <Route path="/chat/detail" element={<ChatDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
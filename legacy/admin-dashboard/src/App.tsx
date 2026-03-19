// src/App.tsx
import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import UserListPage from './pages/UserListPage';
import VendorListPage from './pages/VendorListPage';
import LoginPage from './pages/LoginPage'; // Import lại LoginPage
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext'; // Import useAuth để kiểm tra đăng nhập

// Layout chung cho các trang admin sau khi đăng nhập
const AdminLayout = () => {
  const { isAuthenticated } = useAuth(); // Kiểm tra xem đã đăng nhập chưa

  // Nếu chưa đăng nhập, chuyển về trang login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Nếu đã đăng nhập, hiển thị layout
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      {/* ✅ SỬA LỖI: 
        Thêm 'ml-64' (margin-left: 16rem) vào đây.
        Vì Sidebar là 'fixed' và 'w-64', 
        khối nội dung chính này cần phải được đẩy sang phải 
        một khoảng đúng bằng chiều rộng của Sidebar.
      */}
      <div className="flex flex-1 flex-col overflow-hidden ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
           {/* Các route con sẽ được render ở đây */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Route 1: Trang Login (không cần bảo vệ) */}
      {/* Nó sẽ tự chuyển hướng vào /dashboard nếu đã đăng nhập (logic trong LoginPage) */}
      <Route path="/" element={<LoginPage />} />

      {/* Route 2: Layout Admin (bao gồm các trang được bảo vệ) */}
      <Route element={<ProtectedRoute />}> {/* Bọc bởi ProtectedRoute */}
        <Route element={<AdminLayout />}> {/* Layout chung */}
          {/* Trang mặc định sau login */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UserListPage />} />
          <Route path="/vendors" element={<VendorListPage />} />
          {/* Thêm các route admin khác ở đây */}
        </Route>
      </Route>

      {/* Route bắt lỗi 404 */}
      <Route path="*" element={
          <div className="flex h-screen items-center justify-center text-center text-2xl font-bold text-gray-700">
              404 - Trang không tìm thấy
          </div>
      } />
    </Routes>
  );
}

export default App;
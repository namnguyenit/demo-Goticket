import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Component loading đơn giản, bạn có thể thay bằng spinner đẹp hơn
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#5B2642]" />
            <p className='ml-4 text-gray-600'>Đang kiểm tra quyền...</p>
        </div>
    ); 
  }

  // Nếu đã đăng nhập và là admin, cho phép truy cập
  if (isAuthenticated) {
    return <Outlet />;
  }

  // Nếu chưa đăng nhập, chuyển hướng về trang login
  return <Navigate to="/" replace />;
}

export default ProtectedRoute;
// src/pages/LoginPage.tsx (Hoặc src/components/LoginPage.tsx)

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Đường dẫn có thể khác
import { useNavigate, Navigate } from 'react-router-dom';
import { cn } from '@/lib/utils'; // Đường dẫn có thể khác
import { Mail, Lock, LogIn, Loader2, Package } from 'lucide-react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth(); // Lấy hàm login và trạng thái xác thực
  const navigate = useNavigate();

  // Nếu đang loading hoặc đã đăng nhập, không hiển thị form login
  if (isLoading) {
      return ( // Giao diện loading đơn giản
          <div className="flex min-h-screen items-center justify-center bg-gray-100">
               <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
      );
  }
  if (isAuthenticated) {
     // Nếu đã đăng nhập, chuyển hướng ngay vào dashboard
     return <Navigate to="/dashboard" replace />;
  }


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password); // Gọi hàm login từ AuthContext

    if (result.success) {
      // Login thành công (và là Admin), AuthProvider sẽ tự động cập nhật state
      // ProtectedRoute sẽ xử lý chuyển hướng vào dashboard
       navigate('/dashboard', { replace: true }); // Có thể thêm dòng này để chắc chắn
    } else {
      // Login thất bại, hiển thị lỗi
      setError(result.message || 'Đăng nhập thất bại.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-blue-100 p-4">
      <form
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl md:p-8"
        onSubmit={handleSubmit}
      >
        {/* Logo/Header */}
        <div className="mb-6 flex flex-col items-center">
             <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                 <Package className="h-6 w-6" />
             </div>
             <h2 className="text-center text-2xl font-bold text-gray-800">
                Admin Đăng Nhập
             </h2>
             <p className="mt-1 text-center text-sm text-gray-500">
                 Quản lý hệ thống bán vé
             </p>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="h-4 w-4" />
            </span>
            <input
              id="email"
              type="email"
              className={cn(
                "w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-1",
                isSubmitting && "bg-gray-50 opacity-70"
              )}
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">
            Mật khẩu
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="h-4 w-4" />
            </span>
            <input
              id="password"
              type="password"
               className={cn(
                "w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-1",
                isSubmitting && "bg-gray-50 opacity-70"
              )}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
              autoComplete="current-password"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={cn(
            "w-full rounded-lg py-2.5 text-lg font-bold text-white transition-colors duration-300 flex items-center justify-center gap-2",
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          )}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        {/* Error Message */}
        {error && (
            <p className="mt-4 rounded-md bg-red-100 p-2 text-center text-sm font-medium text-red-700">
                {error}
            </p>
        )}
      </form>
    </div>
  );
}

export default LoginPage;
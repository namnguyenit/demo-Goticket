// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken, getMyInfo, login as apiLogin } from '../services/api'; // Import apiLogin

// --- Khai báo kiểu dữ liệu (Giữ nguyên) ---
interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
}

// --- AuthContextType (Thêm lại login) ---
interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>; // Thêm lại login
  logout: () => void;
  // Bỏ setTokenAndAuthenticate nếu không cần chế độ dán token nữa
  // setTokenAndAuthenticate: (token: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Hook useAuth (Giữ nguyên) ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Component AuthProvider ---
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Dùng lại navigate

  // --- Hàm Đăng xuất (Chuyển về trang login của Admin) ---
  const handleLogout = () => {
    setAuthToken(null); // Xóa token
    setUser(null);
    setIsAuthenticated(false);
    navigate('/', { replace: true }); // Chuyển về trang login ('/') của Admin
  };

  // --- Hàm Lấy thông tin User (tương tự ban đầu) ---
  const fetchUserInfo = async () => {
    const token = localStorage.getItem('authToken'); // Lấy token

    // Nếu không có token, không cần làm gì thêm, chỉ kết thúc loading
    if (!token) {
      setIsLoading(false);
      setUser(null); // Đảm bảo user là null
      setIsAuthenticated(false); // Đảm bảo chưa xác thực
      return { success: false, message: 'Chưa đăng nhập.' };
    }

    // Nếu có token, thử đặt nó và gọi API
    setAuthToken(token);

    try {
      const infoResponse = await getMyInfo(); // Gọi /api/auth/myinfo
      const userData: UserData = infoResponse.data.data;

      // Kiểm tra role admin
      if (userData.role === 'admin') {
        setUser(userData);
        setIsAuthenticated(true);
        setIsLoading(false);
        return { success: true };
      } else {
        // Nếu không phải admin, logout
        handleLogout();
        setIsLoading(false); // Kết thúc loading sau khi logout
        return { success: false, message: 'Tài khoản không có quyền Admin.' };
      }
    } catch (error) {
      // Nếu token lỗi, logout
      console.error("Lỗi fetchUserInfo (Admin):", error);
      handleLogout();
      setIsLoading(false); // Kết thúc loading sau khi logout
      return { success: false, message: 'Token hết hạn hoặc không hợp lệ.' };
    }
     // Bỏ finally vì các nhánh trên đã xử lý loading
  };

  // --- Hàm Đăng nhập bằng Email/Password ---
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true); // Bắt đầu loading khi login
    try {
      // Gọi API login từ services/api.ts
      const response = await apiLogin(email, password);
      const token = response.data.data.authorisation.token;

      // Lưu token và gọi fetchUserInfo để kiểm tra role
      setAuthToken(token);
      const userInfoResult = await fetchUserInfo(); // Gọi fetchUserInfo để lấy user và set state

      // fetchUserInfo đã tự xử lý loading và state, chỉ cần trả về kết quả của nó
      return userInfoResult;

    } catch (error: any) {
      setAuthToken(null); // Xóa token nếu login lỗi
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false); // Kết thúc loading khi login lỗi
      const errorMessage = error.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng.';
      return { success: false, message: errorMessage };
    }
     // Bỏ finally vì các nhánh trên đã xử lý loading
  };

  // --- useEffect để kiểm tra token khi App load ---
  useEffect(() => {
    fetchUserInfo(); // Gọi để kiểm tra token có sẵn khi tải lại trang
  }, []); // Chỉ chạy 1 lần

  // --- Giá trị Context (thêm lại login) ---
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin, // Thêm lại hàm login
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
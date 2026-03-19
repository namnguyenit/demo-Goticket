import axios from 'axios';

// Khai báo Base URL cho dự án Admin
const BASE_URL = 'http://127.0.0.1:8000/api'; 

// 1. Cấu hình instance Axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Chức năng lưu trữ và lấy Token (dùng lại ở AuthContext)
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('authToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

// 3. Kiểm tra và tải token khi ứng dụng khởi động
const storedToken = localStorage.getItem('authToken');
if (storedToken) {
  setAuthToken(storedToken);
}

// 4. Các hàm gọi API (được export để dùng trong Context/Page)

// Hàm đăng nhập (POST /api/auth/login)
export const login = (email: string, password: string) => {
  return api.post('/auth/login', { email, password });
};

// Hàm lấy thông tin người dùng (GET /api/auth/myinfo)
export const getMyInfo = () => {
  return api.get('/auth/myinfo');
};

// Hàm lấy thống kê Dashboard tổng (GET /api/admin/dashboard/stats)
export const getAdminStats = () => {
  return api.get('/admin/dashboard/stats');
};

// Hàm lấy danh sách Top Vendor (GET /api/admin/dashboard/top-vendors)
export const getTopVendors = () => {
    return api.get('/admin/dashboard/top-vendors');
};

// Hàm lấy danh sách User/Vendor (GET /api/admin/users?role=...)
export const getUsers = (role: 'customer' | 'vendor' | 'admin' | null = null) => {
  return api.get('/admin/users', { params: { role } });
};

// Hàm tìm kiếm user/vendor (GET /api/admin/users/search?name=...&role=...)
export const searchUsers = (name: string, role: 'customer' | 'vendor' | null = null) => {
  return api.get('/admin/users/search', { params: { name, role } });
};

export const deleteUser = (email: string) => {
    return api.delete(`/admin/users/${email}`);
};


export const getVendorDetail = (vendorId: number) => {
    return api.get(`/admin/vendors/${vendorId}`);
};

// ✅ HÀM MỚI: Cập nhật Vendor (Company Info và User Info)
export const updateVendorDetail = (vendorId: number, data: any) => {
    return api.put(`/admin/vendors/${vendorId}`, data);
};

export const createVendor = (data: any) => {
    return api.post('/admin/vendors', data);
};
export default api;
import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Save, Loader2, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '../services/api'; 

// Khai báo kiểu dữ liệu cho props
interface UserDetail {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: 'customer' | 'admin' | 'vendor'; // Bổ sung vendor
    created_at: string;
}

interface UserEditModalProps {
    userEmail: string | null;
    onClose: (didUpdate?: boolean) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ userEmail, onClose }) => {
    const [userData, setUserData] = useState<UserDetail | null>(null);
    const [formData, setFormData] = useState({ name: '', phone_number: '', role: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch User Data khi modal mở
    useEffect(() => {
        if (!userEmail) {
            setUserData(null);
            return;
        }

        const fetchUser = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Gọi API để lấy chi tiết người dùng
                const response = await api.get(`/admin/users/${userEmail}`);
                const data = response.data.data;
                
                setUserData(data);
                setFormData({
                    name: data.name,
                    // Lưu ý: data.phone_number là trường trong Laravel, data.phone là trường ánh xạ trong React list (cần đồng bộ)
                    phone_number: data.phone_number || data.phone || '',
                    role: data.role,
                });
            } catch (err: any) {
                console.error("Lỗi khi tải chi tiết User:", err);
                setError("Không thể tải thông tin chi tiết người dùng.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [userEmail]);

    // 2. Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. Handle form submission (PUT update)
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userEmail || isSaving) return;

        setIsSaving(true);
        setError(null);

        try {
            // Gọi API PUT để cập nhật thông tin
            await api.put(`/admin/users/${userEmail}`, formData);
            
            // Đóng modal và báo hiệu đã có update (true)
            onClose(true); 

        } catch (err: any) {
            console.error("Lỗi khi cập nhật User:", err.response?.data);
            // Hiển thị lỗi trả về từ backend (nếu có)
            setError(err.response?.data?.errors?.phone_number || err.response?.data?.message || "Cập nhật thất bại.");
        } finally {
            setIsSaving(false);
        }
    };
    
    if (!userEmail) return null; // Không render nếu không có email được chọn

    return (
        // Modal Overlay (Deep Blue/White theme)
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            {/* Modal Content */}
            <div className="w-full max-w-3xl rounded-xl bg-white shadow-2xl transition-transform duration-300 transform scale-100">
                
                {/* Modal Header */}
                <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-xl">
                    <h3 className="text-xl font-bold text-[#1A2B4B]">
                        Chi tiết người dùng: {userData?.name}
                    </h3>
                    {/* Nút Hủy đóng modal */}
                    <button onClick={() => onClose()} className="p-2 rounded-full hover:bg-gray-100 text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </header>

                {/* Modal Body (2 Cột) */}
                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center py-10 text-gray-500">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" /> Đang tải...
                        </div>
                    ) : (
                        <form onSubmit={handleSave} className="grid grid-cols-3 gap-6">
                            
                            {/* Cột 1: Thông tin tĩnh (ID, Email) - 1/3 */}
                            <div className="col-span-1 space-y-4 pr-6 border-r border-gray-100">
                                <div className="flex flex-col items-center space-y-3 pt-4">
                                    <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                        <User className="w-12 h-12" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-500">ID: {userData?.id}</p>
                                </div>
                                <div className="p-3 bg-blue-50/50 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-600">Email (ID):</p>
                                    <p className="text-sm font-medium text-gray-800 break-words">{userData?.email}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-600">Ngày tham gia:</p>
                                    <p className="text-sm font-medium text-gray-800">
                                        {userData ? new Date(userData.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Cột 2: Form chỉnh sửa (2/3) */}
                            <div className="col-span-2 space-y-4">
                                <h4 className="text-lg font-bold text-[#1A2B4B] flex items-center gap-2 border-b border-gray-200 pb-2">
                                    Thông tin chỉnh sửa
                                </h4>

                                {/* Input: Name */}
                                <div className="flex flex-col space-y-1">
                                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                        <User className="h-4 w-4" /> Họ và Tên
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="rounded-lg border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Input: Phone */}
                                <div className="flex flex-col space-y-1">
                                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                        <Phone className="h-4 w-4" /> Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className="rounded-lg border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Select: Role */}
                                <div className="flex flex-col space-y-1">
                                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                        <ArrowLeftRight className="h-4 w-4" /> Quyền người dùng
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="rounded-lg border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        required
                                    >
                                        <option value="customer">Khách hàng</option>
                                        <option value="vendor">Nhà xe</option>
                                        <option value="admin">Quản trị viên</option>
                                    </select>
                                </div>
                                
                                {/* Error Message */}
                                {error && <p className="text-sm text-red-600 mt-2 p-2 bg-red-50 rounded-lg">{error}</p>}

                                {/* Nút Lưu và Hủy */}
                                <div className="pt-4 flex justify-end space-x-3">
                                    <button 
                                        type="button" 
                                        onClick={() => onClose()}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                                        disabled={isSaving}
                                    >
                                        Hủy
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-gray-400"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserEditModal;
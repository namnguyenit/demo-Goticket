import React, { useState } from 'react';
import { X, User, Mail, Phone, Save, Loader2, Building, MapPin, Lock, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createVendor } from '../services/api'; 

interface VendorCreateModalProps {
    onClose: (didUpdate?: boolean) => void;
}

// Helper Component cho Input
const CreateInput: React.FC<{ label: string; name: string; value: string; onChange: (e: any) => void; icon: any; type?: string }> = ({ label, name, value, onChange, icon: Icon, type = 'text' }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
            <Icon className="h-4 w-4" /> {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="rounded-lg border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            required
        />
    </div>
);

// Helper component (Read-Only)
const ReadOnlyDisplay: React.FC<{ label: string; value: string | undefined; icon: any; color?: string }> = ({ label, value, icon: Icon, color = 'text-gray-600' }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
            <Icon className={cn("h-4 w-4", color)} /> {label}
        </label>
        <div className="rounded-lg border border-gray-200 p-2 text-sm bg-gray-100 text-gray-800 select-text font-semibold">
            {value || 'N/A'}
        </div>
    </div>
);


const VendorCreateModal: React.FC<VendorCreateModalProps> = ({ onClose }) => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '',
        password: '',
        phone_number: '', // Dùng phone_number cho đồng bộ với backend
        company_name: '', 
        address: '', 
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return;

        setIsSaving(true);
        setError(null);

        try {
            await createVendor(formData);
            alert("Tạo nhà xe thành công! Trạng thái đang chờ duyệt.");
            onClose(true); // Đóng modal và refresh list

        } catch (err: any) {
            console.error("Creation failed:", err.response?.data);
            const backendErrors = err.response?.data?.errors;
            let errorMessage = "Tạo nhà xe thất bại. Vui lòng kiểm tra lại thông tin.";

            if (backendErrors) {
                // Hiển thị lỗi từ backend
                errorMessage = backendErrors.email?.[0] 
                             || backendErrors.company_name?.[0] 
                             || backendErrors.phone_number?.[0]
                             || err.response?.data?.message
                             || errorMessage;
            }
            setError(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };
    

    return (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-4xl rounded-xl bg-white shadow-2xl transition-transform duration-300 transform scale-100">
                
                <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-xl">
                    <h3 className="text-xl font-bold text-blue-600">
                        Tạo Nhà Xe (Vendor) Mới
                    </h3>
                    <button onClick={() => onClose()} className="p-2 rounded-full hover:bg-gray-100 text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </header>

                <form onSubmit={handleSave} className="p-6">
                    
                    <div className="grid grid-cols-2 gap-8">
                        
                        {/* Cột 1: Thông tin User (Đại diện) */}
                        <div className="col-span-1 space-y-4">
                            <h4 className="text-lg font-bold text-[#1A2B4B] border-b border-gray-200 pb-2">
                                Thông tin Người đại diện
                            </h4>
                            <CreateInput icon={User} label="Họ và Tên" name="name" value={formData.name} onChange={handleChange} />
                            <CreateInput icon={Mail} label="Email (Tên đăng nhập)" name="email" value={formData.email} onChange={handleChange} type="email" />
                            <CreateInput icon={Lock} label="Mật khẩu" name="password" value={formData.password} onChange={handleChange} type="password" />
                            <CreateInput icon={Phone} label="Số điện thoại" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                        </div>

                        {/* Cột 2: Thông tin Công ty (Vendor) */}
                        <div className="col-span-1 space-y-4">
                            <h4 className="text-lg font-bold text-[#1A2B4B] border-b border-gray-200 pb-2">
                                Thông tin Công ty/Nhà xe
                            </h4>
                            <CreateInput icon={Building} label="Tên công ty/Nhà xe" name="company_name" value={formData.company_name} onChange={handleChange} />
                            <CreateInput icon={MapPin} label="Địa chỉ" name="address" value={formData.address} onChange={handleChange} />
                            <ReadOnlyDisplay icon={Hash} label="Trạng thái khởi tạo" value="PENDING (Chờ duyệt)" color="text-yellow-600" />
                        </div>
                    </div>
                    
                    {/* Error Message */}
                    {error && <p className="text-sm text-red-600 mt-4 p-2 bg-red-50 rounded-lg">{error}</p>}

                    {/* Footer: Nút Lưu */}
                    <div className="pt-6 flex justify-end space-x-3 border-t border-gray-100 mt-6">
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
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition flex items-center gap-2 disabled:bg-gray-400"
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {isSaving ? 'Đang tạo...' : 'Tạo Nhà Xe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VendorCreateModal;
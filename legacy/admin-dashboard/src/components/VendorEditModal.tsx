import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Save, Loader2, Edit, Building, MapPin, Hash, BarChart3, Clock, Star, Bus, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getVendorDetail, updateVendorDetail } from '../services/api'; 


// Khai báo kiểu dữ liệu cho dữ liệu chi tiết Vendor
interface VendorDetail {
    vendor_id: number;
    company_info: {
        company_name: string;
        address: string;
        status: 'active' | 'pending' | 'suspended';
        total_trips: number;
        rating: number;
    };
    representative_info: {
        user_id: number;
        name: string;
        email: string;
        phone_number: string;
        role: 'customer' | 'admin' | 'vendor';
        joined_at: string;
    };
}

interface VendorEditModalProps {
    vendorId: number | null;
    onClose: (didUpdate?: boolean) => void;
}

const VendorEditModal: React.FC<VendorEditModalProps> = ({ vendorId, onClose }) => {
    const [vendorData, setVendorData] = useState<VendorDetail | null>(null);
    const [formData, setFormData] = useState({ 
        company_name: '', 
        address: '', 
        status: '', 
        user_name: '', 
        phone_number: '',
        role: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dùng cho tab hiện tại (Thông tin cơ bản, Doanh thu, Người liên hệ)
    const [activeTab, setActiveTab] = useState('basic'); 

    // Fetch Vendor Data khi modal mở
    useEffect(() => {
        if (!vendorId) {
            setVendorData(null);
            return;
        }

        const fetchVendor = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getVendorDetail(vendorId);
                const data: VendorDetail = response.data.data;
                
                setVendorData(data);
                setFormData({
                    company_name: data.company_info.company_name,
                    address: data.company_info.address || '',
                    status: data.company_info.status,
                    user_name: data.representative_info.name,
                    phone_number: data.representative_info.phone_number || '',
                    role: data.representative_info.role,
                });
            } catch (err: any) {
                console.error("Lỗi khi tải chi tiết Vendor:", err);
                setError(err.response?.data?.message || "Không thể tải thông tin Vendor.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchVendor();
    }, [vendorId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vendorId || isSaving) return;

        setIsSaving(true);
        setError(null);

        try {
            await updateVendorDetail(vendorId, { ...formData, user_name: formData.user_name });
            onClose(true); 

        } catch (err: any) {
            console.error("Update failed:", err.response?.data);
            const backendErrors = err.response?.data?.errors;
            let errorMessage = "Cập nhật thất bại.";

            if (backendErrors) {
                errorMessage = backendErrors.phone_number?.[0] || backendErrors.company_name?.[0] || err.response?.data?.message;
            }
            setError(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'suspended': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-500';
        }
    };
    
    if (!vendorId) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-5xl rounded-xl bg-white shadow-2xl transition-all duration-300">
                
                {/* Modal Header */}
                <header className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h3 className="text-xl font-bold text-[#1A2B4B]">
                        Chi tiết đối tác: {vendorData?.company_info.company_name}
                    </h3>
                    <div className="flex items-center space-x-3">
                        <span className={cn("px-3 py-1 rounded-full text-sm font-semibold", getStatusStyle(vendorData?.company_info.status || ''))}>
                            {vendorData?.company_info.status.toUpperCase()}
                        </span>
                        <button onClick={() => onClose()} className="p-2 rounded-full hover:bg-gray-200 text-gray-700">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </header>
                
                {/* Tabs Navigation */}
                <div className="flex border-b border-gray-200 bg-white px-6 pt-2">
                    {['basic', 'finance', 'contact'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "py-2 px-4 text-sm font-medium transition-colors border-b-2",
                                activeTab === tab
                                    ? "text-blue-600 border-blue-600"
                                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                            )}
                        >
                            {tab === 'basic' && "Thông tin cơ bản"}
                            {tab === 'finance' && "Doanh thu"}
                            {tab === 'contact' && "Người liên hệ"}
                        </button>
                    ))}
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center py-10 text-gray-500">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" /> Đang tải...
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-6">
                            
                            {/* Cột Tĩnh: Logo, ID, Stats (Dựa trên Mockup) */}
                            <div className="col-span-1 space-y-4 pr-6 border-r border-gray-100">
                                <div className="flex flex-col items-center space-y-3 pt-4">
                                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                        <Building className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">{vendorData?.company_info.company_name}</h3>
                                    <p className="text-sm text-gray-500">ID: P00{vendorData?.vendor_id}</p>
                                </div>
                                <InfoCard label="Đánh giá" value={`${vendorData?.company_info.rating || 'N/A'}/5`} icon={Star} color="text-yellow-500" />
                                <InfoCard label="Số tuyến" value={`${vendorData?.company_info.total_trips || 0} tuyến`} icon={Bus} color="text-blue-500" />
                                <InfoCard label="Ngày tham gia" value={vendorData?.representative_info.joined_at ? new Date(vendorData.representative_info.joined_at).toLocaleDateString('vi-VN') : 'N/A'} icon={Clock} color="text-gray-500" />
                            </div>
                            
                            {/* Cột Form/Tabbed Content (2/3) */}
                            <div className="col-span-2 space-y-4">
                                
                                {/* A. TAB: Thông tin cơ bản (Editable Form) */}
                                {activeTab === 'basic' && (
                                    <form onSubmit={handleSave} className="space-y-4">
                                        <h4 className="text-lg font-bold text-[#1A2B4B] border-b border-gray-200 pb-2">
                                            Thông tin công ty
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <EditableInput icon={Building} label="Tên công ty" name="company_name" value={formData.company_name} onChange={handleChange} />
                                            <ReadOnlyDisplay icon={Mail} label="Email (Đại diện)" value={vendorData?.representative_info.email} />
                                            <EditableInput icon={Phone} label="Số điện thoại" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                                            <ReadOnlyDisplay icon={Hash} label="Mã số thuế" value="1234567890" /> {/* Placeholder */}
                                            <EditableInput icon={MapPin} label="Địa chỉ" name="address" value={formData.address} onChange={handleChange} fullWidth />
                                        </div>

                                        <h4 className="text-lg font-bold text-[#1A2B4B] border-b border-gray-200 pb-2 pt-4">
                                            Trạng thái và Quyền
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <StatusSelect 
                                                label="Trạng thái hoạt động" 
                                                name="status" 
                                                value={formData.status} 
                                                onChange={handleChange} 
                                                options={['active', 'pending', 'suspended']}
                                            />
                                            <StatusSelect 
                                                label="Quyền người dùng (Đại diện)" 
                                                name="role" 
                                                value={formData.role} 
                                                onChange={handleChange} 
                                                options={['vendor', 'admin' , 'customer']} 
                                                icon={ArrowLeftRight}
                                            />
                                        </div>
                                        
                                        {error && <p className="text-sm text-red-600 mt-4 p-2 bg-red-50 rounded-lg">{error}</p>}

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
                                    </form>
                                )}
                                
                                {/* B. TAB: Doanh thu (Placeholder) */}
                                {activeTab === 'finance' && (
                                    <div className="text-center py-20 text-gray-500">
                                        <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                                        <p>Tính năng xem biểu đồ doanh thu đang được phát triển.</p>
                                    </div>
                                )}

                                {/* C. TAB: Người liên hệ (Placeholder) */}
                                {activeTab === 'contact' && (
                                    <div className="text-center py-20 text-gray-500">
                                        <User className="h-8 w-8 mx-auto mb-2" />
                                        <p>Thông tin Người liên hệ: {vendorData?.representative_info.name} - {vendorData?.representative_info.phone_number}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorEditModal;




const StatusSelect: React.FC<{ label: string; name: string; value: string; onChange: (e: any) => void; options: string[]; icon?: any }> = ({ label, name, value, onChange, options, icon: Icon = X }) => (
    <div className="flex flex-col space-y-1">
        <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
            <Icon className="h-4 w-4" /> {label}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="rounded-lg border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
        >
            {options.map(option => (
                <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
            ))}
        </select>
    </div>
);
// --- Component Helpers ---

const InfoCard: React.FC<{ label: string; value: string; icon: any; color: string }> = ({ label, value, icon: Icon, color }) => (
    <div className="p-3 border border-gray-200 rounded-lg flex items-center space-x-3 bg-gray-50">
        <Icon className={cn("h-5 w-5", color)} />
        <div>
            <p className="text-xs font-semibold text-gray-500">{label}</p>
            <p className="text-sm font-medium text-gray-800">{value}</p>
        </div>
    </div>
);

const ReadOnlyDisplay: React.FC<{ label: string; value: string | undefined; icon: any }> = ({ label, value, icon: Icon }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
            <Icon className="h-4 w-4" /> {label}
        </label>
        <div className="rounded-lg border border-gray-200 p-2 text-sm bg-gray-100 text-gray-600 select-text">
            {value || 'N/A'}
        </div>
    </div>
);

const EditableInput: React.FC<{ label: string; name: string; value: string; onChange: (e: any) => void; icon: any; fullWidth?: boolean }> = ({ label, name, value, onChange, icon: Icon, fullWidth = false }) => (
    <div className={cn("flex flex-col gap-1", fullWidth ? "col-span-2" : "col-span-1")}>
        <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
            <Icon className="h-4 w-4" /> {label}
        </label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="rounded-lg border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            required
        />
    </div>
);


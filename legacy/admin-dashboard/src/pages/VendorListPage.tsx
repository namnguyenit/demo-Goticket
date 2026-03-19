import React, { useState, useEffect, useCallback } from 'react';
import { Search, PlusCircle, CheckCircle, Clock, XCircle, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUsers, searchUsers,createVendor } from '../services/api'; 
import VendorEditModal from '../components/VendorEditModal'; 

import VendorCreateModal from '../components/VendorCreateModal';


// Khai báo kiểu dữ liệu
interface Vendor {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'pending' | 'suspended';
    company_name: string;
}

function VendorListPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');
    const [modalVendorId, setModalVendorId] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    // ✅ Thêm Debounce State
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const DEBOUNCE_DELAY = 500;


    

    // Hàm chung để lấy dữ liệu (chỉ gọi khi debouncedSearchTerm thay đổi)
    const fetchVendors = useCallback(async (query = '') => {
        // ✅ Cập nhật logic loading và searching
        setIsSearching(query !== '' && query.length > 0);
        setIsLoading(true); 
        setError('');
        
        try {
            let response;
            if (query) {
                // Nếu có từ khóa, dùng API Search
                response = await searchUsers(query, 'vendor');
            } else {
                // Nếu không có từ khóa, dùng API GetAll
                response = await getUsers('vendor');
            }
            
            const mappedVendors: Vendor[] = response.data.data.map((user: any) => ({
                // ✅ THAY ĐỔI: Luôn sử dụng User ID của người đại diện (user.id)
                // User ID chính là user_id trong bảng vendors
                id: user.id, 
                name: user.name,
                email: user.email,
                phone: user.phone || 'N/A',
                status: user.status || 'pending',
                company_name: user.vendor?.company_name || 'N/A'
            }));


            setVendors(mappedVendors);
        } catch (err: any) {
            console.error("Lỗi khi tải/tìm kiếm Vendor:", err);
            setError(err.response?.data?.message || 'Không thể tải dữ liệu nhà xe.');
            setVendors([]);
        } finally {
            setIsLoading(false);
            setIsSearching(false);
        }
    }, []);

    // ✅ Hook Debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, DEBOUNCE_DELAY);
        return () => clearTimeout(handler);
    }, [searchTerm]); 

    // ✅ Hook Fetch
    useEffect(() => {
        // Gọi API khi debouncedSearchTerm thay đổi
        fetchVendors(debouncedSearchTerm);
    }, [debouncedSearchTerm, fetchVendors]);


    // Handler chỉ cập nhật trạng thái input (KHÔNG GỌI API)
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    
    // Hàm xử lý đóng Modal và Refresh List
    const handleCloseModal = (didUpdate = false) => {
        setModalVendorId(null);
        setIsCreating(false); // ✅ Đóng modal tạo mới
        if (didUpdate) {
            fetchVendors(searchTerm); 
        }
    }

    if (isLoading) {
        return (
             <div className="flex h-full items-center justify-center bg-gray-100 py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                <p className='ml-4 text-gray-600'>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-[#1A2B4B]">Quản lý Nhà xe</h1>
            
            {/* Header và Search Bar */}
            <div className="mb-6 flex items-center justify-between">
                <div className="relative w-full max-w-lg">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo Tên hoặc Công ty..."
                        className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 shadow-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        disabled={isSearching} // Không vô hiệu hóa input
                    />
                </div>
                
                <button 
                    onClick={() => setIsCreating(true)} 
                    className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold transition hover:bg-blue-700 shadow-md"
                >
                    <PlusCircle className="h-5 w-5" />
                    <span>Thêm Nhà Xe Mới</span>
                </button>
            </div>
            
            {/* Bảng hiển thị */}
            <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-200">
                <VendorTable 
                    vendors={vendors} 
                    isLoading={isLoading || isSearching} 
                    error={error} 
                    searchTerm={searchTerm} 
                    onEditClick={setModalVendorId} 
                />
            </div>

            {/* Modal Edit */}
            {modalVendorId && (
                <VendorEditModal 
                    vendorId={modalVendorId}
                    onClose={handleCloseModal}
                />
            )}
            {isCreating && (
                <VendorCreateModal 
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

// Hàm lấy màu và icon theo trạng thái
const getStatusInfo = (status: 'active' | 'pending' | 'suspended') => {
    switch(status) {
        case 'active': return { color: 'text-green-600 bg-green-100', icon: CheckCircle };
        case 'pending': return { color: 'text-yellow-600 bg-yellow-100', icon: Clock };
        case 'suspended': return { color: 'text-red-600 bg-red-100', icon: XCircle };
        default: return { color: 'text-gray-500 bg-gray-100', icon: Clock };
    }
}

// Component cho bảng Vendor
const VendorTable: React.FC<{ vendors: Vendor[], isLoading: boolean, error: string, searchTerm: string, onEditClick: (id: number) => void }> = ({ vendors, isLoading, error, searchTerm, onEditClick }) => {
    
    if (isLoading) {
        return <div className="text-center py-10 text-gray-500">Đang tải dữ liệu, vui lòng chờ...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">Lỗi: {error}</div>;
    }

    if (vendors.length === 0) {
        return <div className="text-center py-10 text-gray-500">
            Không tìm thấy nhà xe nào {searchTerm && `với từ khóa "${searchTerm}"`}.
        </div>;
    }

    return (
        <table className="w-full table-auto border-collapse text-left">
            <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50/50 text-sm uppercase text-gray-700">
                    <th className="p-3 font-semibold rounded-tl-xl">Công ty</th>
                    <th className="p-3 font-semibold">Đại diện/Email</th>
                    <th className="p-3 font-semibold">Trạng Thái</th>
                    <th className="p-3 font-semibold text-center rounded-tr-xl">Thao Tác</th>
                </tr>
            </thead>
            <tbody>
                {vendors.map((vendor) => {
                    const statusInfo = getStatusInfo(vendor.status);
                    return (
                        <tr key={vendor.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition">
                            <td className="p-3 font-semibold text-gray-800"><div>{vendor.name}</div></td>
                            <td className="p-3">
                                <div>{vendor.email}</div>
                            </td>
                            <td className="p-3">
                                <span className={cn(
                                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                                    statusInfo.color
                                )}>
                                    <statusInfo.icon className="mr-1 h-3 w-3" />
                                    {vendor.status.toUpperCase()}
                                </span>
                            </td>
                            <td className="p-3 text-center">
                                <button 
                                    title="Chỉnh sửa chi tiết" 
                                    onClick={() => onEditClick(vendor.id)}
                                    className="text-blue-600 hover:text-blue-800 transition p-1 rounded-full hover:bg-blue-100"
                                >
                                    <Edit className="h-5 w-5 mx-auto" />
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default VendorListPage;
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdminStats, getTopVendors } from '../services/api';
import { cn, formatCurrency } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import TopVendorsChart from '../components/TopVendorsChart';
import VendorStatusChart from '../components/VendorStatusChart';
// Khai báo kiểu dữ liệu cho dữ liệu trả về từ API
interface StatsData {
    revenue: { this_month: number; };
    tickets_sold: { this_month: number; };
    totals: { users: number; vendors: number; };
    vendor_status_distribution: {
        active: number;
        pending: number;
        suspended: number;
    }
}

interface VendorData {
    vendor_info: { id: number; company_name: string; email: string; status: 'active' | 'pending' | 'suspended'; };
    revenue: { this_year: number; this_month: number; }; // ✅ Bổ sung this_month vào interface
    tickets_sold: { this_month: number; };
}

// // Hàm tiện ích để định dạng tiền tệ Việt Nam (ĐƯỢC EXPORT)
// export const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('vi-VN', {
//         style: 'currency',
//         currency: 'VND',
//         minimumFractionDigits: 0,
//     }).format(amount);
// };

function DashboardPage() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState<StatsData | null>(null);
    const [topVendors, setTopVendors] = useState<VendorData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsResponse = await getAdminStats(); 
                setStats(statsResponse.data.data);

                const vendorsResponse = await getTopVendors(); 
                setTopVendors(vendorsResponse.data.data);

            } catch (error: any) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    logout(); 
                    navigate('/', { replace: true });
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [logout, navigate]);

    if (isLoading) {
        return (
             <div className="flex h-full items-center justify-center bg-gray-100 py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                <p className='ml-4 text-gray-600'>Đang tải dữ liệu Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8"> 
            
            {/* 1. Tiêu đề Trang */}
            <h1 className="text-3xl font-bold text-[#1A2B4B]">Dashboard Tổng Quan</h1>

            {/* 2. Phần Stats Tổng Quan (4 Thẻ) */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <StatCard 
                    label="Tổng Doanh thu (Tháng)" 
                    value={formatCurrency(stats?.revenue.this_month ?? 0)} 
                    accentColor="text-green-600"
                />
                <StatCard 
                    label="Tổng Vé bán (Tháng)" 
                    value={stats?.tickets_sold.this_month ?? 0} 
                    unit="vé" 
                    accentColor="text-blue-600"
                />
                <StatCard 
                    label="Tổng Người dùng" 
                    value={stats?.totals.users ?? 0} 
                    unit="người" 
                    accentColor="text-indigo-600"
                />
                <StatCard 
                    label="Tổng Nhà xe" 
                    value={stats?.totals.vendors ?? 0} 
                    unit="nhà xe" 
                    accentColor="text-purple-600"
                />
            </div>

            {/* 3. KHỐI NỘI DUNG CHÍNH (Biểu đồ + Bảng) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 3.1. KHỐI CHÍNH: BIỂU ĐỒ TOP VENDORS (2/3 diện tích) */}
                <div className="lg:col-span-2 rounded-xl bg-white shadow-lg border border-gray-200">
                    <div className="p-4">
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">Top 10 Nhà Xe Doanh Thu Cao Nhất (Tháng)</h2>
                    </div>
                    {topVendors.length > 0 ? (
                        <TopVendorsChart vendors={topVendors} />
                    ) : (
                        <p className="py-8 text-center text-gray-500">Không có đủ dữ liệu doanh thu để tạo biểu đồ.</p>
                    )}
                </div>

                {/* 3.2. KHỐI PHỤ: (Mô phỏng biểu đồ tròn/mini stats) */}
                <div className="rounded-xl bg-white p-4 shadow-lg border border-gray-200">
                     <h2 className="mb-4 text-xl font-semibold text-gray-800">Phân Tích Trạng Thái Vendor</h2>
                     {stats?.vendor_status_distribution && (
                         <VendorStatusChart data={stats.vendor_status_distribution} />
                     )}
                </div>
            </div>
            
            {/* 4. KHỐI BẢNG CHI TIẾT (Chiếm toàn bộ chiều rộng) */}
            <div className="rounded-xl bg-white p-4 shadow-lg border border-gray-200">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">Chi Tiết Top Nhà Xe</h2>
                <VendorTable vendors={topVendors} />
            </div>
        </div>
    );
}

// ... (StatCard Component giữ nguyên) ...
interface StatCardProps {
    label: string;
    value: string | number;
    unit?: string;
    accentColor: string;
}
const StatCard: React.FC<StatCardProps> = ({ label, value, unit = '', accentColor }) => (
    <div className="rounded-xl bg-white p-5 shadow-lg border border-gray-200 transition hover:shadow-xl">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={cn("mt-1 text-2xl font-extrabold", accentColor)}>
            {value} <span className="text-base font-bold text-gray-400">{unit}</span>
        </p>
    </div>
);


const VendorTable: React.FC<{ vendors: VendorData[] }> = ({ vendors }) => (
    <table className="w-full table-auto border-collapse text-left">
        <thead>
            <tr className="border-b-2 border-gray-200 text-gray-700 uppercase text-xs bg-gray-50/50">
                <th className="p-2 font-semibold rounded-tl-lg">Tên Nhà Xe</th>
                <th className="p-2 font-semibold">Doanh Thu (Tháng)</th> {/* ✅ SỬA TIÊU ĐỀ */}
                <th className="p-2 font-semibold">Vé Bán (Tháng)</th>
                <th className="p-2 font-semibold rounded-tr-lg">Trạng Thái</th>
            </tr>
        </thead>
        <tbody>
            {vendors.map((vendor) => {
                const statusInfo = getStatusInfo(vendor.vendor_info.status);
                return (
                    <tr key={vendor.vendor_info.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition">
                        <td className="p-2">
                            <strong className="text-gray-800 text-sm">{vendor.vendor_info.company_name}</strong>
                            <br /><small className="text-gray-500 text-xs">{vendor.vendor_info.email}</small>
                        </td>
                        <td className="p-2 font-medium text-green-700">
                            {formatCurrency(vendor.revenue.this_month)} {/* ✅ SỬA DỮ LIỆU */}
                        </td>
                        <td className="p-2 font-medium text-blue-600">
                            {vendor.tickets_sold.this_month}
                        </td>
                        <td className="p-2">
                            <span className={cn(
                                "inline-block rounded-full px-3 py-1 text-xs font-semibold",
                                statusInfo.color
                            )}>
                                <statusInfo.icon className="mr-1 h-3 w-3" />
                                {vendor.vendor_info.status.toUpperCase()}
                            </span>
                        </td>
                    </tr>
                );
            })}
        </tbody>
    </table>
);

const getStatusInfo = (status: 'active' | 'pending' | 'suspended') => {
    switch(status) {
        case 'active': return { color: 'text-green-600 bg-green-100', icon: CheckCircle };
        case 'pending': return { color: 'text-yellow-600 bg-yellow-100', icon: Clock };
        case 'suspended': return { color: 'text-red-600 bg-red-100', icon: XCircle };
        default: return { color: 'text-gray-500 bg-gray-100', icon: Clock };
    }
}
export default DashboardPage;
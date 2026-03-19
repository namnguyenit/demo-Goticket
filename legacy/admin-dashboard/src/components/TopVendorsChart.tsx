import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { formatCurrency } from '@/lib/utils';

interface VendorData {
    vendor_info: { id: number; company_name: string; email: string; status: 'active' | 'pending' | 'suspended'; };
    revenue: { this_year: number; };
    tickets_sold: { this_month: number; };
}

interface TopVendorsChartProps {
    vendors: VendorData[];
}

// Custom Tooltip để hiển thị tên và doanh thu khi hover
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-md bg-white p-3 shadow-md border border-gray-200">
                <p className="text-sm font-semibold text-[#1A2B4B]">{label}</p>
                <p className="text-sm text-green-600">{`Doanh thu: ${formatCurrency(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

const TopVendorsChart: React.FC<TopVendorsChartProps> = ({ vendors }) => {

    // Chuẩn bị dữ liệu cho biểu đồ
    const chartData = vendors
        .sort((a, b) => b.revenue.this_year - a.revenue.this_year)
        .slice(0, 10)
        .map(v => ({
            name: v.vendor_info.company_name.split(' ').slice(1, 3).join(' '),
            revenue: v.revenue.this_year,
            id: v.vendor_info.id
        }));
    return (
        <div className="h-80 w-full p-2">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{
                        top: 20, right: 30, left: 10, bottom: 5, // Tối ưu margin cho nhãn X
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    {/* ✅ XAxis cho Tên Nhà Xe */}
                    <XAxis
                        dataKey="name"
                        stroke="#777"
                        angle={0}
                        interval={0}
                        height={30} // Chiều cao nhãn X tối ưu
                        textAnchor="middle"
                        tick={{ fontSize: 10, fill: '#555' }} 
                    />
                    {/* ✅ YAxis cho Doanh Thu (Thiết lập domain 0M - 500M) */}
                    <YAxis
                        domain={[0, 100000000]} // Giới hạn từ 0 đến 500,000,000
                        tickCount={20}
                        type="number"
                        stroke="#777"
                        width={60} // Chiều rộng cho nhãn Y
                        tickFormatter={(value) => `${(value as number / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar
                        dataKey="revenue"
                        fill="#007bff"
                        name="Doanh thu tháng (VND)"
                        barSize={30} // ✅ Làm cho thanh biểu đồ mỏng hơn
                        radius={[5, 5, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TopVendorsChart;
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Khai báo kiểu dữ liệu cho dữ liệu đầu vào
interface StatusData {
    active: number;
    pending: number;
    suspended: number;
}

interface VendorStatusChartProps {
    data: StatusData;
}

// 1. Định nghĩa Màu sắc (Phải cố định để dễ nhận diện)
const COLORS = {
    active: '#28a745', // Xanh lá
    pending: '#ffc107', // Vàng
    suspended: '#dc3545', // Đỏ
};

// Hàm chọn màu chữ tương phản (đen hoặc trắng) dựa theo màu nền
const getContrastColor = (hexColor: string): string => {
  // Loại bỏ ký tự #
  const color = hexColor.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Tính độ sáng tương đối theo công thức W3C
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 150 ? '#000000' : '#FFFFFF'; // Nếu sáng → dùng đen, tối → dùng trắng
};


const VendorStatusChart: React.FC<VendorStatusChartProps> = ({ data }) => {
    
    const totalVendors = data.active + data.pending + data.suspended;

    // 2. Chuyển đổi dữ liệu sang định dạng Recharts
    const chartData = [
        { name: 'Hoạt động (Active)', value: data.active, color: COLORS.active },
        { name: 'Chờ duyệt (Pending)', value: data.pending, color: COLORS.pending },
        { name: 'Đã khóa (Suspended)', value: data.suspended, color: COLORS.suspended },
    ].filter(item => item.value > 0); // Loại bỏ các mục có giá trị bằng 0

    // 3. Hàm render nhãn cho Pie Chart (Hiển thị % ngay trên biểu đồ)
    const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6; // ✅ đẩy chữ gần giữa lát hơn
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  const percent = totalVendors ? ((value / totalVendors) * 100).toFixed(0) : 0;

  const color = getContrastColor(chartData[index].color);

  return (
    <text
      x={x}
      y={y}
      fill={color}
      textAnchor="middle" // ✅ canh giữa chữ
      dominantBaseline="central" // ✅ canh giữa theo trục dọc
      className="font-semibold text-xs"
      style={{
        paintOrder: 'stroke',
        stroke: 'white',
        strokeWidth: 2,
      }}
    >
      {`${value} (${percent}%)`}
    </text>
  );
};


    return (
        <div className="h-full w-full flex flex-col items-center">
  <ResponsiveContainer width="100%" height={260}>
    <PieChart>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="45%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        fill="#8884d8"
        labelLine={false}
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>

  {/* ✅ Dòng text dưới biểu đồ */}
  <div className="mt-2 text-center text-sm text-gray-700">
    {chartData.map((item) => {
      const percent = ((item.value / totalVendors) * 100).toFixed(0);
      return (
        <p key={item.name}>
          <span className="font-medium" style={{ color: item.color }}>
            {item.name}:
          </span>{' '}
          {item.value} ({percent}%)
        </p>
      );
    })}
  </div>
</div>

    );
};

export default VendorStatusChart;
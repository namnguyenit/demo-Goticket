import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Bus, LogOut, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/users', label: 'Quản lý Người dùng', icon: Users },
    { to: '/vendors', label: 'Quản lý Nhà xe', icon: Bus },
    // Có thể thêm sau: { to: '/bookings', label: 'Quản lý Đặt vé', icon: Package },
];

function Sidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            logout();
        }
    };

    return (
        // ✅ Vỏ Ngoài: Nền Tối (Gray-900), Box Trắng cho Menu
        <div className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col bg-gray-900 shadow-2xl">
            
            {/* Header / Title (Top Dark Section) */}
            <div className="flex h-20 items-center border-b border-gray-700/50 px-4">
                <div className="flex items-center space-x-2 text-white">
                    <Package className="h-6 w-6 text-purple-400" />
                    <div>
                        <p className="text-lg font-bold">Hệ thống quản lý</p>
                        <p className="text-xs text-gray-400">Admin</p>
                    </div>
                </div>
            </div>

            {/* ✅ Navigation Menu (Box Màu Sáng, có thể cuộn) */}
            <div className="flex-grow overflow-y-auto bg-white pt-4">
                <nav className="px-4">
                    <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Hệ thống bán vé</p>
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) => cn(
                                        "flex items-center space-x-3 rounded-lg px-3 py-2 font-medium transition-colors duration-200",
                                        isActive
                                            // ✅ ACTIVE: Nền xám nhạt (bg-gray-300), Chữ đen (text-gray-900)
                                            ? "bg-gray-300 text-gray-900 font-bold shadow-sm"
                                            // ✅ HOVER: Nền xám sẫm nhẹ (hover:bg-gray-200), Chữ đen
                                            : "text-gray-700 hover:bg-gray-200 hover:text-gray-900" 
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Footer / Logout (Bottom Dark Section) */}
            <div className=" bg-white pt-4 pb-4 px-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center space-x-3 rounded-lg py-2 text-left font-medium text-red-400 transition-colors duration-200 hover:bg-red-500 hover:text-white"
                >
                    <LogOut className="h-5 w-5 " />
                    <span className='px-1'>Thoát</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
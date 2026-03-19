import React, { useState } from 'react';
import { Search, Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '@/lib/utils';
import { NavLink } from 'react-router-dom';

function Header() {
    const { user, logout } = useAuth();
    // State tạm thời cho ô Search, sau này có thể dùng context
    const [searchTerm, setSearchTerm] = useState('');
    
    return (
        <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between bg-white px-6 shadow-md border-b border-gray-200">
            
            {/* Left Section: Welcome Message/Current Page Title (sẽ dùng slot hoặc prop để thay đổi tiêu đề) */}
            <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-[#1A2B4B]">
                    Admin Panel
                </h2>
            </div>
            
            {/* Right Section: Global Search and User Actions */}
            <div className="flex items-center space-x-4">
                {/* Notifications Icon (mô phỏng theo mẫu) */}
                <button title="Thông báo" className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600">
                    <Bell className="h-5 w-5" />
                </button>

                {/* User Info / Logout Button */}
                <div className="flex items-center space-x-2 rounded-lg bg-blue-600 px-3 py-1 text-white shadow-md">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <button 
                        onClick={logout} 
                        title="Đăng xuất"
                        className="p-1 rounded-full text-white/80 hover:text-white transition"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
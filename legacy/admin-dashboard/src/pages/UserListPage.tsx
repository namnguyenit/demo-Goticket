import React, { useState, useEffect, useCallback } from 'react';
import { Search, PlusCircle, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUsers, searchUsers, deleteUser } from '../services/api'; 
import UserEditModal from '../components/UserEditModal'; 

// Khai báo kiểu dữ liệu
interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: 'customer' | 'admin';
}

function UserListPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');
    const [modalUserEmail, setModalUserEmail] = useState<string | null>(null);
    
    // ✅ 1. State giữ giá trị sau khi debounce
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const DEBOUNCE_DELAY = 500; // 500ms dừng gõ thì bắt đầu tìm kiếm


    // Hàm chung để lấy dữ liệu (chỉ gọi khi debouncedSearchTerm thay đổi)
    const fetchUsers = useCallback(async (query = '') => {
        setIsSearching(query !== '' && query.length > 0);
        setIsLoading(true); 
        setError('');
        
        try {
            let response;
            // Tối ưu: Nếu query rỗng, lấy tất cả; nếu không, gọi search
            if (query) {
                response = await searchUsers(query, 'customer');
            } else {
                response = await getUsers('customer'); 
            }
            
            const mappedUsers: User[] = response.data.data.map((user: any) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone_number || user.phone || 'N/A',
                role: user.role,
            }));

            setUsers(mappedUsers);
        } catch (err: any) {
            console.error("Lỗi khi tải/tìm kiếm User:", err);
            setError(err.response?.data?.message || 'Không thể tải dữ liệu người dùng.');
            setUsers([]);
        } finally {
            setIsLoading(false);
            setIsSearching(false);
        }
    }, []);
    
    // ✅ 2. Hook Debounce: Theo dõi searchTerm và cập nhật debouncedSearchTerm sau 500ms
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, DEBOUNCE_DELAY);

        // Cleanup: Xóa timer nếu người dùng tiếp tục gõ
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]); 

    // ✅ 3. Hook Fetch: Gọi API khi debouncedSearchTerm thay đổi
    useEffect(() => {
        // Chỉ fetch khi component được mount hoặc khi debouncedSearchTerm thay đổi
        fetchUsers(debouncedSearchTerm);
    }, [debouncedSearchTerm, fetchUsers]);

    // Handler chỉ cập nhật trạng thái input (KHÔNG GỌI API)
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Giữ lại dòng này để input không bị mất focus
        setSearchTerm(e.target.value); 
    };
    
    // ... (handleDeleteUser và handleCloseModal giữ nguyên) ...
    const handleDeleteUser = async (userEmail: string, userName: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng: ${userName} (${userEmail}) không? Hành động này không thể hoàn tác.`)) {
            setIsLoading(true); 
            try {
                await deleteUser(userEmail);
                alert(`Đã xóa người dùng: ${userName} thành công.`);
                fetchUsers(searchTerm); 
            } catch (err: any) {
                console.error("Lỗi khi xóa User:", err.response?.data);
                alert(err.response?.data?.message || "Xóa người dùng thất bại.");
                setIsLoading(false);
            }
        }
    };
    
    const handleCloseModal = (didUpdate = false) => {
        setModalUserEmail(null);
        if (didUpdate) {
            fetchUsers(searchTerm); 
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
            
            <h1 className="text-3xl font-bold text-[#1A2B4B]">Quản lý Người dùng (Khách hàng)</h1>
            
            {/* Header và Search Bar */}
            <div className="mb-6 flex items-center justify-between">
                
                <div className="relative w-full max-w-lg">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo Tên hoặc Email..."
                        className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 shadow-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        disabled={isSearching}
                    />
                </div> 
            </div>
            
            {/* Bảng hiển thị */}
            <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-200">
                <UserTable 
                    users={users} 
                    isLoading={isLoading || isSearching} 
                    error={error} 
                    searchTerm={searchTerm} 
                    onEditClick={setModalUserEmail} 
                    onDeleteClick={handleDeleteUser} 
                />
            </div>

            {/* Modal Edit */}
            {modalUserEmail && (
                <UserEditModal 
                    userEmail={modalUserEmail}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

// ... (UserTable Component giữ nguyên) ...
interface UserTableProps {
    users: User[];
    isLoading: boolean;
    error: string;
    searchTerm: string;
    onEditClick: (email: string) => void;
    onDeleteClick: (email: string, name: string) => void;
}
const UserTable: React.FC<UserTableProps> = ({ users, isLoading, error, searchTerm, onEditClick, onDeleteClick }) => {
    
    if (isLoading) {
        return <div className="text-center py-10 text-gray-500">Đang tải dữ liệu, vui lòng chờ...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">Lỗi: {error}</div>;
    }

    if (users.length === 0) {
        return <div className="text-center py-10 text-gray-500">
            Không tìm thấy người dùng nào {searchTerm && `với từ khóa "${searchTerm}"`}.
        </div>;
    }


    return (
        <table className="w-full table-auto border-collapse text-left">
            <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50/50 text-sm uppercase text-gray-700">
                    <th className="p-3 font-semibold">Tên Người dùng</th>
                    <th className="p-3 font-semibold">Email</th>
                    <th className="p-3 font-semibold">Số điện thoại</th>
                    <th className="p-3 font-semibold text-center">Thao Tác</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => {
                    return (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition">
                            <td className="p-3 font-semibold text-gray-800">{user.name}</td>
                            <td className="p-3 text-gray-600">{user.email}</td>
                            <td className="p-3 text-gray-600">{user.phone}</td>
                            <td className="p-3 flex justify-center space-x-4">
                                <button 
                                    title="Sửa thông tin" 
                                    onClick={() => onEditClick(user.email)} 
                                    className="text-blue-600 hover:text-blue-800 transition p-1 rounded-full hover:bg-blue-100"
                                >
                                    <Edit className="h-5 w-5" />
                                </button>
                                <button 
                                    title="Xóa người dùng" 
                                    onClick={() => onDeleteClick(user.email, user.name)}
                                    className="text-red-600 hover:text-red-800 transition p-1 rounded-full hover:bg-red-100"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default UserListPage;
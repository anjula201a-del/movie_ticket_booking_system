import { useEffect, useState } from "react";
import { User } from "../../models/User";
import UserService from "../../service/UserService";
import { UserEdit } from "./UserEdit";

export const UserView = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const getAllUsers = async () => {
        try {
            const userData = await UserService.getUsers();
            if (userData) setUsers(userData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const handleOnEdit = (user: User) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleOnDelete = async (userId: string) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        const status = await UserService.deleteUser(userId);
        if (status !== 204) {
            alert("User Delete Fail");
        } else {
            alert("User Deleted Successfully");
            getAllUsers();
        }
    };

    const filtered = users.filter(
        (u) =>
            u.userName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
          <div
            className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat px-4 py-8"
            style={{ backgroundImage: "url('users.jpg')" }}
        >
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Users</h2>
                </div>

                <div className="px-6 py-4 border-b border-gray-200">
                    <input
                        placeholder="Search by name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-1/2 p-2 border rounded"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading && (
                                <tr><td colSpan={5} className="px-6 py-6 text-center text-gray-500">Loading users...</td></tr>
                            )}
                            {!loading && filtered.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-6 text-center text-gray-500">No users found.</td></tr>
                            )}
                            {filtered.map((user) => (
                                <tr key={user.userId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-700">{user.userId}</td>
                                    <td className="px-6 py-4 font-medium">{user.userName}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                                        <button onClick={() => handleOnEdit(user)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                            Edit
                                        </button>
                                        <button onClick={() => handleOnDelete(user.userId)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </div>
            </div>

            <UserEdit
                open={open}
                user={selectedUser}
                onClose={() => setOpen(false)}
                onSave={getAllUsers}
            />
        </>
    );
};
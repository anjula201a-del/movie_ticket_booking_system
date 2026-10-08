import React, { ChangeEvent, useEffect, useState } from "react";
import { User } from "../../models/User";
import { UserEditProps } from "../../models/UserEditProps";
import UserService from "../../service/UserService";


const ROLES = ["ADMIN", "CUSTOMER"];

const inputStyle =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none";

export const UserEdit = ({ open, user, onClose, onSave }: UserEditProps) => {
    const [formData, setFormData] = useState<User | null>(null);

    useEffect(() => {
        setFormData(user ? { ...user, password: "" } : null);
    }, [user, open]);

    const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleOnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        if (!formData.userName.trim()) {
            alert("User name is required");
            return;
        }
        if (formData.password && formData.password.length < 6) {
            alert("A new password must be at least 6 characters");
            return;
        }

        const { password, ...rest } = formData;
        const payload: User = password ? { ...rest, password } : { ...rest };

        const status = await UserService.updateUser(payload);
        if (status === 204) {
            alert("User Details Updated Successfully");
            onSave();
            onClose();
        } else {
            alert("User Details Update Failed");
        }
    };

    if (!open || !formData) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl">
                <div className="border-b px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-800">Edit User</h2>
                </div>

                <form onSubmit={handleOnSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">User name</label>
                        <input name="userName" value={formData.userName} onChange={handleOnChange} className={inputStyle} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                        <input type="email" name="email" value={formData.email} readOnly className={`${inputStyle} bg-gray-100 text-gray-500`} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password ?? ""}
                            onChange={handleOnChange}
                            placeholder="Leave empty to keep the current password"
                            className={inputStyle}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select name="role" value={formData.role} onChange={handleOnChange} className={inputStyle}>
                            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
import React, { ChangeEvent, useEffect, useState } from "react";
import { Theatre } from "../../models/Theatre";
import { TheatreEditProps } from "../../models/TheatreEditProps";
import TheatreService from "../../service/TheatreService";

export const THEATRE_STATUSES = ["ACTIVE", "INACTIVE"];

const emptyTheatre: Theatre = {
    theatreId: "",
    theatreName: "",
    location: "",
    capacity: 0,
    status: THEATRE_STATUSES[0],
};

const inputStyle =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none";

export const TheatreEdit = ({ open, theatre, onClose, onSave }: TheatreEditProps) => {
    const [formData, setFormData] = useState<Theatre>(emptyTheatre);
    const isNew = theatre === null;

    useEffect(() => {
        setFormData(theatre ?? emptyTheatre);
    }, [theatre, open]);

    const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "capacity" ? Number(value) : value,
        }));
    };

    const handleOnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.theatreName.trim() || !formData.location.trim() || formData.capacity <= 0) {
            alert("Name, location and a capacity above 0 are required");
            return;
        }

        if (isNew) {
            const status = await TheatreService.saveTheatre({ ...formData, theatreId: undefined });
            if (status === 201) {
                alert("Theatre Added Successfully");
                onSave();
                onClose();
            } else {
                alert("Theatre Add Failed");
            }
        } else {
            const status = await TheatreService.updateTheatre(formData);
            if (status === 204) {
                alert("Theatre Updated Successfully");
                onSave();
                onClose();
            } else {
                alert("Theatre Update Failed");
            }
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="border-b px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isNew ? "Add Theatre" : "Edit Theatre"}
                    </h2>
                </div>

                <form onSubmit={handleOnSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Theatre name</label>
                        <input name="theatreName" value={formData.theatreName} onChange={handleOnChange} className={inputStyle} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input name="location" value={formData.location} onChange={handleOnChange} className={inputStyle} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (seats)</label>
                        <input type="number" name="capacity" value={formData.capacity} onChange={handleOnChange} className={inputStyle} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select name="status" value={formData.status} onChange={handleOnChange} className={inputStyle}>
                            {THEATRE_STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition">
                            {isNew ? "Add Theatre" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
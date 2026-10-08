import React, { ChangeEvent, useEffect, useState } from "react";
import { Show } from "../../models/Show";
import { ShowEditProps } from "../../models/ShowEditProps";
import ShowService from "../../service/ShowService";


const SHOW_STATUSES = ["SHEDULE", "COMPLETED", "CANCELLED"];

const emptyShow: Show = {
    showId: "",
    movieId: "",
    theatreId: "",
    showDate: "",
    showTime: "",
    ticketPrice: 0,
    status: SHOW_STATUSES[0],
};

const inputStyle =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none";

export const ShowEdit = ({ open, show, movies, theatres, onClose, onSave }: ShowEditProps) => {
    const [formData, setFormData] = useState<Show>(emptyShow);
    const isNew = show === null;

    useEffect(() => {
        setFormData(show ?? emptyShow);
    }, [show, open]);

    const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "ticketPrice" ? Number(value) : value,
        }));
    };

    const handleOnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.movieId || !formData.theatreId || !formData.showDate || !formData.showTime || formData.ticketPrice <= 0) {
            alert("Movie, theatre, date, time and a price above 0 are required");
            return;
        }

        if (isNew) {
            const status = await ShowService.saveShow({ ...formData, showId: undefined });
            if (status === 201) {
                alert("Show Added Successfully");
                onSave();
                onClose();
            } else {
                alert("Show Add Failed");
            }
        } else {
            const status = await ShowService.updateShow(formData);
            if (status === 204) {
                alert("Show Updated Successfully");
                onSave();
                onClose();
            } else {
                alert("Show Update Failed");
            }
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="border-b px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isNew ? "Add Show" : "Edit Show"}
                    </h2>
                </div>

                <form onSubmit={handleOnSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Movie</label>
                        <select name="movieId" value={formData.movieId} onChange={handleOnChange} className={inputStyle}>
                            <option value="">Select a movie</option>
                            {movies.map((m) => (
                                <option key={m.movieId} value={m.movieId}>{m.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Theatre</label>
                        <select name="theatreId" value={formData.theatreId} onChange={handleOnChange} className={inputStyle}>
                            <option value="">Select a theatre</option>
                            {theatres.map((t) => (
                                <option key={t.theatreId} value={t.theatreId}>{t.theatreName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input type="date" name="showDate" value={formData.showDate} onChange={handleOnChange} className={inputStyle} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input type="time" name="showTime" value={formData.showTime} onChange={handleOnChange} className={inputStyle} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ticket price</label>
                        <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleOnChange} className={inputStyle} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select name="status" value={formData.status} onChange={handleOnChange} className={inputStyle}>
                            {SHOW_STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition">
                            {isNew ? "Add Show" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
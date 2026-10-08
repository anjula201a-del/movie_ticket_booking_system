import React, { ChangeEvent, useEffect, useState } from "react";
import { Movie } from "../../models/Movie";
import { MovieEditProps } from "../../models/MovieEditProps";
import MovieService from "../../service/MovieService";

const MOVIE_STATUSES = ["UPCOMING", "NOW_SHOWING", "ENDED"];

const emptyMovie: Movie = {
    movieId: "",
    title: "",
    description: "",
    duration: 0,
    language: "",
    genre: "",
    releaseDate: "",
    status: MOVIE_STATUSES[0],
};

const inputStyle =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none";

export const MovieEdit = ({ open, movie, onClose, onSave }: MovieEditProps) => {
    const [formData, setFormData] = useState<Movie>(emptyMovie);
    const isNew = movie === null;

    useEffect(() => {
        setFormData(movie ?? emptyMovie);
    }, [movie, open]);

    const handleOnChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "duration" ? Number(value) : value,
        }));
    };

    const handleOnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.releaseDate || formData.duration <= 0) {
            alert("Title, duration and release date are required");
            return;
        }

        if (isNew) {
            const status = await MovieService.saveMovie({ ...formData, movieId: undefined });
            if (status === 201) {
                alert("Movie Added Successfully");
                onSave();
                onClose();
            } else {
                alert("Movie Add Failed");
            }
        } else {
            const status = await MovieService.updateMovie(formData);
            if (status === 204) {
                alert("Movie Updated Successfully");
                onSave();
                onClose();
            } else {
                alert("Movie Update Failed");
            }
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="border-b px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isNew ? "Add Movie" : "Edit Movie"}
                    </h2>
                   
                </div>

                {/* Form */}
                <form onSubmit={handleOnSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input name="title" value={formData.title} onChange={handleOnChange} className={inputStyle} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" rows={3} value={formData.description} onChange={handleOnChange} className={inputStyle} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                            <input type="number" name="duration" value={formData.duration} onChange={handleOnChange} className={inputStyle} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Release date</label>
                            <input type="date" name="releaseDate" value={String(formData.releaseDate ?? "")} onChange={handleOnChange} className={inputStyle} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                            <input name="language" value={formData.language} onChange={handleOnChange} className={inputStyle} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                            <input name="genre" value={formData.genre} onChange={handleOnChange} className={inputStyle} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select name="status" value={formData.status} onChange={handleOnChange} className={inputStyle}>
                            {MOVIE_STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition">
                            {isNew ? "Add Movie" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
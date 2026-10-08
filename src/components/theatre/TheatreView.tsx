import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Theatre } from "../../models/Theatre";
import TheatreService from "../../service/TheatreService";
import { TheatreEdit } from "./TheatreEdit";
import { useAuth } from "../auth/AuthProvider";

export const TheatreView = () => {
    const [theatres, setTheatres] = useState<Theatre[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedTheatre, setSelectedTheatre] = useState<Theatre | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const { role } = useAuth();
    const isAdmin = role?.replace("ROLE_", "") === "ADMIN";

    const getAllTheatres = async () => {
        try {
            const data = await TheatreService.getTheatres();
            if (data) setTheatres(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllTheatres();
    }, []);

    const handleOnAdd = () => {
        setSelectedTheatre(null);
        setOpen(true);
    };

    const handleOnEdit = (theatre: Theatre) => {
        setSelectedTheatre(theatre);
        setOpen(true);
    };

    const handleOnDelete = async (theatreId: string) => {
        if (!window.confirm("Are you sure you want to delete this theatre?")) return;
        const status = await TheatreService.deleteTheatre(theatreId);
        if (status !== 204) {
            alert("Theatre Delete Fail");
        } else {
            alert("Theatre Deleted Successfully");
            getAllTheatres();
        }
    };

    const filtered = theatres.filter(
        (t) =>
            t.theatreName.toLowerCase().includes(search.toLowerCase()) ||
            t.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
           <div
            className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat px-4 py-8"
            style={{ backgroundImage: "url('theater.jpg')" }}
        >
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Theatres</h2>
                    </div>
                    {isAdmin && (
                        <button onClick={handleOnAdd} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                            + Add Theatre
                        </button>
                    )}
                </div>

               
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Capacity</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading && (
                                <tr><td colSpan={5} className="px-6 py-6 text-center text-gray-500">Loading theatres...</td></tr>
                            )}
                            {!loading && filtered.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-6 text-center text-gray-500">No theatres found.</td></tr>
                            )}
                            {filtered.map((t) => (
                                <tr key={t.theatreId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{t.theatreName}</td>
                                    <td className="px-6 py-4 text-gray-600">{t.location}</td>
                                    <td className="px-6 py-4 text-gray-600">{t.capacity}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                                        <Link to={`/shows?theatreId=${t.theatreId}`} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition inline-block">
                                            Shows
                                        </Link>
                                        {isAdmin && (
                                            <>
                                                <button onClick={() => handleOnEdit(t)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleOnDelete(t.theatreId)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

            <TheatreEdit
                open={open}
                theatre={selectedTheatre}
                onClose={() => setOpen(false)}
                onSave={getAllTheatres}
            />
        </>
    );
};
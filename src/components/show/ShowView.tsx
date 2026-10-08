import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Show } from "../../models/Show";
import { Movie } from "../../models/Movie";
import { Theatre } from "../../models/Theatre";
import ShowService from "../../service/ShowService";
import MovieService from "../../service/MovieService";
import TheatreService from "../../service/TheatreService";
import { ShowEdit } from "./ShowEdit";
import { useAuth } from "../auth/AuthProvider";

export const ShowView = () => {
    const [searchParams] = useSearchParams();

    const [shows, setShows] = useState<Show[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [theatres, setTheatres] = useState<Theatre[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedShow, setSelectedShow] = useState<Show | null>(null);
    const [loading, setLoading] = useState(true);

    
    const [movieFilter, setMovieFilter] = useState(searchParams.get("movieId") ?? "");
    const [theatreFilter, setTheatreFilter] = useState(searchParams.get("theatreId") ?? "");
    const [dateFilter, setDateFilter] = useState("");

    const { role } = useAuth();
    const isAdmin = role?.replace("ROLE_", "") === "ADMIN";

    const getAllShows = async () => {
        try {
            const data = await ShowService.getShows();
            if (data) setShows(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllShows();
        const loadLookups = async () => {
            const movieData = await MovieService.getMovies();
            if (movieData) setMovies(movieData);
            const theatreData = await TheatreService.getTheatres();
            if (theatreData) setTheatres(theatreData);
        };
        loadLookups();
    }, []);

    const movieName = (id: string) => movies.find((m) => m.movieId === id)?.title ?? id;
    const theatreName = (id: string) => theatres.find((t) => t.theatreId === id)?.theatreName ?? id;

    const handleOnAdd = () => {
        setSelectedShow(null);
        setOpen(true);
    };

    const handleOnEdit = (show: Show) => {
        setSelectedShow(show);
        setOpen(true);
    };

   const handleOnDelete = async (show: Show) => {
    if (!window.confirm("Are you sure you want to delete this show?")) return;

    try {
        const status = await ShowService.deleteShow(show.showId);
        if (status === 204 || status === 200) {
            alert("Show Deleted Successfully");
            getAllShows();
        } else {
            alert("Show Delete Failed");
        }
    } catch (err) {
        console.error("Delete error:", err);
        alert("An error occurred while deleting the show.");
    }
};
    const handleClearFilters = () => {
        setMovieFilter("");
        setTheatreFilter("");
        setDateFilter("");
    };

    const filtered = shows.filter(
        (s) =>
            (!movieFilter || s.movieId === movieFilter) &&
            (!theatreFilter || s.theatreId === theatreFilter) &&
            (!dateFilter || String(s.showDate) === dateFilter)
    );

    return (
        <>
         <div
            className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat px-4 py-8"
            style={{ backgroundImage: "url('show.jpg')" }}
        >
            <div className="max-w-6xl mx-auto  bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Shows</h2>
                    </div>
                    {isAdmin && (
                        <button onClick={handleOnAdd} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                            + Add Show
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="px-6 py-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 border-b border-gray-200">
                    <select value={movieFilter} onChange={(e) => setMovieFilter(e.target.value)} className="p-2 border rounded">
                        <option value="">All movies</option>
                        {movies.map((m) => <option key={m.movieId} value={m.movieId}>{m.title}</option>)}
                    </select>
                    <select value={theatreFilter} onChange={(e) => setTheatreFilter(e.target.value)} className="p-2 border rounded">
                        <option value="">All theatres</option>
                        {theatres.map((t) => <option key={t.theatreId} value={t.theatreId}>{t.theatreName}</option>)}
                    </select>
                    <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="p-2 border rounded" />
                    <button onClick={handleClearFilters} className="p-2 border rounded text-green-700 hover:bg-gray-100">
                        Clear filters
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Movie</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Theatre</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading && (
                                <tr><td colSpan={7} className="px-6 py-6 text-center text-gray-500">Loading shows...</td></tr>
                            )}
                            {!loading && filtered.length === 0 && (
                                <tr><td colSpan={7} className="px-6 py-6 text-center text-gray-500">No shows found.</td></tr>
                            )}
                            {filtered.map((show) => (
                                <tr key={show.showId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{movieName(show.movieId)}</td>
                                    <td className="px-6 py-4 text-gray-600">{theatreName(show.theatreId)}</td>
                                    <td className="px-6 py-4 text-gray-600">{String(show.showDate)}</td>
                                    <td className="px-6 py-4 text-gray-600">{String(show.showTime).slice(0, 5)}</td>
                                    <td className="px-6 py-4 text-gray-600">Rs. {show.ticketPrice}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                            {show.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                                        <Link to={`/shows/${show.showId}/book`} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition inline-block">
                                            Book
                                        </Link>
                                        {isAdmin && (
                                            <>
                                                <button onClick={() => handleOnEdit(show)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleOnDelete(show)} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition">
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

            <ShowEdit
                open={open}
                show={selectedShow}
                movies={movies}
                theatres={theatres}
                onClose={() => setOpen(false)}
                onSave={getAllShows}
            />
        </>
    );
};
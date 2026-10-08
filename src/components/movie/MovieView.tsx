import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Movie } from "../../models/Movie";
import MovieService from "../../service/MovieService";
import { MovieEdit } from "./MovieEdit";
import { useAuth } from "../auth/AuthProvider";

export const MovieView = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const { role } = useAuth();
    const isAdmin = role?.replace("ROLE_", "") === "ADMIN";

    const getAllMovies = async () => {
        try {
            const movieData = await MovieService.getMovies();
            if (movieData) setMovies(movieData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllMovies();
    }, []);

    const handleOnAdd = () => {
        setSelectedMovie(null); 
        setOpen(true);
    };

    const handleOnEdit = (movie: Movie) => {
        setSelectedMovie(movie);
        setOpen(true);
    };

    const handleOnDelete = async (movieId: string) => {
        if (!window.confirm("Are you sure you want to delete this movie?")) return;
        const status = await MovieService.deleteMovie(movieId);
        if (status !== 204) {
            alert("Movie Delete Fail");
        } else {
            alert("Movie Deleted Successfully");
            getAllMovies();
        }
    };

    const statuses = Array.from(new Set(movies.map((m) => m.status)));
    const filtered = movies.filter(
        (m) =>
            m.title.toLowerCase().includes(search.toLowerCase()) &&
            (!statusFilter || m.status === statusFilter)
    );

    return (
    <>
        <div
            className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat px-4 py-8"
            style={{ backgroundImage: "url('movies.jpg')" }}
        >

            <div className="max-w-6xl mx-auto bg-white/95 rounded-xl shadow-md border border-gray-200 overflow-hidden">

                <div className="px-6 py-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Movies</h2>
                    </div>
                    {isAdmin && (
                        <button onClick={handleOnAdd} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                            + Add Movie
                        </button>
                    )}
                </div>
                <div className="px-6 py-4 grid gap-3 sm:grid-cols-2 border-b border-gray-200">
                    <input
                        placeholder="Search by title"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-2 border rounded"
                    />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded">
                        <option value="">All statuses</option>
                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Genre</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Language</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Duration</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Release Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {loading && (
                                <tr><td colSpan={7} className="px-6 py-6 text-center text-gray-500">Loading movies...</td></tr>
                            )}

                            {!loading && filtered.length === 0 && (
                                <tr><td colSpan={7} className="px-6 py-6 text-center text-gray-500">No movies found.</td></tr>
                            )}

                            {filtered.map((movie) => (
                                <tr key={movie.movieId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{movie.title}</td>
                                    <td className="px-6 py-4 text-gray-600">{movie.genre}</td>
                                    <td className="px-6 py-4 text-gray-600">{movie.language}</td>
                                    <td className="px-6 py-4 text-gray-600">{movie.duration} min</td>
                                    <td className="px-6 py-4 text-gray-600">{String(movie.releaseDate)}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                            {movie.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                                        <Link to={`/movies/${movie.movieId}`} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition inline-block">
                                            View
                                        </Link>
                                        {isAdmin && (
                                            <>
                                                <button onClick={() => handleOnEdit(movie)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleOnDelete(movie.movieId)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
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
        <MovieEdit
            open={open}
            movie={selectedMovie}
            onClose={() => setOpen(false)}
            onSave={getAllMovies}
        />
    </>
);
}
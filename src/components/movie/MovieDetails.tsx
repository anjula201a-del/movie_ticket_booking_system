import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Movie } from "../../models/Movie";
import MovieService from "../../service/MovieService";

export const MovieDetails = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadMovie = async () => {
            if (!movieId) return;
            const data = await MovieService.getMovieById(movieId);
            if (data) {
                setMovie(data);
            } else {
                setError("Could not load this movie.");
            }
            setLoading(false);
        };
        loadMovie();
    }, [movieId]);

    if (loading) return <p className="p-6">Loading...</p>;

    if (error || !movie)
        return (
            <div className="p-6 max-w-3xl mx-auto">
                <p className="p-3 text-red-700 bg-red-100 rounded">
                    {error || "Movie not found."}
                </p>
                <Link to="/movies" className="inline-block mt-4 text-blue-600 underline">
                    ← Back
                </Link>
            </div>
        );

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <Link to="/movies" className="text-blue-600">
                ← Back
            </Link>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <h1 className="text-3xl font-bold text-gray-800">{movie.title}</h1>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                        {movie.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                    <div>
                        <p className="text-gray-500">Genre</p>
                        <p className="font-medium">{movie.genre}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Language</p>
                        <p className="font-medium">{movie.language}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Duration</p>
                        <p className="font-medium">{movie.duration} min</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Release date</p>
                        <p className="font-medium">{String(movie.releaseDate)}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-gray-500 text-sm">Description</p>
                    <p className="mt-1 text-gray-800">{movie.description}</p>
                </div>
               
            </div>
        </div>
    );
};
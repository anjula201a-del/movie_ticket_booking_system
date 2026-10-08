import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Show } from "../../models/Show";
import { Movie } from "../../models/Movie";
import { Theatre } from "../../models/Theatre";
import ShowService from "../../service/ShowService";
import MovieService from "../../service/MovieService";
import TheatreService from "../../service/TheatreService";
import BookingService from "../../service/BookingService";
import { getCurrentUserId } from "../../models/ReadRole";

const BOOKING_PENDING = "PENDING";
const BOOKING_CANCELLED = "CANCELLED";
const SEATS_PER_ROW = 10;

export const SeatSelection = () => {
    const { showId } = useParams();
    const navigate = useNavigate();

    const [show, setShow] = useState<Show | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [theatre, setTheatre] = useState<Theatre | null>(null);
    const [takenSeats, setTakenSeats] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            if (!showId) return;
            const showData = await ShowService.getShowById(showId);
            if (!showData) {
                setError("Could not load this show.");
                setLoading(false);
                return;
            }
            setShow(showData);

            const [movies, theatres, bookings] = await Promise.all([
                MovieService.getMovies(),
                TheatreService.getTheatres(),
                BookingService.getBookings(),
            ]);
            setMovie(movies?.find((m) => m.movieId === showData.movieId) ?? null);
            setTheatre(theatres?.find((t) => t.theatreId === showData.theatreId) ?? null);

            const taken = (bookings ?? [])
                .filter((b) => b.showId === showId && b.status !== BOOKING_CANCELLED)
                .flatMap((b) => b.seatNumbers);
            setTakenSeats(taken);
            setLoading(false);
        };
        load();
    }, [showId]);

    const capacity = theatre?.capacity ?? 0;
    const seats = Array.from(
        { length: capacity },
        (_, i) => `${String.fromCharCode(65 + Math.floor(i / SEATS_PER_ROW))}${(i % SEATS_PER_ROW) + 1}`
    );

    const toggleSeat = (seat: string) => {
        if (takenSeats.includes(seat)) return;
        setSelected((prev) =>
            prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
        );
    };

    const total = show ? selected.length * show.ticketPrice : 0;

    const handleConfirm = async () => {
        if (!show || selected.length === 0) return;
        const userId = getCurrentUserId();
        if (!userId) {
            setError("Could not find your user ID. Please sign in again.");
            return;
        }
        setSubmitting(true);
        const status = await BookingService.saveBooking({
            userId,
            showId: show.showId,
            seatNumbers: selected,
            numberOfTickets: selected.length,
            totalAmount: total,
            bookingDate: new Date().toISOString().slice(0, 10),
            status: BOOKING_PENDING,
        });
        setSubmitting(false);

        if (status === 201) {
            alert("Booking created. Please complete the payment.");
            navigate("/bookings");
        } else {
            alert("Booking Failed.show may Canceled or Completed.");
        }
    };

    if (loading) return <p className="p-6">Loading...</p>;
    if (!show)
        return (
            <p className="m-6 p-3 text-red-700 bg-red-100 rounded">{error || "Show not found."}</p>
        );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Link to="/shows" className="text-blue-600 underline">← Back</Link>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-4">
                <h1 className="text-2xl font-bold text-gray-800">{movie?.title ?? "Movie"}</h1>
                <p className="text-gray-600 mt-1">
                    {theatre?.theatreName} • {String(show.showDate)} • {String(show.showTime).slice(0, 5)} • Rs. {show.ticketPrice} per ticket
                </p>

                {error && <p className="mt-4 p-2 text-sm text-red-700 bg-red-100 rounded">{error}</p>}

                {capacity === 0 ? (
                    <p className="mt-6 text-gray-600">This theatre has no seats configured.</p>
                ) : (
                    <div
                        className="grid gap-2 mt-6 justify-center"
                        style={{ gridTemplateColumns: `repeat(${SEATS_PER_ROW}, minmax(0, 2.5rem))` }}
                    >
                        {seats.map((seat) => {
                            const isTaken = takenSeats.includes(seat);
                            const isSelected = selected.includes(seat);
                            return (
                                <button
                                    key={seat}
                                    type="button"
                                    disabled={isTaken}
                                    onClick={() => toggleSeat(seat)}
                                    className={`h-10 rounded text-xs font-medium transition ${
                                        isTaken
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : isSelected
                                            ? "bg-red-600 text-white"
                                            : "bg-green-100 text-green-800 hover:bg-green-200"
                                    }`}
                                >
                                    {seat}
                                </button>
                            );
                        })}
                    </div>
                )}

                <div className="flex flex-wrap gap-4 justify-center mt-4 text-xs text-gray-600">
                    <span><span className="inline-block w-3 h-3 bg-green-100 mr-1" />Available</span>
                    <span><span className="inline-block w-3 h-3 bg-red-600 mr-1" />Selected</span>
                    <span><span className="inline-block w-3 h-3 bg-gray-300 mr-1" />Taken</span>
                </div>

                {/* Summary */}
                <div className="mt-8 border-t pt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm text-gray-700">
                        <p>Selected seats: <b>{selected.length ? selected.join(", ") : "none"}</b></p>
                        <p>Tickets: <b>{selected.length}</b></p>
                        <p className="text-lg mt-1">Total: <b>Rs. {total}</b></p>
                    </div>
                    <button
                        onClick={handleConfirm}
                        disabled={selected.length === 0 || submitting}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {submitting ? "Booking..." : "Confirm Booking"}
                    </button>
                </div>
            </div>
        </div>
    );
};
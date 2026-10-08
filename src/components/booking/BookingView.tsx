import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Booking } from "../../models/Booking";
import { Show } from "../../models/Show";
import { Movie } from "../../models/Movie";
import { Theatre } from "../../models/Theatre";
import BookingService from "../../service/BookingService";
import ShowService from "../../service/ShowService";
import MovieService from "../../service/MovieService";
import TheatreService from "../../service/TheatreService";
import { useAuth } from "../auth/AuthProvider";
import { getCurrentUserId } from "../../models/ReadRole";

const BOOKING_PENDING = "PENDING";
const BOOKING_CANCELLED = "CANCELLED";

export const BookingView = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [shows, setShows] = useState<Show[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [theatres, setTheatres] = useState<Theatre[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");

    const { role } = useAuth();
    const isAdmin = role?.replace("ROLE_", "") === "ADMIN";
    const userId = getCurrentUserId();

    const loadBookings = async () => {
        const data = await BookingService.getBookings();
        if (data) setBookings(data);
        setLoading(false);
    };

    useEffect(() => {
        loadBookings();
        const loadLookups = async () => {
            const s = await ShowService.getShows();
            if (s) setShows(s);
            const m = await MovieService.getMovies();
            if (m) setMovies(m);
            const t = await TheatreService.getTheatres();
            if (t) setTheatres(t);
        };
        loadLookups();
    }, []);

    const findShow = (id: string) => shows.find((s) => s.showId === id);
    const movieName = (show?: Show) => movies.find((m) => m.movieId === show?.movieId)?.title ?? "-";
    const theatreName = (show?: Show) => theatres.find((t) => t.theatreId === show?.theatreId)?.theatreName ?? "-";

   const canCancel = (b: Booking) => {
    return b.status !== BOOKING_CANCELLED;
};

const handleOnCancel = async (booking: Booking) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    const status = await BookingService.updateBooking({
        ...booking,
        status: BOOKING_CANCELLED,
    });
    if (status !== 204) {
        alert("Booking Cancel Fail");
    } else {
        alert("Booking Cancelled Successfully");
        loadBookings();
    }
};

    const visible = bookings
        .filter((b) => isAdmin || b.userId === userId)
        .filter((b) => !statusFilter || b.status === statusFilter);
    const statuses = Array.from(new Set(bookings.map((b) => b.status)));

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat px-4 py-8"
            style={{ backgroundImage: "url('tickets.jpg')" }}
        >
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{isAdmin ? "Bookings" : "My Bookings"}</h2>
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded">
                    <option value="">status</option>
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            {["Movie", "Theatre", "Show time", "Seats", "Tickets", "Total", "Status", "Actions"].map((h) => (
                                <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading && (
                            <tr><td colSpan={8} className="px-6 py-6 text-center text-gray-500">Loading bookings...</td></tr>
                        )}
                        {!loading && visible.length === 0 && (
                            <tr><td colSpan={8} className="px-6 py-6 text-center text-gray-500">No bookings found.</td></tr>
                        )}
                        {visible.map((b) => {
                            const show = findShow(b.showId);
                            return (
                                <tr key={b.bookingId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{movieName(show)}</td>
                                    <td className="px-6 py-4 text-gray-600">{theatreName(show)}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {show ? `${show.showDate} ${String(show.showTime).slice(0, 5)}` : "-"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{b.seatNumbers.join(", ")}</td>
                                    <td className="px-6 py-4 text-gray-600">{b.numberOfTickets}</td>
                                    <td className="px-6 py-4 text-gray-600">Rs. {b.totalAmount}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                                        {b.status === BOOKING_PENDING && (
                                            <Link
                                                to={`/payments?bookingId=${b.bookingId}`}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition inline-block"
                                            >
                                                Pay
                                            </Link>
                                        )}
                                        {canCancel(b) && (
                                            <button onClick={() => handleOnCancel(b)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    );
};
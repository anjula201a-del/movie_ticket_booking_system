import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Booking } from "../../models/Booking";
import { Show } from "../../models/Show";
import { Movie } from "../../models/Movie";
import BookingService from "../../service/BookingService";
import ShowService from "../../service/ShowService";
import MovieService from "../../service/MovieService";
import { PaymentEdit } from "./PaymentEdit";
import { useAuth } from "../auth/AuthProvider";
import { getCurrentUserId } from "../../models/ReadRole";

const BOOKING_PENDING = "PENDING";
const BOOKING_CONFIRMED = "CONFIRMED";

const paymentStatus = (b: Booking) =>
    b.status === BOOKING_CONFIRMED ? "PAID" : b.status === BOOKING_PENDING ? "UNPAID" : b.status;

export const PaymentView = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const preselected = searchParams.get("bookingId") ?? "";

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [shows, setShows] = useState<Show[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");

    const { role } = useAuth();
    const isAdmin = role?.replace("ROLE_", "") === "ADMIN";
    const userId = getCurrentUserId();

    const loadData = async () => {
        const b = await BookingService.getBookings();
        if (b) setBookings(b);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
        const loadLookups = async () => {
            const s = await ShowService.getShows();
            if (s) setShows(s);
            const m = await MovieService.getMovies();
            if (m) setMovies(m);
        };
        loadLookups();
    }, []);

    const movieName = (showId: string) => {
        const show = shows.find((s) => s.showId === showId);
        return movies.find((m) => m.movieId === show?.movieId)?.title ?? "-";
    };

    const mine = bookings.filter((b) => isAdmin || b.userId === userId);
    const payable = mine.filter((b) => b.status === BOOKING_PENDING);

    useEffect(() => {
        if (!loading && preselected && payable.some((b) => b.bookingId === preselected)) {
            setOpen(true);
        }
    }, [loading, preselected]);

    const handleOnClose = () => {
        setOpen(false);
        if (preselected) setSearchParams({});
    };

    const visible = mine.filter((b) => !statusFilter || paymentStatus(b) === statusFilter);
    const statuses = Array.from(new Set(mine.map(paymentStatus)));

    return (
        <>
             <div
            className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat px-4 py-8"
            style={{ backgroundImage: "url('payment.jpg')" }}
        >
            <div className="max-w-6xl mx-auto  bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{isAdmin ? "Payments" : "My Payments"}</h2>
                    </div>
                    <button onClick={() => setOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                        + Make Payment
                    </button>
                </div>

                <div className="px-6 py-4 border-b border-gray-200">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded">
                        <option value="">status</option>
                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                {["Booking ID", "Movie", "Seats", "Tickets", "Amount", "Payment Status", "Actions"].map((h) => (
                                    <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading && (
                                <tr><td colSpan={7} className="px-6 py-6 text-center text-gray-500">Loading payments...</td></tr>
                            )}
                            {!loading && visible.length === 0 && (
                                <tr><td colSpan={7} className="px-6 py-6 text-center text-gray-500">No payments found.</td></tr>
                            )}
                            {visible.map((b) => (
                                <tr key={b.bookingId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-700">{b.bookingId}</td>
                                    <td className="px-6 py-4 font-medium">{movieName(b.showId)}</td>
                                    <td className="px-6 py-4 text-gray-600">{b.seatNumbers.join(", ")}</td>
                                    <td className="px-6 py-4 text-gray-600">{b.numberOfTickets}</td>
                                    <td className="px-6 py-4 text-gray-600">Rs. {b.totalAmount}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                paymentStatus(b) === "PAID"
                                                    ? "bg-green-100 text-green-700"
                                                    : paymentStatus(b) === "UNPAID"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-200 text-gray-600"
                                            }`}
                                        >
                                            {paymentStatus(b)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {b.status === BOOKING_PENDING && (
                                            <button
                                                onClick={() => {
                                                    setSearchParams({ bookingId: b.bookingId });
                                                    setOpen(true);
                                                }}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                            >
                                                Pay
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
                
            </div>

            <PaymentEdit
                open={open}
                bookings={payable}
                preselectedBookingId={preselected}
                onClose={handleOnClose}
                onSave={loadData}
            />
        </>
    );
};
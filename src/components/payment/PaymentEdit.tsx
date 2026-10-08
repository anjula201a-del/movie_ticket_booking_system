import React, { ChangeEvent, useEffect, useState } from "react";
import { PaymentEditProps } from "../../models/PaymentEditProps";
import PaymentService from "../../service/PaymentService";
import BookingService from "../../service/BookingService";

const PAYMENT_METHODS = ["CASH", "CARD", "ONLINE_TRANSFER"]; 
const PAYMENT_COMPLETED = "COMPLETED";                    
const BOOKING_CONFIRMED = "CONFIRMED";                       


const inputStyle =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none";

export const PaymentEdit = ({
    open,
    bookings,
    preselectedBookingId,
    onClose,
    onSave,
}: PaymentEditProps) => {
    const [bookingId, setBookingId] = useState("");
    const [method, setMethod] = useState(PAYMENT_METHODS[0]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setBookingId(preselectedBookingId ?? "");
        setMethod(PAYMENT_METHODS[0]);
    }, [open, preselectedBookingId]);

    const selectedBooking = bookings.find((b) => b.bookingId === bookingId);

    const handleOnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBooking) {
            alert("Please select a booking");
            return;
        }

        setSubmitting(true);
        const status = await PaymentService.savePayment({
            bookingId: selectedBooking.bookingId,
            amount: selectedBooking.totalAmount,
            paymenDate: new Date().toISOString().slice(0, 10),
            pmstatus: method,
            status: PAYMENT_COMPLETED,
        });

        if (status === 201) {
            await BookingService.updateBooking({
                ...selectedBooking,
                status: BOOKING_CONFIRMED,
            });
            alert("Payment Successful");
            onSave();
            onClose();
        } else {
            alert("Payment Failed. Please try again.");
        }
        setSubmitting(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="border-b px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-800">Make Payment</h2>
                </div>

                <form onSubmit={handleOnSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Booking</label>
                        <select
                            value={bookingId}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setBookingId(e.target.value)}
                            className={inputStyle}
                        >
                            <option value="">Select a booking</option>
                            {bookings.map((b) => (
                                <option key={b.bookingId} value={b.bookingId}>
                                    {b.seatNumbers.join(", ")} - Rs. {b.totalAmount}
                                </option>
                            ))}
                        </select>
                        {bookings.length === 0 && (
                            <p className="mt-1 text-xs text-gray-500">You have no unpaid bookings.</p>
                        )}
                    </div>

                    {selectedBooking && (
                        <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
                            <p>Tickets: <b>{selectedBooking.numberOfTickets}</b></p>
                            <p className="text-lg">Amount to pay: <b>Rs. {selectedBooking.totalAmount}</b></p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment method</label>
                        <select value={method} onChange={(e) => setMethod(e.target.value)} className={inputStyle}>
                            {PAYMENT_METHODS.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 transition">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !selectedBooking}
                            className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {submitting ? "Processing..." : "Pay"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
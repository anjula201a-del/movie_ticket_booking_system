import axios from "axios";
import { Booking } from "../models/Booking";
import { BASE_URL, handleToken } from "../libs/Token";

const getBookings = async () => {
    try {
        const response = await axios.get<Booking[]>(
            `${BASE_URL}/bookings`, 
            {
            headers: { Authorization: handleToken() },
        }
    );
        return response.data;
    } catch (err) {
        console.error(err);
    }
};

const getBookingById = async (bookingId: string) => {
    try {
        const response = await axios.get<Booking>(
            `${BASE_URL}/bookings/${bookingId}`, 
            {
            headers: { Authorization: handleToken() },
        }
    );
        return response.data;
    } catch (err) {
        console.error(err);
    }
};

const saveBooking = async (booking: Partial<Booking>) => {
    try {
        const response = await axios.post(`${BASE_URL}/bookings`, booking,
             {
            headers: { Authorization: handleToken() },
        }
    );
        return response.status;
    } catch (err) {
        console.error(err);
    }
};

const updateBooking = async (booking: Booking) => {
    try {
        const response = await axios.patch(
            `${BASE_URL}/bookings/${booking.bookingId}`, booking,
             {
            headers: { Authorization: handleToken() },
        }
    );
     if(response.status !== 204){
            throw new Error ("Failed to Update Booking")
        }
        return response.status; 
    } catch (err) {
        console.error(err);
    }
};

export default { getBookings, getBookingById, saveBooking, updateBooking };
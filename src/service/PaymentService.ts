import axios from "axios";
import { Payment } from "../models/Payment";
import { BASE_URL, handleToken } from "../libs/Token";

const savePayment = async (payment: Payment) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/payments`, payment, 
            {
            headers: { Authorization: handleToken() },
        }
    );
        return response.status; 
    } catch (err) {
        console.error(err);
    }
};

const getPaymentById = async (paymentId: string) => {
    try {
        const response = await axios.get<Payment>(
            `${BASE_URL}/payments/${paymentId}`, 
            {
            headers: { Authorization: handleToken() },
        }
    );
        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export default { savePayment, getPaymentById };
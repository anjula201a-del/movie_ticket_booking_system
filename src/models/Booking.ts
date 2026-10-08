export interface Booking {
  bookingId: string;
  userId: string;
  showId: string;
  seatNumbers: string[];
  numberOfTickets: number;
  totalAmount: number;
  bookingDate: string; 
  status: string;
}
import { Booking } from "./Booking";

export interface PaymentEditProps {
  open: boolean;
  bookings: Booking[];            
  preselectedBookingId?: string;  
  onClose: () => void;
  onSave: () => void;
}
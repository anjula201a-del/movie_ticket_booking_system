import { Booking } from "./Booking";
import { Show } from "./Show";
import { User } from "./User";

export interface BookingEditProps {
  open: boolean;
  booking: Booking | null;
  shows: Show[];
  users: User[];
  onClose: () => void;
  onSave: () => void;
}
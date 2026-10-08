export interface Payment {
  paymentId?: string;
  bookingId: string;
  amount: number;
  paymenDate: string; 
  pmstatus: string;   
  status: string;     
}
export interface Station {
  id: string;
  name: string;
  address: string;
}

export interface Booking {
  id: string;
  customerName: string;
  stationId: string;
  stationName: string;
  pickupDate: string;
  returnDate: string;
  duration: number;
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  vehicleModel?: string;
}

export interface BookingDetail extends Booking {
  customerEmail?: string;
  vehicleType?: string;
  totalPrice?: number;
}

export interface CalendarDay {
  date: Date;
  bookings: Booking[];
  isToday: boolean;
  isWeekend: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

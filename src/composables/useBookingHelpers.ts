import type { Booking } from '../types';
import { isSameDay } from '../utils';

export function useBookingHelpers() {
  const getBookingTypeText = (booking: Booking, date: Date): string => {
    const pickupDate = new Date(booking.pickupDate);
    const returnDate = new Date(booking.returnDate);
    
    if (isSameDay(pickupDate, date) && isSameDay(returnDate, date)) {
      return 'Pickup & Return';
    } else if (isSameDay(pickupDate, date)) {
      return 'Pickup';
    } else if (isSameDay(returnDate, date)) {
      return 'Return';
    }
    
    return 'Ongoing';
  };

  const getBookingCardType = (booking: Booking, date: Date): 'pickup' | 'return' | 'ongoing' => {
    const pickupDate = new Date(booking.pickupDate);
    const returnDate = new Date(booking.returnDate);
    
    if (isSameDay(pickupDate, date)) {
      return 'pickup';
    } else if (isSameDay(returnDate, date)) {
      return 'return';
    }
    
    return 'ongoing';
  };

  const getStatusColorClass = (status: string): string => {
    const statusMap: Record<string, string> = {
      confirmed: 'booking-status-confirmed',
      'in-progress': 'booking-status-in-progress',
      completed: 'booking-status-completed',
      cancelled: 'booking-status-cancelled',
    };
    
    return statusMap[status] || 'booking-status-default';
  };

  return {
    getBookingTypeText,
    getBookingCardType,
    getStatusColorClass,
  };
}

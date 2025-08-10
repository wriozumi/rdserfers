import { computed } from 'vue';
import type { Booking } from '../types';
import { getWeekDays, isToday, isWeekend, format } from '../utils';
import { getBookingsForDay } from '../utils/dataUtils';

export function useCalendarWeek(currentWeek: Date, bookings: Booking[]) {
  const weekDays = computed(() => {
    const days = getWeekDays(currentWeek);
    
    return days.map(date => {
      const dayBookings = getBookingsForDay(bookings, date);

      return {
        date,
        bookings: dayBookings,
        isToday: isToday(date),
        isWeekend: isWeekend(date),
      };
    });
  });

  const weekTitle = computed(() => {
    const firstDay = weekDays.value[0]?.date;
    const lastDay = weekDays.value[6]?.date;
    
    if (!firstDay || !lastDay) return '';
    
    const firstMonth = format(firstDay, 'MMMM');
    const lastMonth = format(lastDay, 'MMMM');
    const year = firstDay.getFullYear();
    
    if (firstMonth === lastMonth) {
      return `${firstMonth} ${year}`;
    } else {
      return `${firstMonth} - ${lastMonth} ${year}`;
    }
  });

  const weekSubtitle = computed(() => {
    const firstDay = weekDays.value[0]?.date;
    const lastDay = weekDays.value[6]?.date;
    
    if (!firstDay || !lastDay) return '';
    
    return `${firstDay.getDate()} - ${lastDay.getDate()}`;
  });

  return {
    weekDays,
    weekTitle,
    weekSubtitle,
  };
}

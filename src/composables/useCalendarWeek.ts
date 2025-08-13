import { computed } from 'vue';
import type { Booking } from '../types';
import { format, getWeekDays, isToday, isWeekend } from '../utils';
import { getBookingsForDay } from '../utils/dataUtils';
import { useMemo } from './usePerformance';

export function useCalendarWeek(
  currentWeek: () => Date,
  bookings: () => Booking[]
) {
  const currentWeekRef = computed(() => currentWeek());
  const bookingsRef = computed(() => bookings());

  const weekDays = useMemo(() => {
    const days = getWeekDays(currentWeekRef.value);
    const bookingsValue = bookingsRef.value;

    return days.map(date => {
      const dayBookings = getBookingsForDay(bookingsValue, date);

      return {
        date,
        bookings: dayBookings,
        isToday: isToday(date),
        isWeekend: isWeekend(date),
      };
    });
  }, [currentWeekRef, bookingsRef]);

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

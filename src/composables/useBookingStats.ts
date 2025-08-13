import { computed } from "vue";
import type { Booking } from "../types";

export function useBookingStats(
  weekBookings: () => Booking[],
  weekRange: () => { start: Date; end: Date }
) {
  const activeBookingsCount = computed(() => {
    const now = new Date();
    const { start: weekStart, end: weekEnd } = weekRange();

    return weekBookings().filter((booking) => {
      const pickupDate = new Date(booking.pickupDate);
      const returnDate = new Date(booking.returnDate);

      const isCurrentlyActive = pickupDate <= now && returnDate >= now;
      const overlapsWithWeek = pickupDate <= weekEnd && returnDate >= weekStart;

      return isCurrentlyActive && overlapsWithWeek;
    }).length;
  });

  const occupancyRate = computed(() => {
    const bookings = weekBookings();
    if (bookings.length === 0) return 0;

    const { start: weekStart, end: weekEnd } = weekRange();
    const totalWeekDays = 7;

    const daysWithBookings = new Set<string>();

    bookings.forEach((booking) => {
      const pickupDate = new Date(booking.pickupDate);
      const returnDate = new Date(booking.returnDate);

      const overlapStart = new Date(
        Math.max(pickupDate.getTime(), weekStart.getTime())
      );
      const overlapEnd = new Date(
        Math.min(returnDate.getTime(), weekEnd.getTime())
      );

      for (
        let d = new Date(overlapStart);
        d <= overlapEnd;
        d.setDate(d.getDate() + 1)
      ) {
        const dayKey = d.toISOString().split("T")[0];
        daysWithBookings.add(dayKey);
      }
    });

    return (daysWithBookings.size / totalWeekDays) * 100;
  });

  const weeklyBookingsCount = computed(() => {
    const { start: weekStart, end: weekEnd } = weekRange();

    const filteredBookings = weekBookings().filter((booking) => {
      const pickupDate = new Date(booking.pickupDate);
      const returnDate = new Date(booking.returnDate);

      const pickupInWeek = pickupDate >= weekStart && pickupDate <= weekEnd;
      const returnInWeek = returnDate >= weekStart && returnDate <= weekEnd;
      const spansWeek = pickupDate < weekStart && returnDate > weekEnd;

      return pickupInWeek || returnInWeek || spansWeek;
    });

    return filteredBookings.length;
  });

  return {
    activeBookingsCount,
    occupancyRate,
    weeklyBookingsCount,
  };
}

import {
  cloneDeep,
  filter,
  find,
  groupBy,
  isEmpty,
  map,
  omit,
  orderBy,
  pick,
  some,
  uniqBy,
} from "lodash-es";
import type { Booking, BookingDetail, Station } from "../types";
import { isDateAfter, isDateBefore, isSameDay, parseDate } from "./index";

export const groupBookingsByDate = (
  bookings: Booking[]
): Record<string, Booking[]> => {
  return groupBy(bookings, (booking) => {
    const date = parseDate(booking.pickupDate);
    return date.toISOString().split("T")[0];
  });
};

export const getUniqueCustomers = (bookings: Booking[]): string[] => {
  return uniqBy(bookings, "customerName").map(
    (booking) => booking.customerName
  );
};

export const sortBookingsByDate = (
  bookings: Booking[],
  direction: "asc" | "desc" = "asc"
): Booking[] => {
  return orderBy(
    bookings,
    [(booking) => new Date(booking.pickupDate).getTime()],
    [direction]
  );
};

export const filterBookingsByStatus = (
  bookings: Booking[],
  statuses: Booking["status"][]
): Booking[] => {
  return filter(bookings, (booking) => statuses.includes(booking.status));
};

export const filterBookingsByDateRange = (
  bookings: Booking[],
  startDate: Date,
  endDate: Date
): Booking[] => {
  return filter(bookings, (booking) => {
    const pickupDate = parseDate(booking.pickupDate);
    const returnDate = parseDate(booking.returnDate);

    return (
      (pickupDate >= startDate && pickupDate <= endDate) ||
      (returnDate >= startDate && returnDate <= endDate) ||
      (pickupDate <= startDate && returnDate >= endDate)
    );
  });
};

export const getBookingsForDay = (
  bookings: Booking[],
  targetDate: Date
): Booking[] => {
  return filter(bookings, (booking) => {
    const pickupDate = parseDate(booking.pickupDate);
    const returnDate = parseDate(booking.returnDate);

    return (
      isSameDay(pickupDate, targetDate) ||
      isSameDay(returnDate, targetDate) ||
      (isDateBefore(pickupDate, targetDate) &&
        isDateAfter(returnDate, targetDate))
    );
  });
};

export const findBookingById = (
  bookings: Booking[],
  id: string
): Booking | undefined => {
  return find(bookings, { id });
};

export const hasActiveBookings = (
  bookings: Booking[],
  date: Date = new Date()
): boolean => {
  return some(bookings, (booking) => {
    const pickupDate = parseDate(booking.pickupDate);
    const returnDate = parseDate(booking.returnDate);

    return isDateBefore(pickupDate, date) && isDateAfter(returnDate, date);
  });
};

export const findStationById = (
  stations: Station[],
  id: string
): Station | undefined => {
  return find(stations, { id });
};

export const searchStations = (
  stations: Station[],
  query: string
): Station[] => {
  const lowercaseQuery = query.toLowerCase();
  return filter(
    stations,
    (station) =>
      station.name.toLowerCase().includes(lowercaseQuery) ||
      station.address.toLowerCase().includes(lowercaseQuery)
  );
};

export const getStationNames = (stations: Station[]): string[] => {
  return map(stations, "name");
};

export const transformBookingForDisplay = (
  booking: Booking
): Partial<Booking> => {
  return pick(booking, [
    "id",
    "customerName",
    "pickupDate",
    "returnDate",
    "status",
  ]);
};

export const excludeSensitiveBookingData = (
  booking: BookingDetail
): Omit<BookingDetail, "customerEmail"> => {
  return omit(booking, ["customerEmail"]);
};

export const cloneBooking = (booking: Booking): Booking => {
  return cloneDeep(booking);
};

export const isValidBookingData = (booking: Partial<Booking>): boolean => {
  const requiredFields = [
    "customerName",
    "pickupDate",
    "returnDate",
    "stationId",
  ];
  return requiredFields.every(
    (field) => !isEmpty(booking[field as keyof Booking])
  );
};

export const calculateBookingStats = (bookings: Booking[]) => {
  const totalBookings = bookings.length;
  const statusCounts = groupBy(bookings, "status");
  const uniqueCustomers = getUniqueCustomers(bookings).length;

  return {
    totalBookings,
    uniqueCustomers,
    confirmedBookings: statusCounts.confirmed?.length || 0,
    inProgressBookings: statusCounts["in-progress"]?.length || 0,
    completedBookings: statusCounts.completed?.length || 0,
    cancelledBookings: statusCounts.cancelled?.length || 0,
  };
};

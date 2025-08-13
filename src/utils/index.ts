import {
  addWeeks as dateFnsAddWeeks,
  isSameDay as dateFnsIsSameDay,
  isToday as dateFnsIsToday,
  isWeekend as dateFnsIsWeekend,
  differenceInDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isEqual,
  parseISO,
  startOfWeek,
} from "date-fns";
import { debounce as lodashDebounce } from "lodash-es";

export { format };

export const formatDate = (date: Date): string => {
  return format(date, "EEE, MMM d");
};

export const formatDateLong = (date: Date): string => {
  return format(date, "EEEE, MMMM d, yyyy");
};

export const formatDateISO = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

export const formatDateTime = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm");
};

export const formatTime = (date: Date): string => {
  return format(date, "HH:mm");
};

export const parseDate = (dateString: string): Date => {
  return dateString.includes("T") ? parseISO(dateString) : new Date(dateString);
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return dateFnsIsSameDay(date1, date2);
};

export const isToday = (date: Date): boolean => {
  return dateFnsIsToday(date);
};

export const isWeekend = (date: Date): boolean => {
  return dateFnsIsWeekend(date);
};

export const isDateAfter = (date: Date, dateToCompare: Date): boolean => {
  return isAfter(date, dateToCompare);
};

export const isDateBefore = (date: Date, dateToCompare: Date): boolean => {
  return isBefore(date, dateToCompare);
};

export const isDateEqual = (date: Date, dateToCompare: Date): boolean => {
  return isEqual(date, dateToCompare);
};

export const getWeekDays = (startDate: Date): Date[] => {
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(startDate, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: weekStart, end: weekEnd });
};

export const getWeekRange = (date: Date): { start: Date; end: Date } => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });

  return { start, end };
};

export const addWeeks = (date: Date, weeks: number): Date => {
  return dateFnsAddWeeks(date, weeks);
};

export const calculateDuration = (
  startDate: string,
  endDate: string
): number => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  return Math.max(1, differenceInDays(end, start) + 1);
};

export const debounce = lodashDebounce;

export const formatDateRange = (start: Date, end: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: start.getFullYear() !== end.getFullYear() ? "numeric" : undefined,
  };

  const startStr = start.toLocaleDateString("en-US", options);
  const endStr = end.toLocaleDateString("en-US", options);

  return `${startStr} - ${endStr}`;
};

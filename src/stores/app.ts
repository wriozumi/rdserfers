import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { apiService } from "../services/api";
import type { Booking, BookingDetail, Station } from "../types";
import { addWeeks, calculateDuration, getWeekRange, parseDate } from "../utils";

export const useAppStore = defineStore("app", () => {
  const selectedStation = ref<Station | null>(null);
  const currentWeek = ref<Date>(new Date());
  const bookings = ref<Booking[]>([]);
  const selectedBooking = ref<BookingDetail | null>(null);
  const loading = ref(false);
  const searchLoading = ref(false);
  const error = ref<string | null>(null);
  const retryCount = ref(0);
  const maxRetries = 3;

  const weekRange = computed(() => getWeekRange(currentWeek.value));

  const weekBookings = computed(() => {
    if (!selectedStation.value) return [];
    return bookings.value;
  });

  const hasData = computed(() => bookings.value.length > 0);
  const isEmpty = computed(
    () => !loading.value && !hasData.value && selectedStation.value
  );

  const setSelectedStation = async (station: Station | null) => {
    selectedStation.value = station;
    if (station) {
      await loadBookings();
    } else {
      bookings.value = [];
      clearError();
    }
  };

  const setCurrentWeek = async (date: Date) => {
    currentWeek.value = date;
    if (selectedStation.value) {
      await loadBookings();
    }
  };

  const navigateWeek = async (direction: "prev" | "next") => {
    const weeks = direction === "next" ? 1 : -1;
    currentWeek.value = addWeeks(currentWeek.value, weeks);
    if (selectedStation.value) {
      await loadBookings();
    }
  };

  const loadBookings = async (retry = false) => {
    if (!selectedStation.value) return;

    if (!retry) {
      retryCount.value = 0;
    }

    loading.value = true;
    error.value = null;

    try {
      const { start, end } = weekRange.value;
      bookings.value = await apiService.getBookingsForStation(
        selectedStation.value.id,
        start,
        end
      );
      retryCount.value = 0;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load bookings";

      if (retryCount.value < maxRetries) {
        retryCount.value++;
        console.warn(
          `Retrying booking load (${retryCount.value}/${maxRetries}):`,
          errorMessage
        );
        setTimeout(() => loadBookings(true), 1000 * retryCount.value);
      } else {
        error.value = `${errorMessage}. Please try again or contact support.`;
        console.error("Max retries exceeded for loading bookings:", err);
      }
    } finally {
      loading.value = false;
    }
  };

  const loadBookingDetail = async (bookingId: string) => {
    if (!bookingId || bookingId.trim() === "") {
      error.value = "Invalid booking ID provided";
      console.error("❌ Invalid booking ID provided");
      return;
    }

    loading.value = true;
    error.value = null;
    selectedBooking.value = null;

    try {
      const bookingDetail = await apiService.getBookingDetail(bookingId);

      if (!bookingDetail) {
        error.value =
          "Booking not found. It may have been deleted or you may not have permission to view it.";
        console.warn("⚠️ Booking not found for ID:", bookingId);
        selectedBooking.value = null;
      } else {
        selectedBooking.value = bookingDetail;
        console.log("✅ Successfully loaded booking detail:", bookingDetail);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load booking details";
      error.value = errorMessage;
      selectedBooking.value = null;
      console.error("❌ Error loading booking detail:", err);
    } finally {
      loading.value = false;
    }
  };

  const rescheduleBooking = async (
    bookingId: string,
    newPickupDate: string,
    newReturnDate: string
  ): Promise<boolean> => {
    if (!bookingId || !newPickupDate || !newReturnDate) {
      error.value = "All fields are required for rescheduling";
      return false;
    }

    const pickup = parseDate(newPickupDate);
    const returnDate = parseDate(newReturnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (pickup < today) {
      error.value = "Pickup date cannot be in the past";
      return false;
    }

    if (returnDate <= pickup) {
      error.value = "Return date must be after pickup date";
      return false;
    }

    const duration = calculateDuration(newPickupDate, newReturnDate);
    if (duration > 365) {
      error.value = "Booking duration cannot exceed 365 days";
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      const success = await apiService.rescheduleBooking(
        bookingId,
        newPickupDate,
        newReturnDate
      );

      if (success) {
        const bookingIndex = bookings.value.findIndex(
          (b: Booking) => b.id === bookingId
        );
        if (bookingIndex !== -1) {
          bookings.value[bookingIndex] = {
            ...bookings.value[bookingIndex],
            pickupDate: newPickupDate,
            returnDate: newReturnDate,
          };
        }

        if (selectedBooking.value?.id === bookingId) {
          selectedBooking.value = {
            ...selectedBooking.value,
            pickupDate: newPickupDate,
            returnDate: newReturnDate,
          };
        }
      } else {
        error.value =
          "Failed to reschedule booking. The dates may not be available.";
      }

      return success;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to reschedule booking";
      console.error("Error rescheduling booking:", err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const setSearchLoading = (isLoading: boolean) => {
    searchLoading.value = isLoading;
  };

  const clearError = () => {
    error.value = null;
  };

  const clearSelectedBooking = () => {
    selectedBooking.value = null;
    error.value = null;
    loading.value = false;
    console.log("🧹 Cleared selected booking state");
  };

  const refreshData = async () => {
    if (selectedStation.value) {
      await loadBookings();
    }
  };

  return {
    selectedStation,
    currentWeek,
    bookings,
    selectedBooking,
    loading,
    searchLoading,
    error,

    weekRange,
    weekBookings,
    hasData,
    isEmpty,

    setSelectedStation,
    setCurrentWeek,
    navigateWeek,
    loadBookings,
    loadBookingDetail,
    rescheduleBooking,
    setSearchLoading,
    clearError,
    clearSelectedBooking,
    refreshData,
  };
});

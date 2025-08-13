import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../stores/app";

export function useBookingDetail(bookingId: string) {
  const router = useRouter();
  const store = useAppStore();

  const rescheduleLoading = ref(false);
  const rescheduleSuccess = ref(false);
  const rescheduleError = ref<string | null>(null);

  const booking = computed(() => store.selectedBooking);
  const loading = computed(() => store.loading);
  const error = computed(() => store.error);

  const canReschedule = computed(() => {
    return (
      booking.value &&
      ["confirmed", "in-progress"].includes(booking.value.status)
    );
  });

  const loadBooking = async () => {
    if (!bookingId || bookingId.trim() === "") {
      console.error("Invalid booking ID provided");
      router.push("/");
      return;
    }

    console.log("🔄 Loading booking detail for ID:", bookingId);
    await store.loadBookingDetail(bookingId);
  };

  const goBack = () => {
    store.clearSelectedBooking();
    router.push("/");
  };

  const handleReschedule = async (data: {
    pickupDate: string;
    returnDate: string;
  }) => {
    if (!booking.value) {
      rescheduleError.value = "No booking selected";
      return;
    }

    rescheduleLoading.value = true;
    rescheduleError.value = null;

    try {
      const success = await store.rescheduleBooking(
        booking.value.id,
        data.pickupDate,
        data.returnDate
      );

      if (success) {
        rescheduleSuccess.value = true;
        setTimeout(() => {
          rescheduleSuccess.value = false;
        }, 5000);
      }
    } catch (err) {
      rescheduleError.value =
        err instanceof Error ? err.message : "Failed to reschedule booking";
    } finally {
      rescheduleLoading.value = false;
    }
  };

  const resetReschedule = () => {
    rescheduleError.value = null;
    rescheduleSuccess.value = false;
  };

  const clearError = () => {
    rescheduleError.value = null;
  };

  return {
    rescheduleLoading,
    rescheduleSuccess,
    rescheduleError,

    booking,
    loading,
    error,
    canReschedule,

    loadBooking,
    goBack,
    handleReschedule,
    resetReschedule,
    clearError,
  };
}

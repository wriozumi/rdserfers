import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../stores/app';

export function useBookingDetail(bookingId: string) {
  const router = useRouter();
  const store = useAppStore();

  const booking = computed(() => store.selectedBooking);
  const loading = computed(() => store.loading);
  const error = computed(() => store.error);

  const loadBooking = async () => {
    if (!bookingId || bookingId.trim() === '') {
      console.error('Invalid booking ID provided');
      router.push('/');
      return;
    }

    console.log('🔄 Loading booking detail for ID:', bookingId);
    await store.loadBookingDetail(bookingId);
  };

  const goBack = () => {
    store.clearSelectedBooking();
    router.push('/');
  };

  const clearError = () => {
    store.clearError();
  };

  return {
    booking,
    loading,
    error,
    loadBooking,
    goBack,
    clearError,
  };
}

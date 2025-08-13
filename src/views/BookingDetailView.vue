<template>
  <div class="min-h-screen bg-gray-50">
    <BookingDetailHeader
      title="Booking Details"
      :booking-id="bookingId"
      @back="goBack"
    />

    <main class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div v-if="loading" class="text-center py-12">
        <LoadingSpinner size="lg" text="Loading booking details..." />
      </div>

      <div v-else-if="booking" class="space-y-6">
        <CustomerInfoSection :booking="booking" />

        <BookingInfoSection :booking="booking" />

        <div class="flex justify-center">
          <button
            type="button"
            class="px-6 py-3 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            @click="goBack"
          >
            Back to Calendar
          </button>
        </div>
      </div>

      <EmptyState
        v-else
        title="Booking not found"
        description="The booking you're looking for doesn't exist or has been removed."
      >
        <template #action>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            @click="goBack"
          >
            Go back to calendar
          </button>
        </template>
      </EmptyState>
    </main>

    <ErrorAlert
      :show="!!error"
      :title="'Error'"
      :message="error || ''"
      @dismiss="clearError"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import ErrorAlert from "../components/ErrorAlert.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import BookingDetailHeader from "../components/booking/BookingDetailHeader.vue";
import BookingInfoSection from "../components/booking/BookingInfoSection.vue";
import CustomerInfoSection from "../components/booking/CustomerInfoSection.vue";
import EmptyState from "../components/common/EmptyState.vue";
import { useBookingDetail } from "../composables/useBookingDetail";

interface Props {
  id: string;
}

const props = defineProps<Props>();
const route = useRoute();

const bookingId = computed(() => props.id || (route.params.id as string));

const { booking, loading, error, loadBooking, goBack, clearError } =
  useBookingDetail(bookingId.value);

const loadBookingData = async () => {
  const currentBookingId = bookingId.value;
  if (currentBookingId && currentBookingId.trim() !== "") {
    console.log(
      "🔄 BookingDetailView: Loading booking for ID:",
      currentBookingId
    );
    await loadBooking();
  } else {
    console.error(
      "❌ BookingDetailView: Invalid booking ID:",
      currentBookingId
    );
    goBack();
  }
};

watch(
  bookingId,
  (newId, oldId) => {
    if (newId !== oldId && newId) {
      console.log(
        "🔄 BookingDetailView: Booking ID changed from",
        oldId,
        "to",
        newId
      );
      loadBookingData();
    }
  },
  { immediate: false }
);

onMounted(() => {
  console.log(
    "🎯 BookingDetailView: Component mounted with booking ID:",
    bookingId.value
  );
  loadBookingData();
});
</script>

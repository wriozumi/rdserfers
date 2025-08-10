<template>
  <BookingDetailSection title="Reschedule Booking">
    <p class="text-sm text-gray-600 mb-4">
      Drag and drop functionality would be implemented here for rescheduling
      pickup/return dates.
    </p>

    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            for="new-pickup-date"
            class="block text-sm font-medium text-gray-700"
          >
            New Pickup Date
          </label>
          <input
            id="new-pickup-date"
            v-model="localPickupDate"
            type="datetime-local"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            for="new-return-date"
            class="block text-sm font-medium text-gray-700"
          >
            New Return Date
          </label>
          <input
            id="new-return-date"
            v-model="localReturnDate"
            type="datetime-local"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          />
        </div>
      </div>

      <div
        v-if="error"
        class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
      >
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <div class="mt-4 flex justify-end space-x-3">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          @click="handleReset"
        >
          Reset
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!isValid || loading"
        >
          <span v-if="loading" class="inline-flex items-center">
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Rescheduling...
          </span>
          <span v-else>Reschedule Booking</span>
        </button>
      </div>
    </form>
  </BookingDetailSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { BookingDetail } from "../../types";
import { formatDateTime } from "../../utils";
import BookingDetailSection from "./BookingDetailSection.vue";

interface Props {
  booking: BookingDetail;
  loading?: boolean;
  error?: string | null;
}

interface Emits {
  (e: "submit", data: { pickupDate: string; returnDate: string }): void;
  (e: "reset"): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
});

const emit = defineEmits<Emits>();

const localPickupDate = ref("");
const localReturnDate = ref("");

const isValid = computed(() => {
  if (!localPickupDate.value || !localReturnDate.value) return false;

  const pickup = new Date(localPickupDate.value);
  const returnDate = new Date(localReturnDate.value);
  const now = new Date();

  return pickup >= now && returnDate > pickup;
});

const initializeDates = () => {
  if (props.booking) {
    const pickup = new Date(props.booking.pickupDate);
    const returnDate = new Date(props.booking.returnDate);

    localPickupDate.value = formatDateTime(pickup);
    localReturnDate.value = formatDateTime(returnDate);
  }
};

const handleSubmit = () => {
  if (!isValid.value) return;

  emit("submit", {
    pickupDate: localPickupDate.value,
    returnDate: localReturnDate.value,
  });
};

const handleReset = () => {
  initializeDates();
  emit("reset");
};

watch(() => props.booking, initializeDates, { immediate: true });
</script>

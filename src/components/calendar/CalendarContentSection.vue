<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6"
  >
    <div class="p-4 sm:p-6 border-b border-gray-200">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h3 class="text-base sm:text-lg font-medium text-gray-900">
          <span class="hidden sm:inline">Week of </span>{{ weekTitle }}
        </h3>

        <div class="flex items-center space-x-1 sm:space-x-2">
          <button
            @click="$emit('navigate', 'prev')"
            :disabled="loading"
            class="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Previous week"
          >
            <svg
              class="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            @click="$emit('goToToday')"
            :disabled="loading"
            class="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            Today
          </button>

          <button
            @click="$emit('navigate', 'next')"
            :disabled="loading"
            class="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Next week"
          >
            <svg
              class="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="relative">
      <div v-if="isEmpty" class="p-8 text-center">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          No bookings found
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          There are no bookings for this station during this week.
        </p>
        <div class="mt-6">
          <button
            @click="$emit('refresh')"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg
              class="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <CalendarWeekView
        v-else
        :bookings="bookings"
        :current-week="currentWeek"
        :loading="loading"
        @navigate="$emit('navigate', $event)"
        @select-booking="$emit('selectBooking', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Booking } from "../../types";
import CalendarWeekView from "../CalendarWeekView.vue";

interface Props {
  bookings: Booking[];
  currentWeek: Date;
  weekTitle: string;
  loading?: boolean;
  isEmpty?: boolean;
}

interface Emits {
  (e: "navigate", direction: "prev" | "next"): void;
  (e: "goToToday"): void;
  (e: "refresh"): void;
  (e: "selectBooking", booking: Booking): void;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  isEmpty: false,
});

defineEmits<Emits>();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14 sm:h-16">
          <div class="flex items-center space-x-2 sm:space-x-4">
            <h1 class="text-lg sm:text-2xl font-bold text-gray-900">
              RoadSurfer Dashboard
            </h1>
          </div>

          <div v-if="error && !loading" class="flex items-center space-x-2">
            <button
              @click="refreshData"
              class="inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              :disabled="loading"
            >
              <svg
                class="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"
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
              <span class="hidden sm:inline">Retry</span>
              <span class="sm:hidden">Retry</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div
        v-if="error && !loading"
        class="mb-6 bg-red-50 border border-red-200 rounded-md p-4"
        role="alert"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error Loading Data</h3>
            <div class="mt-2 text-sm text-red-700">
              {{ error }}
            </div>
            <div class="mt-3">
              <button
                @click="refreshData"
                class="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                :disabled="loading"
              >
                {{ loading ? "Retrying..." : "Try Again" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div class="flex-1">
            <h2 class="text-base sm:text-lg font-medium text-gray-900">
              Station Bookings
            </h2>
            <p class="mt-1 text-xs sm:text-sm text-gray-500">
              Search for a station to view its booking calendar
            </p>
          </div>

          <div class="w-full sm:w-80 lg:w-96">
            <AutocompleteInput
              ref="autocompleteRef"
              :model-value="selectedStation"
              placeholder="Search stations by name or location..."
              :loading="searchLoading"
              :error="searchError || undefined"
              :disabled="loading"
              @update:model-value="handleStationUpdate"
              @search="handleStationSearch"
              @select="handleStationSelect"
            />
          </div>
        </div>
      </div>

      <div v-if="selectedStation" class="space-y-6">
        <div
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
        >
          <div class="flex items-start sm:items-center justify-between gap-3">
            <div class="flex-1 min-w-0">
              <h3
                class="text-base sm:text-lg font-medium text-gray-900 truncate"
              >
                {{ selectedStation.name }}
              </h3>
              <p
                class="mt-1 text-xs sm:text-sm text-gray-500 line-clamp-2 sm:line-clamp-1"
              >
                {{ selectedStation.address }}
              </p>
            </div>
            <button
              @click="clearStation"
              class="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Clear selected station"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-sm sm:text-lg font-medium text-gray-900">
                <span class="hidden sm:inline">Week of </span
                >{{ formatDateRange(weekRange.start, weekRange.end) }}
              </h3>
              <div class="flex items-center space-x-1 sm:space-x-2">
                <button
                  @click="navigateWeek('prev')"
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
                  @click="goToCurrentWeek"
                  :disabled="loading"
                  class="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  Today
                </button>
                <button
                  @click="navigateWeek('next')"
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

          <div v-if="loading" class="p-8 flex items-center justify-center">
            <LoadingSpinner class="w-8 h-8" />
            <span class="ml-3 text-gray-600">Loading bookings...</span>
          </div>

          <div v-else-if="isEmpty" class="p-8 text-center">
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
                @click="refreshData"
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
            :bookings="weekBookings"
            :current-week="weekRange.start"
            :loading="loading"
            @navigate="navigateWeek"
            @select-booking="handleBookingClick"
          />
        </div>

        <div
          v-if="hasData"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
        >
          <h3
            class="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4"
          >
            Week Summary
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div class="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
              <div class="text-xl sm:text-2xl font-bold text-blue-600">
                {{ weeklyBookingsCount }}
              </div>
              <div class="text-xs sm:text-sm text-gray-600">Total Bookings</div>
              <div class="text-xs text-gray-500 mt-1">This Week</div>
            </div>
            <div class="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
              <div class="text-xl sm:text-2xl font-bold text-green-600">
                {{ activeBookingsCount }}
              </div>
              <div class="text-xs sm:text-sm text-gray-600">Active Now</div>
              <div class="text-xs text-gray-500 mt-1">Currently Ongoing</div>
            </div>
            <div class="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
              <div class="text-xl sm:text-2xl font-bold text-purple-600">
                {{ Math.round(occupancyRate) }}%
              </div>
              <div class="text-xs sm:text-sm text-gray-600">Week Occupancy</div>
              <div class="text-xs text-gray-500 mt-1">Days with Bookings</div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center"
      >
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          Welcome to RoadSurfer Dashboard
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by searching for a station above to view its booking
          calendar.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../stores/app";
import { apiService } from "../services/api";
import type { Station, Booking } from "../types";
import AutocompleteInput from "../components/AutocompleteInput.vue";
import CalendarWeekView from "../components/CalendarWeekView.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";

const router = useRouter();
const store = useAppStore();

const autocompleteRef = ref<InstanceType<typeof AutocompleteInput>>();
const searchError = ref<string | null>(null);

const selectedStation = computed({
  get: () => store.selectedStation,
  set: (station: Station | null) => store.setSelectedStation(station),
});

const weekRange = computed(() => store.weekRange);
const weekBookings = computed(() => store.weekBookings);
const loading = computed(() => store.loading);
const searchLoading = computed(() => store.searchLoading);
const error = computed(() => store.error);
const hasData = computed(() => store.hasData);
const isEmpty = computed(() => store.isEmpty);

const activeBookingsCount = computed(() => {
  const now = new Date();
  const weekStart = weekRange.value.start;
  const weekEnd = weekRange.value.end;

  return weekBookings.value.filter((booking) => {
    const pickupDate = new Date(booking.pickupDate);
    const returnDate = new Date(booking.returnDate);

    const isCurrentlyActive = pickupDate <= now && returnDate >= now;
    const overlapsWithWeek = pickupDate <= weekEnd && returnDate >= weekStart;

    return isCurrentlyActive && overlapsWithWeek;
  }).length;
});

const occupancyRate = computed(() => {
  if (weekBookings.value.length === 0) return 0;

  const weekStart = weekRange.value.start;
  const weekEnd = weekRange.value.end;
  const totalWeekDays = 7;

  const daysWithBookings = new Set<string>();

  weekBookings.value.forEach((booking) => {
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
  const weekStart = weekRange.value.start;
  const weekEnd = weekRange.value.end;

  const filteredBookings = weekBookings.value.filter((booking) => {
    const pickupDate = new Date(booking.pickupDate);
    const returnDate = new Date(booking.returnDate);

    const pickupInWeek = pickupDate >= weekStart && pickupDate <= weekEnd;
    const returnInWeek = returnDate >= weekStart && returnDate <= weekEnd;
    const spansWeek = pickupDate < weekStart && returnDate > weekEnd;

    return pickupInWeek || returnInWeek || spansWeek;
  });

  return filteredBookings.length;
});

const handleStationUpdate = (station: Station | null) => {
  selectedStation.value = station;
};

const handleStationSearch = async (query: string) => {
  searchError.value = null;
  store.setSearchLoading(true);

  try {
    const stations = await apiService.searchStations(query);
    autocompleteRef.value?.updateSuggestions(stations);
  } catch (err) {
    searchError.value =
      err instanceof Error ? err.message : "Failed to search stations";
    console.error("❌ Error searching stations:", err);
    autocompleteRef.value?.updateSuggestions([]);
  } finally {
    store.setSearchLoading(false);
  }
};

const handleStationSelect = (station: Station) => {
  searchError.value = null;
  store.setSelectedStation(station);
};

const clearStation = () => {
  selectedStation.value = null;
  searchError.value = null;
};

const navigateWeek = (direction: "prev" | "next") => {
  store.navigateWeek(direction);
};

const goToCurrentWeek = () => {
  store.setCurrentWeek(new Date());
};

const refreshData = () => {
  store.clearError();
  store.refreshData();
};

const handleBookingClick = (booking: Booking) => {
  if (!booking || !booking.id || booking.id.trim() === "") {
    console.warn("Invalid booking provided for navigation");
    return;
  }

  router.push(`/booking/${booking.id}`);
};

const formatDateRange = (start: Date, end: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: start.getFullYear() !== end.getFullYear() ? "numeric" : undefined,
  };

  const startStr = start.toLocaleDateString("en-US", options);
  const endStr = end.toLocaleDateString("en-US", options);

  return `${startStr} - ${endStr}`;
};

onMounted(() => {
  setTimeout(() => {
    autocompleteRef.value?.focus();
  }, 100);
});
</script>

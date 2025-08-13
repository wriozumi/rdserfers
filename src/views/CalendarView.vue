<template>
  <div class="min-h-screen bg-gray-50">
    <DashboardHeader title="RoadSurfer Dashboard">
      <template #actions>
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
      </template>
    </DashboardHeader>

    <div class="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <GlobalErrorAlert
        :show="!!(error && !loading)"
        :message="error || ''"
        :retrying="loading"
        @retry="refreshData"
      />

      <StationSearchSection
        ref="stationSearchRef"
        :selected-station="selectedStation"
        :error="searchError || undefined"
        :loading="loading"
        :search-loading="searchLoading"
        @update:selected-station="handleStationUpdate"
        @search="handleStationSearch"
        @select="handleStationSelect"
        @clear="clearStation"
      />

      <div v-if="selectedStation" class="space-y-6">
        <SelectedStationCard :station="selectedStation" @clear="clearStation" />

        <CalendarContainer
          :week-range="weekRange"
          :week-bookings="weekBookings"
          :week-title="weekTitle"
          :loading="loading"
          :is-empty="!!isEmpty"
          @navigate="navigateWeek"
          @go-to-current-week="goToCurrentWeek"
          @refresh="refreshData"
          @select-booking="handleBookingClick"
        />

        <BookingStatsSection
          v-if="hasData"
          :weekly-bookings-count="weeklyBookingsCount"
          :active-bookings-count="activeBookingsCount"
          :occupancy-rate="occupancyRate"
        />
      </div>

      <WelcomeState v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useBookingStats } from "../composables/useBookingStats";
import { apiService } from "../services/api";
import { useAppStore } from "../stores/app";
import type { Booking, Station } from "../types";
import { formatDateRange } from "../utils";

import BookingStatsSection from "../components/calendar/BookingStatsSection.vue";
import CalendarContainer from "../components/calendar/CalendarContainer.vue";
import SelectedStationCard from "../components/calendar/SelectedStationCard.vue";
import StationSearchSection from "../components/calendar/StationSearchSection.vue";
import WelcomeState from "../components/calendar/WelcomeState.vue";
import GlobalErrorAlert from "../components/common/GlobalErrorAlert.vue";
import DashboardHeader from "../components/layout/DashboardHeader.vue";

const router = useRouter();
const store = useAppStore();

const stationSearchRef = ref<InstanceType<typeof StationSearchSection>>();
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

const { activeBookingsCount, occupancyRate, weeklyBookingsCount } =
  useBookingStats(
    () => weekBookings.value,
    () => weekRange.value
  );

const weekTitle = computed(() =>
  formatDateRange(weekRange.value.start, weekRange.value.end)
);

const handleStationUpdate = (station: Station | null) => {
  selectedStation.value = station;
};

const handleStationSearch = async (query: string) => {
  searchError.value = null;
  store.setSearchLoading(true);

  try {
    const stations = await apiService.searchStations(query);
    stationSearchRef.value?.updateSuggestions(stations);
  } catch (err) {
    searchError.value =
      err instanceof Error ? err.message : "Failed to search stations";
    console.error("❌ Error searching stations:", err);
    stationSearchRef.value?.updateSuggestions([]);
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

onMounted(() => {
  setTimeout(() => {
    stationSearchRef.value?.focus();
  }, 100);
});
</script>

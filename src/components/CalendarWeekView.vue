<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 relative">
    <CalendarHeader
      :week-title="weekTitle"
      :week-subtitle="weekSubtitle"
      @navigate="$emit('navigate', $event)"
    />

    <div class="lg:hidden">
      <div
        class="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        <DayColumn
          v-for="day in weekDays"
          :key="day.date.toISOString()"
          :day="day"
          is-mobile
          @select-booking="$emit('selectBooking', $event)"
        />
      </div>

      <div class="p-2 text-center bg-gray-50 border-t border-gray-200">
        <p class="text-xs text-gray-500">← Swipe to view more days →</p>
      </div>
    </div>

    <div class="hidden lg:block">
      <div class="grid grid-cols-7 divide-x divide-gray-200">
        <DayColumn
          v-for="day in weekDays"
          :key="`desktop-${day.date.toISOString()}`"
          :day="day"
          @select-booking="$emit('selectBooking', $event)"
        />
      </div>
    </div>

    <div
      v-if="loading"
      class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg"
    >
      <SkeletonLoader type="calendar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCalendarWeek } from "../composables/useCalendarWeek";
import type { Booking } from "../types";
import SkeletonLoader from "./common/SkeletonLoader.vue";
import CalendarHeader from "./calendar/CalendarHeader.vue";
import DayColumn from "./calendar/DayColumn.vue";

interface Props {
  currentWeek: Date;
  bookings: Booking[];
  loading?: boolean;
}

interface Emits {
  (e: "navigate", direction: "prev" | "next"): void;
  (e: "selectBooking", booking: Booking): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

defineEmits<Emits>();

const { weekDays, weekTitle, weekSubtitle } = useCalendarWeek(
  () => props.currentWeek,
  () => props.bookings
);
</script>

<template>
  <CalendarContentSection
    :bookings="weekBookings"
    :current-week="weekRange.start"
    :week-title="weekTitle"
    :loading="loading"
    :is-empty="isEmpty"
    @navigate="$emit('navigate', $event)"
    @go-to-today="$emit('goToCurrentWeek')"
    @refresh="$emit('refresh')"
    @select-booking="$emit('selectBooking', $event)"
  />
</template>

<script setup lang="ts">
import type { Booking } from "../../types";
import CalendarContentSection from "./CalendarContentSection.vue";

interface Props {
  weekRange: { start: Date; end: Date };
  weekBookings: Booking[];
  weekTitle: string;
  loading: boolean;
  isEmpty: boolean;
}

interface Emits {
  (e: "navigate", direction: "prev" | "next"): void;
  (e: "goToCurrentWeek"): void;
  (e: "selectBooking", booking: Booking): void;
  (e: "refresh"): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

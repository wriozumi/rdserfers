<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
    <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
      Week Summary
    </h3>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <StatCard
        :value="weeklyBookingsCount"
        title="Total Bookings"
        subtitle="This Week"
        color="blue"
      />

      <StatCard
        :value="activeBookingsCount"
        title="Active Now"
        subtitle="Currently Ongoing"
        color="green"
      />

      <StatCard
        :value="`${Math.round(occupancyRate)}%`"
        title="Week Occupancy"
        subtitle="Days with Bookings"
        color="purple"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatCard from "./StatCard.vue";

interface Props {
  weeklyBookingsCount: number;
  activeBookingsCount: number;
  occupancyRate: number;
}

defineProps<Props>();
</script>

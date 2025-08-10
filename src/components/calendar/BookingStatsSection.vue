<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
    <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Week Summary</h3>
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
interface Props {
  weeklyBookingsCount: number;
  activeBookingsCount: number;
  occupancyRate: number;
}

defineProps<Props>();

// Simple StatCard component inline to avoid over-engineering
</script>

<script lang="ts">
import { defineComponent } from 'vue';

const StatCard = defineComponent({
  props: {
    value: [String, Number],
    title: String,
    subtitle: String,
    color: {
      type: String,
      default: 'blue',
      validator: (value: string) => ['blue', 'green', 'purple', 'red'].includes(value)
    }
  },
  computed: {
    cardClasses() {
      const colorMap = {
        blue: 'bg-blue-50',
        green: 'bg-green-50', 
        purple: 'bg-purple-50',
        red: 'bg-red-50'
      };
      return `text-center p-3 sm:p-4 rounded-lg ${colorMap[this.color as keyof typeof colorMap]}`;
    },
    valueClasses() {
      const colorMap = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        purple: 'text-purple-600', 
        red: 'text-red-600'
      };
      return `text-xl sm:text-2xl font-bold ${colorMap[this.color as keyof typeof colorMap]}`;
    }
  },
  template: `
    <div :class="cardClasses">
      <div :class="valueClasses">{{ value }}</div>
      <div class="text-xs sm:text-sm text-gray-600">{{ title }}</div>
      <div class="text-xs text-gray-500 mt-1">{{ subtitle }}</div>
    </div>
  `
});

export default {
  components: {
    StatCard
  }
};
</script>

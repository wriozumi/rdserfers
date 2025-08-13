<template>
  <div :class="containerClasses">
    <div :class="contentClasses">
      <div :class="headerClasses">
        <div class="flex items-center justify-between">
          <div>
            <p :class="dayNameClasses">
              {{ formatDayName(day.date) }}
            </p>
            <p :class="dayNumberClasses">
              {{ day.date.getDate() }}
            </p>
          </div>
          <div v-if="day.bookings.length > 0" :class="badgeClasses">
            {{ day.bookings.length }}
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <BookingCard
          v-for="booking in day.bookings"
          :key="booking.id"
          :booking="booking"
          :date="day.date"
          :is-mobile="isMobile"
          @select="$emit('selectBooking', booking)"
        />
      </div>

      <div v-if="day.bookings.length === 0" :class="emptyStateClasses">
        <div class="text-center">
          <CalendarIcon />
          <p class="text-xs">No bookings</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Booking } from '../../types';
import CalendarIcon from '../icons/CalendarIcon.vue';
import BookingCard from './BookingCard.vue';

interface Props {
  day: {
    date: Date;
    bookings: Booking[];
    isToday: boolean;
    isWeekend: boolean;
  };
  isMobile?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isMobile: false,
});

defineEmits<{
  selectBooking: [booking: Booking];
}>();

const formatDayName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const containerClasses = computed(() => {
  const baseClasses = props.isMobile
    ? 'flex-none w-72 sm:w-80 border-r border-gray-200 last:border-r-0'
    : 'min-h-[400px] p-3 lg:p-4 xl:p-5';

  let bgClasses = '';
  if (props.day.isToday) {
    bgClasses = 'bg-blue-50';
  } else if (props.day.isWeekend && !props.day.isToday) {
    bgClasses = 'bg-gray-50';
  }

  return `${baseClasses} ${bgClasses}`;
});

const contentClasses = computed(() =>
  props.isMobile ? 'p-3 h-full min-h-[400px]' : ''
);

const headerClasses = computed(() =>
  props.isMobile ? 'mb-3 pb-2 border-b border-gray-200' : 'mb-3'
);

const dayNameClasses = computed(() => 'text-sm font-medium text-gray-900');

const dayNumberClasses = computed(() => {
  const baseClasses = 'font-semibold';
  const sizeClasses = props.isMobile ? 'text-lg' : 'text-xl';
  const colorClasses = props.day.isToday ? 'text-blue-600' : 'text-gray-900';

  return `${baseClasses} ${sizeClasses} ${colorClasses}`;
});

const badgeClasses = computed(() => {
  const baseClasses =
    'flex items-center justify-center text-xs font-medium text-white bg-primary-500 rounded-full';
  const sizeClasses = props.isMobile ? 'w-5 h-5' : 'w-6 h-6';

  return `${baseClasses} ${sizeClasses}`;
});

const emptyStateClasses = computed(
  () => 'flex items-center justify-center h-32 text-gray-400'
);
</script>

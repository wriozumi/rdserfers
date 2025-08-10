<template>
  <BookingDetailSection title="Booking Information">
    <template #action>
      <BookingStatusBadge :status="booking.status" />
    </template>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700">Pickup Date</label>
        <p class="mt-1 text-sm text-gray-900">{{ formatDateLong(parseDate(booking.pickupDate)) }}</p>
        <p class="text-xs text-gray-500">{{ formatTimeFromString(booking.pickupDate) }}</p>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">Return Date</label>
        <p class="mt-1 text-sm text-gray-900">{{ formatDateLong(parseDate(booking.returnDate)) }}</p>
        <p class="text-xs text-gray-500">{{ formatTimeFromString(booking.returnDate) }}</p>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">Duration</label>
        <p class="mt-1 text-sm text-gray-900">{{ booking.duration }} days</p>
      </div>
      
      <div class="md:col-span-2 lg:col-span-1">
        <label class="block text-sm font-medium text-gray-700">Station</label>
        <p class="mt-1 text-sm text-gray-900">{{ booking.stationName }}</p>
      </div>
      
      <div v-if="booking.vehicleType">
        <label class="block text-sm font-medium text-gray-700">Vehicle Type</label>
        <p class="mt-1 text-sm text-gray-900">{{ booking.vehicleType }}</p>
      </div>
      
      <div v-if="booking.totalPrice">
        <label class="block text-sm font-medium text-gray-700">Total Price</label>
        <p class="mt-1 text-sm text-gray-900">€{{ booking.totalPrice.toFixed(2) }}</p>
      </div>
    </div>
  </BookingDetailSection>
</template>

<script setup lang="ts">
import type { BookingDetail } from '../../types';
import { formatDateLong, parseDate, formatTime } from '../../utils';
import BookingDetailSection from './BookingDetailSection.vue';
import BookingStatusBadge from './BookingStatusBadge.vue';

interface Props {
  booking: BookingDetail;
}

defineProps<Props>();

const formatTimeFromString = (dateString: string): string => {
  return formatTime(parseDate(dateString));
};
</script>

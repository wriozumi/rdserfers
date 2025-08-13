<template>
  <BookingDetailSection title="Customer Information">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Customer Name</label
        >
        <p class="mt-1 text-sm text-gray-900">{{ booking.customerName }}</p>
      </div>
      <div v-if="booking.customerEmail">
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <p class="mt-1 text-sm text-gray-900">{{ booking.customerEmail }}</p>
      </div>
    </div>
  </BookingDetailSection>
</template>

<script setup lang="ts">
import type { BookingDetail } from '../../types';
import BookingDetailSection from './BookingDetailSection.vue';

interface Props {
  booking: BookingDetail;
}

defineProps<Props>();
</script>

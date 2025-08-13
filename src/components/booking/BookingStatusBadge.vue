<template>
  <span
    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
    :class="getStatusClasses(status)"
  >
    {{ status }}
  </span>
</template>

<script setup lang="ts">
import type { Booking } from '../../types';

interface Props {
  status: Booking['status'];
}

defineProps<Props>();

const getStatusClasses = (status: string): string => {
  const statusColors = {
    confirmed: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    statusColors[status as keyof typeof statusColors] ||
    'bg-gray-100 text-gray-800'
  );
};
</script>

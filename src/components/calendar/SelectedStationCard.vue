<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
    <div class="flex items-start sm:items-center justify-between gap-3">
      <div class="flex-1 min-w-0">
        <h3 class="text-base sm:text-lg font-medium text-gray-900 truncate">
          {{ station.name }}
        </h3>
        <p
          class="mt-1 text-xs sm:text-sm text-gray-500 line-clamp-2 sm:line-clamp-1"
        >
          {{ station.address }}
        </p>
      </div>
      <button
        @click="$emit('clear')"
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
</template>

<script setup lang="ts">
import type { Station } from '../../types';

interface Props {
  station: Station;
}

interface Emits {
  (e: 'clear'): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

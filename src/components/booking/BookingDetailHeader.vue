<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14 sm:h-16">
        <div class="flex items-center">
          <button
            type="button"
            class="mr-2 sm:mr-4 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
            @click="$emit('back')"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <h1 class="text-lg sm:text-xl font-semibold text-gray-900">
            {{ title }}
          </h1>
        </div>
        <div class="text-xs sm:text-sm text-gray-500">
          <slot name="action"> ID: {{ bookingId }} </slot>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  bookingId?: string;
}

interface Emits {
  (e: 'back'): void;
}

withDefaults(defineProps<Props>(), {
  title: 'Booking Details',
  bookingId: '',
});

defineEmits<Emits>();
</script>

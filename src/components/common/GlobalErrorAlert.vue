<template>
  <div 
    v-if="show" 
    class="mb-6 bg-red-50 border border-red-200 rounded-md p-4"
    role="alert"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">{{ title }}</h3>
        <div class="mt-2 text-sm text-red-700">{{ message }}</div>
        <div v-if="showRetry" class="mt-3">
          <button
            @click="$emit('retry')"
            class="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            :disabled="retrying"
          >
            {{ retrying ? 'Retrying...' : 'Try Again' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
  title?: string;
  message: string;
  showRetry?: boolean;
  retrying?: boolean;
}

interface Emits {
  (e: 'retry'): void;
}

withDefaults(defineProps<Props>(), {
  title: 'Error Loading Data',
  showRetry: true,
  retrying: false,
});

defineEmits<Emits>();
</script>

<template>
  <div
    v-if="hasError"
    class="min-h-64 flex items-center justify-center bg-red-50 rounded-lg border border-red-200"
  >
    <div class="text-center p-6">
      <div
        class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4"
      >
        <svg
          class="h-6 w-6 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p class="text-sm text-gray-600 mb-4">{{ errorMessage }}</p>
      <button
        @click="retry"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <svg
          class="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Try again
      </button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';

interface Props {
  fallbackMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  fallbackMessage: 'An unexpected error occurred',
});

const emit = defineEmits<{
  retry: [];
}>();

const hasError = ref(false);
const errorMessage = ref('');

onErrorCaptured((error: Error) => {
  hasError.value = true;
  errorMessage.value = error.message || props.fallbackMessage;
  console.error('ErrorBoundary caught:', error);
  return false;
});

const retry = () => {
  hasError.value = false;
  errorMessage.value = '';
  emit('retry');
};

defineExpose({
  reset: retry,
});
</script>

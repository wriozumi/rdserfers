<template>
  <div
    v-if="show"
    class="fixed top-4 right-4 max-w-md bg-red-50 border border-red-200 rounded-lg shadow-lg z-50"
    role="alert"
  >
    <div class="flex p-4">
      <div class="flex-shrink-0">
        <svg
          class="w-5 h-5 text-red-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        <h3 class="text-sm font-medium text-red-800">
          {{ title }}
        </h3>
        <p v-if="message" class="mt-1 text-sm text-red-700">
          {{ message }}
        </p>
      </div>
      <div class="ml-4 flex-shrink-0">
        <button
          type="button"
          class="inline-flex rounded-md bg-red-50 text-red-800 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-50"
          @click="dismiss"
        >
          <span class="sr-only">Dismiss</span>
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';

interface Props {
  title?: string;
  message?: string;
  show?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

interface Emits {
  (e: 'dismiss'): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Error',
  message: '',
  show: false,
  autoHide: true,
  autoHideDelay: 5000,
});

const emit = defineEmits<Emits>();

const show = ref(props.show);

const dismiss = () => {
  show.value = false;
  emit('dismiss');
};

let autoHideTimer: ReturnType<typeof setTimeout> | null = null;

const startAutoHide = () => {
  if (autoHideTimer) {
    clearTimeout(autoHideTimer);
  }

  if (props.autoHide && props.autoHideDelay > 0) {
    autoHideTimer = setTimeout(() => {
      dismiss();
    }, props.autoHideDelay);
  }
};

watch(
  () => props.show,
  newValue => {
    show.value = newValue;
    if (newValue) {
      startAutoHide();
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (autoHideTimer) {
    clearTimeout(autoHideTimer);
  }
});
</script>

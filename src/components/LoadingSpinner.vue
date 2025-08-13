<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="relative">
      <div
        class="animate-spin rounded-full border-4 border-gray-200"
        :class="[sizeClass, colorClass]"
      ></div>
      <div v-if="text" class="mt-3 text-sm text-gray-600 text-center">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'gray';
  text?: string;
  fullScreen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  text: '',
  fullScreen: false,
});

const sizeClass = computed(() => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };
  return sizes[props.size];
});

const colorClass = computed(() => {
  const colors = {
    primary: 'border-t-primary-500',
    gray: 'border-t-gray-500',
  };
  return colors[props.color];
});

const containerClass = computed(() => {
  return props.fullScreen
    ? 'fixed inset-0 bg-white bg-opacity-75 z-50'
    : 'py-8';
});
</script>

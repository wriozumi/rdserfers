<template>
  <button
    type="button"
    :class="buttonClasses"
    @click="$emit('click')"
  >
    <svg :class="iconClasses" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
    </svg>
    <span class="hidden sm:inline">{{ fullLabel }}</span>
    <span class="sm:hidden">{{ shortLabel }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  direction: 'prev' | 'next';
  fullLabel: string;
  shortLabel: string;
}

const props = defineProps<Props>();

defineEmits<{
  click: [];
}>();

const buttonClasses = computed(() => 
  'flex items-center px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200'
);

const iconPath = computed(() => 
  props.direction === 'prev' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'
);

const iconClasses = computed(() => 
  props.direction === 'prev' 
    ? 'w-3 h-3 md:w-4 md:h-4 mr-1' 
    : 'w-3 h-3 md:w-4 md:h-4 ml-1'
);
</script>

<template>
  <div
    class="flex items-center justify-between p-3 md:p-4 border-b border-gray-200"
  >
    <NavigationButton
      direction="prev"
      full-label="Previous"
      short-label="Prev"
      @click="$emit('navigate', 'prev')"
    />

    <div class="text-center flex-1 mx-2">
      <h2 class="text-sm md:text-lg font-semibold text-gray-900">
        {{ weekTitle }}
      </h2>
      <p class="text-xs md:text-sm text-gray-600 hidden sm:block">
        {{ weekSubtitle }}
      </p>
    </div>

    <NavigationButton
      direction="next"
      full-label="Next"
      short-label="Next"
      @click="$emit('navigate', 'next')"
    />
  </div>
</template>

<script setup lang="ts">
import NavigationButton from './NavigationButton.vue';

interface Props {
  weekTitle: string;
  weekSubtitle: string;
}

defineProps<Props>();

defineEmits<{
  navigate: [direction: 'prev' | 'next'];
}>();
</script>

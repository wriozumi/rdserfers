<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4" v-if="$slots.action">
      <h2 class="text-lg font-medium text-gray-900">{{ title }}</h2>
      <slot name="action" />
    </div>
    <h2 v-else class="text-lg font-medium text-gray-900 mb-4">{{ title }}</h2>
    
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
}

defineProps<Props>();
</script>

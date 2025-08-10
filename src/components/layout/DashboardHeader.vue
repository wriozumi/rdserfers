<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14 sm:h-16">
        <div class="flex items-center space-x-2 sm:space-x-4">
          <h1 class="text-lg sm:text-2xl font-bold text-gray-900">{{ title }}</h1>
        </div>
        
        <div v-if="$slots.actions" class="flex items-center space-x-2">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title: string;
}

withDefaults(defineProps<Props>(), {
  title: 'RoadSurfer Dashboard',
});
</script>

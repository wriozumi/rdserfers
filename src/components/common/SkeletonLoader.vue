<template>
  <div class="animate-pulse" data-testid="skeleton-loader">
    <div v-if="type === 'calendar'" class="space-y-4">
      <div class="h-8 bg-gray-200 rounded w-1/3"></div>
      <div class="grid grid-cols-7 gap-4">
        <div v-for="n in 7" :key="n" class="space-y-2">
          <div class="h-6 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          <div class="space-y-1">
            <div class="h-12 bg-gray-200 rounded"></div>
            <div class="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="type === 'booking-card'" class="space-y-2">
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-3 bg-gray-200 rounded w-1/2"></div>
      <div class="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>

    <div v-else-if="type === 'booking-detail'" class="space-y-6">
      <div class="space-y-2">
        <div class="h-6 bg-gray-200 rounded w-1/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="space-y-2">
          <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          <div class="h-5 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <div v-else-if="type === 'search'" class="space-y-2">
      <div class="h-4 bg-gray-200 rounded w-1/4"></div>
      <div
        v-for="n in count"
        :key="n"
        class="p-3 border border-gray-200 rounded space-y-2"
      >
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-3 bg-gray-200 rounded w-full"></div>
      </div>
    </div>

    <div v-else class="space-y-3">
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'calendar' | 'booking-card' | 'booking-detail' | 'search' | 'default';
  count?: number;
}

withDefaults(defineProps<Props>(), {
  type: 'default',
  count: 3,
});
</script>

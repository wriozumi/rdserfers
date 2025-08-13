<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6"
  >
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div class="flex-1">
        <h2 class="text-base sm:text-lg font-medium text-gray-900">
          Station Bookings
        </h2>
        <p class="mt-1 text-xs sm:text-sm text-gray-500">
          Search for a station to view its booking calendar
        </p>
      </div>

      <div class="w-full sm:w-80 lg:w-96">
        <AutocompleteInput
          ref="autocompleteRef"
          :model-value="selectedStation"
          placeholder="Search stations by name or location..."
          :loading="searchLoading"
          :error="error || undefined"
          :disabled="loading"
          @update:model-value="$emit('update:selectedStation', $event)"
          @search="$emit('search', $event)"
          @select="$emit('select', $event)"
        />
      </div>
    </div>

    <div v-if="selectedStation" class="mt-4 pt-4 border-t border-gray-200">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
      >
        <div class="flex items-center space-x-2">
          <div class="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full"></div>
          <span class="text-sm font-medium text-gray-900">{{
            selectedStation.name
          }}</span>
          <span class="text-xs text-gray-500">•</span>
          <span class="text-xs text-gray-500 truncate">{{
            selectedStation.address
          }}</span>
        </div>
        <button
          @click="$emit('clear')"
          class="inline-flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            class="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          Clear selection
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Station } from "../../types";
import AutocompleteInput from "../AutocompleteInput.vue";

interface Props {
  selectedStation: Station | null;
  error?: string | null;
  loading?: boolean;
  searchLoading?: boolean;
}

interface Emits {
  (e: "update:selectedStation", station: Station | null): void;
  (e: "search", query: string): void;
  (e: "select", station: Station): void;
  (e: "clear"): void;
  (e: "focus"): void;
}

withDefaults(defineProps<Props>(), {
  error: null,
  loading: false,
  searchLoading: false,
});

defineEmits<Emits>();

const autocompleteRef = ref<InstanceType<typeof AutocompleteInput>>();

const focus = () => {
  autocompleteRef.value?.focus();
};

const updateSuggestions = (suggestions: Station[]) => {
  autocompleteRef.value?.updateSuggestions(suggestions);
};

defineExpose({
  focus,
  updateSuggestions,
});
</script>

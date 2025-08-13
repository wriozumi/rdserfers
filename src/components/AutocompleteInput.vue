<template>
  <div class="relative w-full">
    <div class="relative">
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-label="placeholder"
        :aria-expanded="showDropdown"
        :aria-activedescendant="
          selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined
        "
        aria-autocomplete="list"
        role="combobox"
        data-testid="autocomplete-input"
        class="w-full px-4 py-3 pr-10 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500"
        :class="{
          'border-red-300 focus:border-red-500 focus:ring-red-500': error,
        }"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />

      <div
        v-if="loading"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
        data-testid="autocomplete-loading"
      >
        <div
          class="w-4 h-4 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin"
        ></div>
      </div>

      <button
        v-else-if="query && !disabled"
        type="button"
        data-testid="autocomplete-clear"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        @click="clear"
      >
        <svg
          class="w-4 h-4"
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
      </button>
    </div>

    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>

    <Transition name="slide-up">
      <div
        v-if="showDropdown && (suggestions.length > 0 || noResultsMessage)"
        role="listbox"
        data-testid="autocomplete-dropdown"
        :aria-label="`${suggestions.length} stations found`"
        class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
      >
        <div
          v-if="suggestions.length === 0 && noResultsMessage"
          data-testid="autocomplete-no-results"
          class="px-4 py-3 text-sm text-gray-500"
        >
          {{ noResultsMessage }}
        </div>

        <button
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.id"
          :id="`suggestion-${index}`"
          :data-testid="`autocomplete-option-${index}`"
          type="button"
          role="option"
          :aria-selected="index === selectedIndex"
          :aria-label="`${suggestion.name}, ${suggestion.address}`"
          class="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-200"
          :class="{
            'bg-primary-50 text-primary-900': index === selectedIndex,
          }"
          @click="selectSuggestion(suggestion)"
          @mouseenter="selectedIndex = index"
        >
          <div class="font-medium text-gray-900">
            {{ suggestion.name }}
          </div>
          <div class="text-gray-500 truncate">
            {{ suggestion.address }}
          </div>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Station } from '@/types';
import { debounce } from '@/utils';
import { nextTick, ref, watch } from 'vue';

interface Props {
  modelValue?: Station | null;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  minChars?: number;
  debounceMs?: number;
  noResultsMessage?: string;
}

interface Emits {
  (e: 'update:modelValue', value: Station | null): void;
  (e: 'search', query: string): void;
  (e: 'select', station: Station): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search stations...',
  disabled: false,
  error: '',
  minChars: 2,
  debounceMs: 300,
  noResultsMessage: 'No stations found',
});

const emit = defineEmits<Emits>();

const inputRef = ref<HTMLInputElement>();

const query = ref('');
const suggestions = ref<Station[]>([]);
const selectedIndex = ref(-1);
const showDropdown = ref(false);
const loading = ref(false);
const isFocused = ref(false);

const debouncedSearch = debounce((searchQuery: string) => {
  if (searchQuery.length >= props.minChars) {
    emit('search', searchQuery);
  } else {
    suggestions.value = [];
  }
}, props.debounceMs);

const handleInput = () => {
  selectedIndex.value = -1;

  if (query.value.length === 0) {
    suggestions.value = [];
    emit('update:modelValue', null);
    return;
  }

  if (query.value.length >= props.minChars) {
    loading.value = true;
    debouncedSearch(query.value);
  } else {
    suggestions.value = [];
    loading.value = false;
  }
};

const handleFocus = () => {
  isFocused.value = true;
  if (query.value.length >= props.minChars && suggestions.value.length > 0) {
    showDropdown.value = true;
  }
};

const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false;
    showDropdown.value = false;
  }, 150);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!showDropdown.value || suggestions.value.length === 0) return;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      selectedIndex.value = Math.min(
        selectedIndex.value + 1,
        suggestions.value.length - 1
      );
      break;
    case 'ArrowUp':
      event.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
      break;
    case 'Enter':
      event.preventDefault();
      if (selectedIndex.value >= 0) {
        selectSuggestion(suggestions.value[selectedIndex.value]);
      }
      break;
    case 'Escape':
      showDropdown.value = false;
      inputRef.value?.blur();
      break;
  }
};

const selectSuggestion = (station: Station) => {
  query.value = station.name;
  suggestions.value = [];
  showDropdown.value = false;
  selectedIndex.value = -1;

  emit('update:modelValue', station);
  emit('select', station);

  inputRef.value?.blur();
};

const clear = () => {
  query.value = '';
  suggestions.value = [];
  showDropdown.value = false;
  selectedIndex.value = -1;

  emit('update:modelValue', null);

  nextTick(() => {
    inputRef.value?.focus();
  });
};

const updateSuggestions = (newSuggestions: Station[]) => {
  suggestions.value = newSuggestions;
  loading.value = false;
  selectedIndex.value = -1;

  if (
    isFocused.value &&
    (newSuggestions.length > 0 || query.value.length >= props.minChars)
  ) {
    showDropdown.value = true;
  }
};

watch(
  () => props.modelValue,
  newValue => {
    if (newValue) {
      query.value = newValue.name;
    } else if (!isFocused.value) {
      query.value = '';
    }
  },
  { immediate: true }
);

watch(
  [isFocused, () => suggestions.value.length, query],
  ([focused, suggestionsLength, currentQuery]) => {
    if (focused && currentQuery.length >= props.minChars) {
      showDropdown.value = suggestionsLength > 0 || currentQuery.length > 0;
    } else {
      showDropdown.value = false;
    }
  }
);

defineExpose({
  updateSuggestions,
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
});
</script>

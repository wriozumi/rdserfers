import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import AutocompleteInput from '../AutocompleteInput.vue';

describe('AutocompleteInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const wrapper = mount(AutocompleteInput);

    expect(wrapper.find('[data-testid="autocomplete-input"]').exists()).toBe(
      true
    );
    expect(
      wrapper
        .find('[data-testid="autocomplete-input"]')
        .attributes('placeholder')
    ).toBe('Search stations...');
  });

  it('emits search event when typing', async () => {
    const wrapper = mount(AutocompleteInput, {
      props: {
        minChars: 2,
        debounceMs: 0, // No debounce for testing
      },
    });

    const input = wrapper.find('[data-testid="autocomplete-input"]');
    await input.setValue('Berlin');
    await input.trigger('input');
    await nextTick();

    // Wait a bit for debounced function
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(wrapper.emitted('search')).toBeTruthy();
    expect(wrapper.emitted('search')![0]).toEqual(['Berlin']);
  });

  it('shows suggestions when provided', async () => {
    const suggestions = [
      { id: '1', name: 'Berlin', address: 'Berlin, Germany' },
    ];

    const wrapper = mount(AutocompleteInput, {
      props: {
        suggestions,
        modelValue: null,
        minChars: 2,
      },
    });

    const input = wrapper.find('[data-testid="autocomplete-input"]');
    await input.setValue('Berlin');
    await input.trigger('focus');
    await input.trigger('input');
    await nextTick();

    expect(wrapper.find('[data-testid="autocomplete-dropdown"]').exists()).toBe(
      true
    );
  });

  it('emits select event when suggestion is clicked', async () => {
    const suggestions = [
      { id: '1', name: 'Berlin', address: 'Berlin, Germany' },
    ];

    const wrapper = mount(AutocompleteInput, {
      props: {
        suggestions,
        minChars: 2,
      },
    });

    const input = wrapper.find('[data-testid="autocomplete-input"]');
    await input.setValue('Berlin');
    await input.trigger('focus');
    await input.trigger('input');

    // Manually trigger the updateSuggestions method
    wrapper.vm.updateSuggestions(suggestions);
    await nextTick();

    const suggestionButton = wrapper.find(
      '[data-testid="autocomplete-option-0"]'
    );
    expect(suggestionButton.exists()).toBe(true);
    await suggestionButton.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([suggestions[0]]);
  });

  it('handles keyboard navigation', async () => {
    const suggestions = [
      { id: '1', name: 'Berlin', address: 'Berlin, Germany' },
      { id: '2', name: 'Munich', address: 'Munich, Germany' },
    ];

    const wrapper = mount(AutocompleteInput, {
      props: {
        suggestions,
        minChars: 2,
      },
    });

    const input = wrapper.find('[data-testid="autocomplete-input"]');
    await input.setValue('Berlin');
    await input.trigger('focus');
    await input.trigger('input');

    // Manually trigger the updateSuggestions method
    wrapper.vm.updateSuggestions(suggestions);
    await nextTick();

    // Make sure dropdown is visible and navigate
    await input.trigger('keydown', { key: 'ArrowDown' });
    await input.trigger('keydown', { key: 'Enter' });

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([suggestions[0]]);
  });

  it('clears input when clear button is clicked', async () => {
    const mockStation = { id: '1', name: 'Berlin', address: 'Berlin, Germany' };

    const wrapper = mount(AutocompleteInput, {
      props: {
        modelValue: mockStation,
        suggestions: [],
        loading: false,
      },
    });

    await nextTick();

    const clearButton = wrapper.find('[data-testid="autocomplete-clear"]');
    expect(clearButton.exists()).toBe(true);

    await clearButton.trigger('click');

    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted![emitted!.length - 1]).toEqual([null]);
  });

  it('shows loading spinner when loading', async () => {
    const wrapper = mount(AutocompleteInput, {
      props: {
        loading: true,
      },
    });

    await wrapper.find('[data-testid="autocomplete-input"]').setValue('Berlin');

    expect(wrapper.find('[data-testid="autocomplete-loading"]').exists()).toBe(
      true
    );
  });

  it('displays error message when provided', () => {
    const wrapper = mount(AutocompleteInput, {
      props: {
        error: 'Station not found',
        noResultsMessage: 'Station not found',
        minChars: 2,
      },
    });

    const input = wrapper.find('[data-testid="autocomplete-input"]');
    expect(input.classes()).toContain('border-red-300');

    // Set value and trigger focus to show dropdown with error
    input.setValue('Berlin');
    input.trigger('focus');
    input.trigger('input');

    expect(wrapper.text()).toContain('Station not found');
  });
});

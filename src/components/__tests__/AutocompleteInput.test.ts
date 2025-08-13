import AutocompleteInput from '@/components/AutocompleteInput.vue';
import type { Station } from '@/types';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

describe('AutocompleteInput', () => {
  const mockStation: Station = {
    id: '1',
    name: 'Berlin',
    address: 'Berlin Hauptbahnhof, Germany',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const wrapper = mount(AutocompleteInput);

    expect(wrapper.find('input').exists()).toBe(true);
    expect(wrapper.find('input').attributes('placeholder')).toBe(
      'Search stations...'
    );
  });

  it('emits search event when typing', async () => {
    const wrapper = mount(AutocompleteInput, {
      props: {
        minChars: 2,
      },
    });

    const input = wrapper.find('input');
    await input.setValue('Ber');

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(wrapper.emitted('search')).toBeTruthy();
    expect(wrapper.emitted('search')?.[0]).toEqual(['Ber']);
  });

  it('displays suggestions when provided', async () => {
    const wrapper = mount(AutocompleteInput);
    const input = wrapper.find('input');

    await input.setValue('Ber');
    await input.trigger('focus');

    wrapper.vm.updateSuggestions([mockStation]);
    await nextTick();

    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Berlin');
  });

  it('emits select event when suggestion is clicked', async () => {
    const wrapper = mount(AutocompleteInput);
    const input = wrapper.find('input');

    await input.setValue('Ber');
    await input.trigger('focus');

    wrapper.vm.updateSuggestions([mockStation]);
    await nextTick();

    const suggestionButton = wrapper.find('button[role="option"]');
    await suggestionButton.trigger('click');

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')?.[0]).toEqual([mockStation]);
  });

  it('handles keyboard navigation', async () => {
    const wrapper = mount(AutocompleteInput);
    const input = wrapper.find('input');

    await input.setValue('Ber');
    await input.trigger('focus');

    wrapper.vm.updateSuggestions([mockStation]);
    await nextTick();

    await input.trigger('keydown', { key: 'ArrowDown' });

    const suggestionButton = wrapper.find('button[role="option"]');
    expect(suggestionButton.classes()).toContain('bg-primary-50');

    await input.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('select')).toBeTruthy();
  });

  it('clears input when clear button is clicked', async () => {
    const wrapper = mount(AutocompleteInput);
    const input = wrapper.find('input');

    await input.setValue('Berlin');
    await nextTick();

    const clearButton = wrapper.find(
      'button[type="button"]:not([role="option"])'
    );
    await clearButton.trigger('click');

    expect(input.element.value).toBe('');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });

  it('shows loading state', async () => {
    const wrapper = mount(AutocompleteInput);

    await wrapper.find('input').setValue('Berlin');

    expect(wrapper.find('.animate-spin').exists()).toBe(true);
  });

  it('shows no results message when appropriate', async () => {
    const wrapper = mount(AutocompleteInput, {
      props: {
        noResultsMessage: 'No stations found',
      },
    });

    const input = wrapper.find('input');
    await input.setValue('XYZ');
    await input.trigger('focus');

    wrapper.vm.updateSuggestions([]);
    await nextTick();

    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('No stations found');
  });
});

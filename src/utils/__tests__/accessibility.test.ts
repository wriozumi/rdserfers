import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AutocompleteInput from '../../components/AutocompleteInput.vue';
import BookingCard from '../../components/calendar/BookingCard.vue';
import type { Booking } from '../../types';

const mockBooking: Booking = {
  id: '1',
  customerName: 'John Doe',
  stationId: '1',
  stationName: 'Berlin',
  pickupDate: '2025-08-12T10:00:00.000Z',
  returnDate: '2025-08-15T18:00:00.000Z',
  duration: 3,
  status: 'confirmed',
};

describe('Accessibility Features', () => {
  it('AutocompleteInput has proper ARIA attributes', () => {
    const wrapper = mount(AutocompleteInput, {
      props: {
        placeholder: 'Search stations',
      },
    });

    const input = wrapper.find('[data-testid="autocomplete-input"]');
    expect(input.attributes('role')).toBe('combobox');
    expect(input.attributes('aria-autocomplete')).toBe('list');
    expect(input.attributes('aria-expanded')).toBe('false');
  });

  it('BookingCard has proper accessibility labels', () => {
    const wrapper = mount(BookingCard, {
      props: {
        booking: mockBooking,
        date: new Date('2025-08-12'),
      },
    });

    const button = wrapper.find('[data-testid="booking-card-1"]');
    expect(button.attributes('aria-label')).toContain('John Doe');
    expect(button.attributes('aria-label')).toContain('confirmed');
  });

  it('supports keyboard navigation on BookingCard', async () => {
    const wrapper = mount(BookingCard, {
      props: {
        booking: mockBooking,
        date: new Date('2025-08-12'),
      },
    });

    await wrapper
      .find('[data-testid="booking-card-1"]')
      .trigger('keydown.enter');
    expect(wrapper.emitted('select')).toBeTruthy();

    await wrapper
      .find('[data-testid="booking-card-1"]')
      .trigger('keydown.space');
    expect(wrapper.emitted('select')).toHaveLength(2);
  });
});

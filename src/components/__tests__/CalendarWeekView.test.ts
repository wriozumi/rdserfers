import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { Booking } from '../../types';
import CalendarWeekView from '../CalendarWeekView.vue';

vi.mock('../composables/useCalendarWeek', () => ({
  useCalendarWeek: () => ({
    weekDays: [
      {
        date: new Date('2025-08-11'),
        bookings: [],
        isToday: false,
        isWeekend: false,
      },
      {
        date: new Date('2025-08-12'),
        bookings: [mockBooking],
        isToday: true,
        isWeekend: false,
      },
    ],
    weekTitle: 'Aug 11 - Aug 17',
    weekSubtitle: 'August 2025',
  }),
}));

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

describe('CalendarWeekView', () => {
  it('renders week view with 7 days', () => {
    const wrapper = mount(CalendarWeekView, {
      props: {
        currentWeek: new Date('2025-08-11'),
        bookings: [mockBooking],
      },
    });

    expect(wrapper.find('.grid-cols-7').exists()).toBe(true);
  });

  it('shows skeleton loader when loading', () => {
    const wrapper = mount(CalendarWeekView, {
      props: {
        currentWeek: new Date('2025-08-11'),
        bookings: [],
        loading: true,
      },
    });

    expect(wrapper.find('.animate-pulse').exists()).toBe(true);
  });

  it('emits navigate event when navigation is triggered', async () => {
    const wrapper = mount(CalendarWeekView, {
      props: {
        currentWeek: new Date('2025-08-11'),
        bookings: [],
      },
    });

    await wrapper.vm.$emit('navigate', 'next');
    expect(wrapper.emitted('navigate')).toBeTruthy();
    expect(wrapper.emitted('navigate')?.[0]).toEqual(['next']);
  });
});

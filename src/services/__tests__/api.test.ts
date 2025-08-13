import { apiService } from '@/services/api';
import { beforeEach, describe, expect, it } from 'vitest';

describe('ApiService', () => {
  beforeEach(() => {});

  it('searches stations correctly', async () => {
    const results = await apiService.searchStations('Berlin');

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          name: 'Berlin',
          address: expect.stringContaining('Berlin'),
        }),
      ])
    );
  });

  it('returns empty array for stations not found', async () => {
    const results = await apiService.searchStations('NonExistentCity');

    expect(results).toEqual([]);
  });

  it('gets all stations', async () => {
    const results = await apiService.getAllStations();

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('name');
    expect(results[0]).toHaveProperty('address');
  });

  it('gets station by id', async () => {
    const station = await apiService.getStationById('1');

    expect(station).toEqual({
      id: '1',
      name: 'Berlin',
      address: expect.stringContaining('Berlin'),
    });
  });

  it('returns null for non-existent station id', async () => {
    const station = await apiService.getStationById('999');

    expect(station).toBeNull();
  });

  it('gets bookings for station within date range', async () => {
    const startDate = new Date('2025-08-01');
    const endDate = new Date('2025-08-31');

    const bookings = await apiService.getBookingsForStation(
      '1',
      startDate,
      endDate
    );

    expect(Array.isArray(bookings)).toBe(true);

    if (bookings.length > 0) {
      expect(bookings[0]).toHaveProperty('id');
      expect(bookings[0]).toHaveProperty('customerName');
      expect(bookings[0]).toHaveProperty('pickupDate');
      expect(bookings[0]).toHaveProperty('returnDate');
      expect(bookings[0]).toHaveProperty('status');
    }
  });

  it('gets booking detail by id', async () => {
    const booking = await apiService.getBookingDetail('100');

    if (booking) {
      expect(booking).toHaveProperty('id');
      expect(booking).toHaveProperty('customerName');
      expect(booking).toHaveProperty('customerEmail');
      expect(booking).toHaveProperty('vehicleType');
      expect(booking).toHaveProperty('totalPrice');
    }
  });
});

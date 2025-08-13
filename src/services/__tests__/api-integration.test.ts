import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '../../utils/errorUtils';
import { apiService } from '../api';

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('Error Handling', () => {
    it('should handle network timeout errors', async () => {
      const mockFetch = vi.fn().mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('AbortError')), 100);
          })
      );
      global.fetch = mockFetch;

      try {
        await apiService.searchStations('Berlin');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain('timeout');
      }
    });

    it('should handle server errors with retry logic', async () => {
      let callCount = 0;
      const mockFetch = vi.fn().mockImplementation(() => {
        callCount++;
        return Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        });
      });
      global.fetch = mockFetch;

      try {
        await apiService.searchStations('Berlin');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toContain('API Error: 500');
      }
    });

    it('should handle malformed JSON responses', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });
      global.fetch = mockFetch;

      try {
        await apiService.searchStations('Berlin');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
      }
    });

    it('should handle rate limiting (429 status)', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
      });
      global.fetch = mockFetch;

      try {
        await apiService.searchStations('Berlin');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).status).toBe(429);
      }
    });
  });

  describe('Success Scenarios', () => {
    it('should successfully fetch stations with proper response format', async () => {
      const mockStations = [
        { id: '1', name: 'Berlin Central', address: 'Berlin, Germany' },
        { id: '2', name: 'Berlin Airport', address: 'Berlin Airport, Germany' },
      ];

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStations),
      });
      global.fetch = mockFetch;

      const result = await apiService.searchStations('Berlin');

      expect(result).toEqual(mockStations);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/stations?search=Berlin'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should handle booking details with complete data', async () => {
      const mockBooking = {
        id: '123',
        customerName: 'John Doe',
        stationId: '1',
        stationName: 'Berlin Central',
        pickupDate: '2025-08-12T10:00:00.000Z',
        returnDate: '2025-08-15T18:00:00.000Z',
        duration: 4,
        status: 'confirmed',
        vehicleModel: 'VW California',
        notes: 'Test booking',
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockBooking),
      });
      global.fetch = mockFetch;

      const result = await apiService.getBookingDetail('123');

      expect(result).toMatchObject({
        id: '123',
        customerName: 'John Doe',
        stationName: 'Berlin Central',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty search results', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });
      global.fetch = mockFetch;

      const result = await apiService.searchStations('NonExistentCity');
      expect(result).toEqual([]);
    });

    it('should handle special characters in search queries', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });
      global.fetch = mockFetch;

      await apiService.searchStations('Zürich & München');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent('Zürich & München')),
        expect.any(Object)
      );
    });

    it('should handle very long search queries', async () => {
      const longQuery = 'a'.repeat(1000);

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });
      global.fetch = mockFetch;

      const result = await apiService.searchStations(longQuery);
      expect(result).toEqual([]);
    });
  });
});

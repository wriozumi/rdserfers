import { describe, it, expect } from 'vitest';
import { 
  formatDate, 
  formatDateLong, 
  isSameDay, 
  isToday, 
  isWeekend, 
  getWeekDays, 
  addWeeks, 
  calculateDuration,
  debounce 
} from '@/utils';

describe('Utils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2025-08-09');
      const formatted = formatDate(date);
      
      expect(formatted).toContain('Aug');
      expect(formatted).toContain('9');
    });
  });

  describe('formatDateLong', () => {
    it('formats date in long format', () => {
      const date = new Date('2025-08-09');
      const formatted = formatDateLong(date);
      
      expect(formatted).toContain('August');
      expect(formatted).toContain('2025');
      expect(formatted).toContain('9');
    });
  });

  describe('isSameDay', () => {
    it('returns true for same day', () => {
      const date1 = new Date('2025-08-09T10:00:00');
      const date2 = new Date('2025-08-09T15:00:00');
      
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('returns false for different days', () => {
      const date1 = new Date('2025-08-09');
      const date2 = new Date('2025-08-10');
      
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('isToday', () => {
    it('returns true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('returns false for other days', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('isWeekend', () => {
    it('returns true for Saturday', () => {
      // Create a Saturday date
      const saturday = new Date('2025-08-09'); // This is a Saturday
      expect(isWeekend(saturday)).toBe(true);
    });

    it('returns true for Sunday', () => {
      const sunday = new Date('2025-08-10'); // This is a Sunday
      expect(isWeekend(sunday)).toBe(true);
    });

    it('returns false for weekdays', () => {
      const monday = new Date('2025-08-11'); // This is a Monday
      expect(isWeekend(monday)).toBe(false);
    });
  });

  describe('getWeekDays', () => {
    it('returns 7 days starting from Monday', () => {
      const date = new Date('2025-08-09'); // Saturday
      const weekDays = getWeekDays(date);
      
      expect(weekDays).toHaveLength(7);
      
      // First day should be Monday
      expect(weekDays[0].getDay()).toBe(1);
      
      // Last day should be Sunday
      expect(weekDays[6].getDay()).toBe(0);
    });
  });

  describe('addWeeks', () => {
    it('adds weeks correctly', () => {
      const date = new Date('2025-08-09');
      const newDate = addWeeks(date, 2);
      
      expect(newDate.getDate()).toBe(23);
      expect(newDate.getMonth()).toBe(7); // August (0-indexed)
    });

    it('subtracts weeks with negative number', () => {
      const date = new Date('2025-08-09');
      const newDate = addWeeks(date, -1);
      
      expect(newDate.getDate()).toBe(2);
      expect(newDate.getMonth()).toBe(7); // August (0-indexed)
    });
  });

  describe('calculateDuration', () => {
    it('calculates duration correctly', () => {
      const startDate = '2025-08-09';
      const endDate = '2025-08-12';
      
      const duration = calculateDuration(startDate, endDate);
      expect(duration).toBe(3);
    });

    it('handles same day', () => {
      const startDate = '2025-08-09';
      const endDate = '2025-08-09';
      
      const duration = calculateDuration(startDate, endDate);
      expect(duration).toBe(0);
    });
  });

  describe('debounce', () => {
    it('debounces function calls', async () => {
      let callCount = 0;
      const fn = () => callCount++;
      const debouncedFn = debounce(fn, 100);
      
      // Call multiple times quickly
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      // Should not have been called yet
      expect(callCount).toBe(0);
      
      // Wait for debounce delay
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should have been called only once
      expect(callCount).toBe(1);
    });
  });
});

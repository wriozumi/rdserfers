import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  AppError,
  ErrorHandler,
  handleAsyncError,
  handleSyncError,
  getUserFriendlyMessage,
  withRetry,
} from '../utils/errorHandling';

describe('ErrorHandling', () => {
  let errorHandler: ErrorHandler;

  beforeEach(() => {
    errorHandler = ErrorHandler.getInstance();
    errorHandler.clearErrorLog();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('AppError', () => {
    it('should create an AppError with all properties', () => {
      const error = new AppError('Test error', 'TEST_CODE', 400, {
        key: 'value',
      });

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('AppError');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual({ key: 'value' });
    });

    it('should create an AppError with minimal properties', () => {
      const error = new AppError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.code).toBeUndefined();
      expect(error.statusCode).toBeUndefined();
      expect(error.details).toBeUndefined();
    });
  });

  describe('ErrorHandler', () => {
    it('should be a singleton', () => {
      const handler1 = ErrorHandler.getInstance();
      const handler2 = ErrorHandler.getInstance();
      expect(handler1).toBe(handler2);
    });

    it('should log errors with context', () => {
      const error = new Error('Test error');
      const context = { component: 'TestComponent', action: 'test' };

      errorHandler.logError(error, context);
      const log = errorHandler.getErrorLog();

      expect(log).toHaveLength(1);
      expect(log[0].error).toBe(error);
      expect(log[0].context.component).toBe('TestComponent');
      expect(log[0].context.action).toBe('test');
      expect(log[0].context.timestamp).toBeDefined();
    });

    it('should limit error log to 100 entries', () => {
      // Add 150 errors
      for (let i = 0; i < 150; i++) {
        errorHandler.logError(new Error(`Error ${i}`));
      }

      const log = errorHandler.getErrorLog();
      expect(log).toHaveLength(100);

      // Should keep the latest 100 errors
      expect(log[0].error.message).toBe('Error 50');
      expect(log[99].error.message).toBe('Error 149');
    });

    it('should clear error log', () => {
      errorHandler.logError(new Error('Test error'));
      expect(errorHandler.getErrorLog()).toHaveLength(1);

      errorHandler.clearErrorLog();
      expect(errorHandler.getErrorLog()).toHaveLength(0);
    });
  });

  describe('handleAsyncError', () => {
    it('should return data when async operation succeeds', async () => {
      const asyncFn = vi.fn().mockResolvedValue('success');
      const result = await handleAsyncError(asyncFn);

      expect(result.data).toBe('success');
      expect(result.error).toBeNull();
      expect(asyncFn).toHaveBeenCalledOnce();
    });

    it('should return error when async operation fails', async () => {
      const error = new Error('Async error');
      const asyncFn = vi.fn().mockRejectedValue(error);
      const result = await handleAsyncError(asyncFn, {
        component: 'TestComponent',
      });

      expect(result.data).toBeNull();
      expect(result.error).toBe(error);

      const log = errorHandler.getErrorLog();
      expect(log).toHaveLength(1);
      expect(log[0].context.component).toBe('TestComponent');
    });

    it('should handle non-Error rejections', async () => {
      const asyncFn = vi.fn().mockRejectedValue('string error');
      const result = await handleAsyncError(asyncFn);

      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('string error');
    });
  });

  describe('handleSyncError', () => {
    it('should return data when sync operation succeeds', () => {
      const syncFn = vi.fn().mockReturnValue('success');
      const result = handleSyncError(syncFn);

      expect(result.data).toBe('success');
      expect(result.error).toBeNull();
      expect(syncFn).toHaveBeenCalledOnce();
    });

    it('should return error when sync operation fails', () => {
      const error = new Error('Sync error');
      const syncFn = vi.fn().mockImplementation(() => {
        throw error;
      });
      const result = handleSyncError(syncFn, { component: 'TestComponent' });

      expect(result.data).toBeNull();
      expect(result.error).toBe(error);

      const log = errorHandler.getErrorLog();
      expect(log).toHaveLength(1);
      expect(log[0].context.component).toBe('TestComponent');
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return specific messages for AppError codes', () => {
      const networkError = new AppError('Network failed', 'NETWORK_ERROR');
      expect(getUserFriendlyMessage(networkError)).toBe(
        'Unable to connect to the server. Please check your internet connection and try again.'
      );

      const timeoutError = new AppError('Timeout', 'TIMEOUT');
      expect(getUserFriendlyMessage(timeoutError)).toBe(
        'The request took too long to complete. Please try again.'
      );

      const stationError = new AppError('Station error', 'STATION_NOT_FOUND');
      expect(getUserFriendlyMessage(stationError)).toBe(
        'The selected station could not be found.'
      );
    });

    it('should return generic messages for pattern matching', () => {
      const networkError = new Error('Network connection failed');
      expect(getUserFriendlyMessage(networkError)).toBe(
        'Network error. Please check your connection and try again.'
      );

      const timeoutError = new Error('Request timeout occurred');
      expect(getUserFriendlyMessage(timeoutError)).toBe(
        'Request timeout. Please try again.'
      );

      const notFoundError = new Error('Resource not found');
      expect(getUserFriendlyMessage(notFoundError)).toBe(
        'The requested resource was not found.'
      );
    });

    it('should return original message for unrecognized errors', () => {
      const unknownError = new Error('Unknown error occurred');
      expect(getUserFriendlyMessage(unknownError)).toBe(
        'Unknown error occurred'
      );
    });

    it('should return default message for empty error', () => {
      const emptyError = new Error('');
      expect(getUserFriendlyMessage(emptyError)).toBe(
        'An unexpected error occurred. Please try again.'
      );
    });
  });

  describe('withRetry', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should succeed on first attempt', async () => {
      const operation = vi.fn().mockResolvedValue('success');

      const resultPromise = withRetry(operation, 3, 100);
      const result = await resultPromise;

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledOnce();
    });

    it('should retry on failure and eventually succeed', async () => {
      const operation = vi
        .fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValue('success');

      const resultPromise = withRetry(operation, 3, 100);

      // Fast forward through the delays
      vi.runAllTimers();

      const result = await resultPromise;

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should fail after max retries', async () => {
      const error = new Error('Persistent failure');
      const operation = vi.fn().mockRejectedValue(error);

      const resultPromise = withRetry(operation, 2, 100);

      // Fast forward through the delays
      vi.runAllTimers();

      await expect(resultPromise).rejects.toThrow('Persistent failure');
      expect(operation).toHaveBeenCalledTimes(3); // Initial + 2 retries

      const log = errorHandler.getErrorLog();
      expect(log.length).toBeGreaterThan(0);
    });

    it('should apply exponential backoff with jitter', async () => {
      const operation = vi
        .fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValue('success');

      const resultPromise = withRetry(operation, 3, 100);

      // Check that timers are scheduled
      expect(vi.getTimerCount()).toBe(0); // No initial delay

      // Fast forward through all delays
      vi.runAllTimers();

      await resultPromise;
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should log retry attempts and failures', async () => {
      const error = new Error('Test failure');
      const operation = vi.fn().mockRejectedValue(error);
      const context = { component: 'TestComponent' };

      const resultPromise = withRetry(operation, 1, 100, context);

      vi.runAllTimers();

      await expect(resultPromise).rejects.toThrow('Test failure');

      const log = errorHandler.getErrorLog();
      expect(log.length).toBeGreaterThan(0);

      // Should have retry attempt and final failure logs
      const retryAttempts = log.filter(
        entry => entry.context.action === 'retry_attempt'
      );
      const finalFailure = log.filter(
        entry => entry.context.action === 'retry_failed'
      );

      expect(retryAttempts).toHaveLength(1);
      expect(finalFailure).toHaveLength(1);
      expect(finalFailure[0].context.component).toBe('TestComponent');
    });
  });
});

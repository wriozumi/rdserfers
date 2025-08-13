import { describe, expect, it } from 'vitest';
import { apiConfig } from '../../config/api';

describe('API Configuration', () => {
  it('has valid configuration', () => {
    expect(apiConfig).toBeDefined();
    expect(typeof apiConfig.baseUrl).toBe('string');
    expect(typeof apiConfig.timeout).toBe('number');
    expect(typeof apiConfig.useMock).toBe('boolean');
    expect(apiConfig.timeout).toBeGreaterThan(0);
  });

  it('uses default values appropriately', () => {
    expect(apiConfig.baseUrl).toBe(
      'https://605c94c36d85de00174f0f76.mockapi.io/roadsurfer/v1'
    );
    expect(apiConfig.timeout).toBe(10000);
    expect(apiConfig.useMock).toBe(true);
  });
});

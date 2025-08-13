import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('API Configuration', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('uses default config when no environment variables are set', async () => {
    vi.stubGlobal('import', {
      meta: {
        env: {},
      },
    });

    const { apiConfig } = await import('../../config/api');

    expect(apiConfig.useMock).toBe(true);
    expect(apiConfig.timeout).toBe(10000);
  });

  it('uses environment variables when available', async () => {
    vi.stubGlobal('import', {
      meta: {
        env: {
          VITE_API_BASE_URL: 'https://api.example.com',
          VITE_API_TIMEOUT: '5000',
          VITE_USE_MOCK_API: 'false',
        },
      },
    });

    const { apiConfig } = await import('../../config/api');

    expect(apiConfig.baseUrl).toBe('https://api.example.com');
    expect(apiConfig.timeout).toBe(5000);
    expect(apiConfig.useMock).toBe(false);
  });
});

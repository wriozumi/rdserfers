interface ApiConfig {
  baseUrl: string;
  timeout: number;
  useMock: boolean;
}

const getApiConfig = (): ApiConfig => {
  const env = import.meta.env;

  return {
    baseUrl:
      env.VITE_API_BASE_URL ||
      'https://605c94c36d85de00174f0f76.mockapi.io/roadsurfer/v1',
    timeout: parseInt(env.VITE_API_TIMEOUT || '10000'),
    useMock: env.VITE_USE_MOCK_API !== 'false',
  };
};

export const apiConfig = getApiConfig();

// Proper API types instead of any
export interface MockBookingResponse {
  id: string;
  customerName: string;
  startDate: string;
  endDate: string;
  pickupReturnStationId: string;
  pickupStation?: string;
  returnStation?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ApiRequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export type CacheKey = string;
export type CacheStorage<T> = Map<CacheKey, CacheEntry<T>>;

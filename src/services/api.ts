import { apiConfig } from '../config/api';
import type { Booking, BookingDetail, Station } from '../types';
import type { MockBookingResponse } from '../types/api';
import { calculateDuration } from '../utils';
import { handleApiError, logError } from '../utils/errorUtils';

const MOCK_STATIONS: Station[] = [
  {
    id: '1',
    name: 'Berlin',
    address: 'Berlin Hauptbahnhof, Europaplatz 1, 10557 Berlin, Germany',
  },
  {
    id: '2',
    name: 'Munich',
    address: 'München Hauptbahnhof, Bayerstraße 10A, 80335 München, Germany',
  },
  {
    id: '3',
    name: 'Frankfurt',
    address:
      'Frankfurt Hauptbahnhof, Am Hauptbahnhof, 60329 Frankfurt am Main, Germany',
  },
  {
    id: '4',
    name: 'Lisbon',
    address: 'Gare do Oriente, Av. Dom João II, 1990-233 Lisboa, Portugal',
  },
  {
    id: '5',
    name: 'Barcelona',
    address:
      'Barcelona Sants, Plaça dels Països Catalans, s/n, 08014 Barcelona, Spain',
  },
  {
    id: '6',
    name: 'Lyon',
    address: 'Gare de Lyon-Part-Dieu, Bd Vivier Merle, 69003 Lyon, France',
  },
  { id: '7', name: 'station-name7', address: 'Example Station Address 7' },
];

const MOCK_STATION_BOOKINGS = {
  '1': [
    {
      id: '1',
      pickupReturnStationId: '1',
      customerName: 'Kera',
      startDate: '2021-03-13T22:04:19.032Z',
      endDate: '2021-07-17T08:51:27.402Z',
    },
    {
      id: '7',
      pickupReturnStationId: '1',
      customerName: 'Elmira Larkin Sr.',
      startDate: '2021-02-19T17:22:15.117Z',
      endDate: '2021-08-10T10:35:41.773Z',
    },
    {
      id: '51',
      pickupReturnStationId: '1',
      customerName: "Tyree O'Connell",
      startDate: '2025-04-16T02:28:00.000Z',
      endDate: '2025-04-18T01:28:00.000Z',
    },
    {
      id: '75',
      pickupReturnStationId: '1',
      customerName: 'Yolanda Corwin',
      startDate: '2025-04-11T01:45:00.000Z',
      endDate: '2025-04-26T01:45:00.000Z',
    },
    {
      id: '87',
      pickupReturnStationId: '1',
      customerName: 'Lance Schmeler',
      startDate: '2026-04-09T13:33:00.000Z',
      endDate: '2026-04-24T13:33:00.000Z',
    },
    {
      customerName: 'john doe',
      startDate: '2025-08-07',
      endDate: '2025-08-09',
      id: '100',
      pickupReturnStationId: '1',
      pickupStation: 'Berlin Hbf',
      returnStation: 'Munich Hbf',
    },
    {
      customerName: 'Alice Smith',
      startDate: '2025-08-08T10:00:00.000Z',
      endDate: '2025-08-12T18:00:00.000Z',
      id: '102',
      pickupReturnStationId: '1',
      pickupStation: 'Berlin Hbf',
      returnStation: 'Berlin Hbf',
    },
    {
      customerName: 'Bob Johnson',
      startDate: '2025-08-09T14:00:00.000Z',
      endDate: '2025-08-11T12:00:00.000Z',
      id: '103',
      pickupReturnStationId: '1',
      pickupStation: 'Berlin Hbf',
      returnStation: 'Berlin Hbf',
    },
    {
      customerName: 'Charlie Brown',
      startDate: '2025-08-10T09:00:00.000Z',
      endDate: '2025-08-17T17:00:00.000Z',
      id: '104',
      pickupReturnStationId: '1',
      pickupStation: 'Berlin Hbf',
      returnStation: 'Berlin Hbf',
    },
    {
      customerName: 'Diana Prince',
      startDate: '2025-08-06T08:00:00.000Z',
      endDate: '2025-08-13T20:00:00.000Z',
      id: '105',
      pickupReturnStationId: '1',
      pickupStation: 'Berlin Hbf',
      returnStation: 'Berlin Hbf',
    },

    {
      customerName: 'Emma Watson',
      startDate: '2025-08-12T10:00:00.000Z',
      endDate: '2025-08-15T15:00:00.000Z',
      id: '110',
      pickupReturnStationId: '1',
      pickupStation: 'Berlin Hbf',
      returnStation: 'Berlin Hbf',
    },
    {
      customerName: 'James Bond',
      startDate: '2025-08-13T08:00:00.000Z',
      endDate: '2025-08-16T18:00:00.000Z',
      id: '111',
      pickupReturnStationId: '1',
      pickupStation: 'Berlin Hbf',
      returnStation: 'Berlin Hbf',
    },
    {
      customerName: 'Sarah Connor',
      startDate: '2025-08-14T12:00:00.000Z',
      endDate: '2025-08-17T10:00:00.000Z',
      id: '112',
      pickupReturnStationId: '1',
      pickupStation: 'Berlin Hbf',
      returnStation: 'Berlin Hbf',
    },
  ],
  '2': [
    {
      id: '2',
      pickupReturnStationId: '2',
      customerName: 'Carroll Doyle',
      startDate: '2020-06-16T23:11:29.630Z',
      endDate: '2021-07-10T20:30:58.997Z',
    },
    {
      id: '8',
      pickupReturnStationId: '2',
      customerName: 'Jimmy Bogisich',
      startDate: '2021-03-26T02:40:54.086Z',
      endDate: '2021-06-14T13:30:40.341Z',
    },
    {
      customerName: 'Eva Martinez',
      startDate: '2025-08-09T12:00:00.000Z',
      endDate: '2025-08-16T15:00:00.000Z',
      id: '106',
      pickupReturnStationId: '2',
      pickupStation: 'Munich Hbf',
      returnStation: 'Munich Hbf',
    },
    {
      customerName: 'Frank Wilson',
      startDate: '2025-08-11T16:00:00.000Z',
      endDate: '2025-08-14T10:00:00.000Z',
      id: '107',
      pickupReturnStationId: '2',
      pickupStation: 'Munich Hbf',
      returnStation: 'Munich Hbf',
    },

    {
      customerName: 'Hans Mueller',
      startDate: '2025-08-13T09:00:00.000Z',
      endDate: '2025-08-16T17:00:00.000Z',
      id: '113',
      pickupReturnStationId: '2',
      pickupStation: 'Munich Hbf',
      returnStation: 'Munich Hbf',
    },
    {
      customerName: 'Anna Schmidt',
      startDate: '2025-08-14T14:00:00.000Z',
      endDate: '2025-08-17T11:00:00.000Z',
      id: '114',
      pickupReturnStationId: '2',
      pickupStation: 'Munich Hbf',
      returnStation: 'Munich Hbf',
    },
  ],
  '6': [
    {
      customerName: 'New Customer',
      startDate: '2025-08-10',
      endDate: '2025-08-15',
      id: '101',
      pickupReturnStationId: '6',
      pickupStation: 'Lyon',
      returnStation: 'Lyon',
    },
  ],
};

const seededRandom = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash) / 2147483647;
};

const getBookingStatus = (
  bookingId: string
): 'confirmed' | 'in-progress' | 'completed' | 'cancelled' => {
  const statuses = [
    'confirmed',
    'in-progress',
    'completed',
    'cancelled',
  ] as const;
  const random = seededRandom(bookingId + '_status');
  return statuses[Math.floor(random * statuses.length)];
};

const getVehicleType = (bookingId: string): string => {
  const types = [
    'Compact Campervan',
    'Family Motorhome',
    'Luxury RV',
    'Adventure Van',
    'Eco Camper',
  ];
  const random = seededRandom(bookingId + '_vehicle');
  return types[Math.floor(random * types.length)];
};

const getPrice = (bookingId: string): number => {
  const random = seededRandom(bookingId + '_price');
  return Math.floor(random * 1000) + 200;
};

const searchStations = (stations: Station[], query: string): Station[] => {
  if (!query.trim()) return stations;
  const lowercaseQuery = query.toLowerCase();
  return stations.filter(
    station =>
      station.name.toLowerCase().includes(lowercaseQuery) ||
      station.address.toLowerCase().includes(lowercaseQuery)
  );
};

const findStationById = (
  stations: Station[],
  id: string
): Station | undefined => {
  return stations.find(station => station.id === id);
};

const filterBookingsByDateRange = (
  bookings: Booking[],
  startDate: Date,
  endDate: Date
): Booking[] => {
  return bookings.filter(booking => {
    const pickupDate = new Date(booking.pickupDate);
    const returnDate = new Date(booking.returnDate);
    return (
      (pickupDate >= startDate && pickupDate <= endDate) ||
      (returnDate >= startDate && returnDate <= endDate) ||
      (pickupDate <= startDate && returnDate >= endDate)
    );
  });
};

class ApiService {
  private async fetchFromApi<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    if (apiConfig.useMock) {
      throw new Error('Mock API - use mock methods');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);

    try {
      const response = await fetch(`${apiConfig.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      const appError = handleApiError(error);
      logError(appError, `fetchFromApi: ${endpoint}`);
      throw appError;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private transformMockBooking(
    mockBooking: MockBookingResponse,
    stationName: string
  ): Booking {
    return {
      id: mockBooking.id,
      customerName: mockBooking.customerName,
      stationId: mockBooking.pickupReturnStationId,
      stationName,
      pickupDate: mockBooking.startDate,
      returnDate: mockBooking.endDate,
      duration: calculateDuration(mockBooking.startDate, mockBooking.endDate),
      status: getBookingStatus(mockBooking.id),
    };
  }

  private generateBookingDetail(booking: Booking): BookingDetail {
    return {
      ...booking,
      customerEmail: `${booking.customerName
        .toLowerCase()
        .replace(/\s+/g, '.')}@example.com`,
      vehicleType: getVehicleType(booking.id),
      totalPrice: getPrice(booking.id),
    };
  }

  async searchStations(query: string): Promise<Station[]> {
    if (apiConfig.useMock) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return searchStations(MOCK_STATIONS, query);
    }

    return this.fetchFromApi<Station[]>(
      `/stations?search=${encodeURIComponent(query)}`
    );
  }

  async getAllStations(): Promise<Station[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_STATIONS;
  }

  async getStationById(id: string): Promise<Station | null> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return findStationById(MOCK_STATIONS, id) || null;
  }

  async getBookingDetail(id: string): Promise<BookingDetail | null> {
    if (!id?.trim()) return null;

    if (apiConfig.useMock) {
      await new Promise(resolve => setTimeout(resolve, 400));

      for (const [stationId, bookings] of Object.entries(
        MOCK_STATION_BOOKINGS
      )) {
        const mockBooking = bookings.find(
          (b: MockBookingResponse) => b.id === id
        );
        if (mockBooking) {
          const station = findStationById(MOCK_STATIONS, stationId);
          const booking = this.transformMockBooking(
            mockBooking,
            station?.name || 'Unknown Station'
          );
          return this.generateBookingDetail(booking);
        }
      }
      return null;
    }

    try {
      return await this.fetchFromApi<BookingDetail>(`/bookings/${id}`);
    } catch (error) {
      const appError = handleApiError(error);
      logError(appError, `getBookingDetail: ${id}`);
      return null;
    }
  }

  async getBookingsForStation(
    stationId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Booking[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const stationBookings =
      MOCK_STATION_BOOKINGS[stationId as keyof typeof MOCK_STATION_BOOKINGS] ||
      [];
    const station = findStationById(MOCK_STATIONS, stationId);
    const stationName = station?.name || 'Unknown Station';

    const bookings = stationBookings.map((mockBooking: MockBookingResponse) =>
      this.transformMockBooking(mockBooking, stationName)
    );

    return filterBookingsByDateRange(bookings, startDate, endDate);
  }
}

export const apiService = new ApiService();

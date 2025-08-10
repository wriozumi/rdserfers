import type { Booking, BookingDetail, Station } from "../types";
import { calculateDuration } from "../utils";
import {
  filterBookingsByDateRange,
  findStationById,
  searchStations,
} from "../utils/dataUtils";

const MOCK_STATIONS: Station[] = [
  {
    id: "1",
    name: "Berlin",
    address: "Berlin Hauptbahnhof, Europaplatz 1, 10557 Berlin, Germany",
  },
  {
    id: "2",
    name: "Munich",
    address: "München Hauptbahnhof, Bayerstraße 10A, 80335 München, Germany",
  },
  {
    id: "3",
    name: "Frankfurt",
    address:
      "Frankfurt Hauptbahnhof, Am Hauptbahnhof, 60329 Frankfurt am Main, Germany",
  },
  {
    id: "4",
    name: "Lisbon",
    address: "Gare do Oriente, Av. Dom João II, 1990-233 Lisboa, Portugal",
  },
  {
    id: "5",
    name: "Barcelona",
    address:
      "Barcelona Sants, Plaça dels Països Catalans, s/n, 08014 Barcelona, Spain",
  },
  {
    id: "6",
    name: "Lyon",
    address: "Gare de Lyon-Part-Dieu, Bd Vivier Merle, 69003 Lyon, France",
  },
  { id: "7", name: "station-name7", address: "Example Station Address 7" },
];

const MOCK_STATION_BOOKINGS = {
  "1": [
    {
      id: "1",
      pickupReturnStationId: "1",
      customerName: "Kera",
      startDate: "2021-03-13T22:04:19.032Z",
      endDate: "2021-07-17T08:51:27.402Z",
    },
    {
      id: "7",
      pickupReturnStationId: "1",
      customerName: "Elmira Larkin Sr.",
      startDate: "2021-02-19T17:22:15.117Z",
      endDate: "2021-08-10T10:35:41.773Z",
    },
    {
      id: "51",
      pickupReturnStationId: "1",
      customerName: "Tyree O'Connell",
      startDate: "2025-04-16T02:28:00.000Z",
      endDate: "2025-04-18T01:28:00.000Z",
    },
    {
      id: "75",
      pickupReturnStationId: "1",
      customerName: "Yolanda Corwin",
      startDate: "2025-04-11T01:45:00.000Z",
      endDate: "2025-04-26T01:45:00.000Z",
    },
    {
      id: "87",
      pickupReturnStationId: "1",
      customerName: "Lance Schmeler",
      startDate: "2026-04-09T13:33:00.000Z",
      endDate: "2026-04-24T13:33:00.000Z",
    },
    {
      customerName: "john doe",
      startDate: "2025-08-07",
      endDate: "2025-08-09",
      id: "100",
      pickupReturnStationId: "1",
      pickupStation: "Berlin Hbf",
      returnStation: "Munich Hbf",
    },
    {
      customerName: "Alice Smith",
      startDate: "2025-08-08T10:00:00.000Z",
      endDate: "2025-08-12T18:00:00.000Z",
      id: "102",
      pickupReturnStationId: "1",
      pickupStation: "Berlin Hbf",
      returnStation: "Berlin Hbf",
    },
    {
      customerName: "Bob Johnson",
      startDate: "2025-08-09T14:00:00.000Z",
      endDate: "2025-08-11T12:00:00.000Z",
      id: "103",
      pickupReturnStationId: "1",
      pickupStation: "Berlin Hbf",
      returnStation: "Berlin Hbf",
    },
    {
      customerName: "Charlie Brown",
      startDate: "2025-08-10T09:00:00.000Z",
      endDate: "2025-08-17T17:00:00.000Z",
      id: "104",
      pickupReturnStationId: "1",
      pickupStation: "Berlin Hbf",
      returnStation: "Berlin Hbf",
    },
    {
      customerName: "Diana Prince",
      startDate: "2025-08-06T08:00:00.000Z",
      endDate: "2025-08-13T20:00:00.000Z",
      id: "105",
      pickupReturnStationId: "1",
      pickupStation: "Berlin Hbf",
      returnStation: "Berlin Hbf",
    },
  ],
  "2": [
    {
      id: "2",
      pickupReturnStationId: "2",
      customerName: "Carroll Doyle",
      startDate: "2020-06-16T23:11:29.630Z",
      endDate: "2021-07-10T20:30:58.997Z",
    },
    {
      id: "8",
      pickupReturnStationId: "2",
      customerName: "Jimmy Bogisich",
      startDate: "2021-03-26T02:40:54.086Z",
      endDate: "2021-06-14T13:30:40.341Z",
    },
    {
      customerName: "Eva Martinez",
      startDate: "2025-08-09T12:00:00.000Z",
      endDate: "2025-08-16T15:00:00.000Z",
      id: "106",
      pickupReturnStationId: "2",
      pickupStation: "Munich Hbf",
      returnStation: "Munich Hbf",
    },
    {
      customerName: "Frank Wilson",
      startDate: "2025-08-11T16:00:00.000Z",
      endDate: "2025-08-14T10:00:00.000Z",
      id: "107",
      pickupReturnStationId: "2",
      pickupStation: "Munich Hbf",
      returnStation: "Munich Hbf",
    },
  ],
  "6": [
    {
      customerName: "New Customer",
      startDate: "2025-08-10",
      endDate: "2025-08-15",
      id: "101",
      pickupReturnStationId: "6",
      pickupStation: "Lyon",
      returnStation: "Lyon",
    },
  ],
};

class ApiService {
  private transformMockBooking(mockBooking: any, stationName: string): Booking {
    const pickupDate = mockBooking.startDate;
    const returnDate = mockBooking.endDate;
    const duration = calculateDuration(pickupDate, returnDate);

    return {
      id: mockBooking.id,
      customerName: mockBooking.customerName,
      stationId: mockBooking.pickupReturnStationId,
      stationName: stationName,
      pickupDate: pickupDate,
      returnDate: returnDate,
      duration: duration,
      status: this.getRandomStatus(),
    };
  }

  private getRandomStatus():
    | "confirmed"
    | "in-progress"
    | "completed"
    | "cancelled" {
    const statuses = [
      "confirmed",
      "in-progress",
      "completed",
      "cancelled",
    ] as const;
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private generateMockBookingDetail(booking: Booking): BookingDetail {
    return {
      ...booking,
      customerEmail: `${booking.customerName
        .toLowerCase()
        .replace(/\s+/g, ".")}@example.com`,
      vehicleType: this.getRandomVehicleType(),
      totalPrice: Math.floor(Math.random() * 1000) + 200,
    };
  }

  private getRandomVehicleType(): string {
    const types = [
      "Compact Campervan",
      "Family Motorhome",
      "Luxury RV",
      "Adventure Van",
      "Eco Camper",
    ];
    return types[Math.floor(Math.random() * types.length)];
  }

  async searchStations(query: string): Promise<Station[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      return searchStations(MOCK_STATIONS, query);
    } catch (error) {
      console.error("Error searching stations:", error);
      return [];
    }
  }

  async getAllStations(): Promise<Station[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      return MOCK_STATIONS;
    } catch (error) {
      console.error("Error fetching all stations:", error);
      return [];
    }
  }

  async getStationById(id: string): Promise<Station | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
      return findStationById(MOCK_STATIONS, id) || null;
    } catch (error) {
      console.error("Error fetching station:", error);
      return null;
    }
  }

  async getBookingDetail(id: string): Promise<BookingDetail | null> {
    console.log("🔍 API: Getting booking detail for ID:", id);

    await new Promise((resolve) => setTimeout(resolve, 400));

    try {
      for (const [stationId, bookings] of Object.entries(
        MOCK_STATION_BOOKINGS
      )) {
        console.log(
          `🔎 Searching in station ${stationId} with ${bookings.length} bookings`
        );
        const mockBooking = bookings.find((b: any) => b.id === id);
        if (mockBooking) {
          console.log("📋 Found mock booking:", mockBooking);
          const station = MOCK_STATIONS.find((s) => s.id === stationId);
          const booking = this.transformMockBooking(
            mockBooking,
            station?.name || "Unknown Station"
          );
          console.log("🔄 Transformed booking:", booking);
          const detail = this.generateMockBookingDetail(booking);
          console.log("✅ Generated booking detail:", detail);
          return detail;
        }
      }
      console.log("❌ Booking not found in any station");
      return null;
    } catch (error) {
      console.error("❌ Error fetching booking detail:", error);
      return null;
    }
  }

  async getBookingsForStation(
    stationId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Booking[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const stationBookings =
        MOCK_STATION_BOOKINGS[
          stationId as keyof typeof MOCK_STATION_BOOKINGS
        ] || [];
      const station = findStationById(MOCK_STATIONS, stationId);
      const stationName = station?.name || "Unknown Station";

      const bookings = stationBookings.map((mockBooking: any) =>
        this.transformMockBooking(mockBooking, stationName)
      );

      return filterBookingsByDateRange(bookings, startDate, endDate);
    } catch (error) {
      console.error("Error fetching bookings for station:", error);
      return [];
    }
  }

  async rescheduleBooking(
    bookingId: string,
    newPickupDate: string,
    newReturnDate: string
  ): Promise<boolean> {
    console.log("🔄 Mock API Call - Reschedule Booking:", {
      bookingId,
      newPickupDate,
      newReturnDate,
      endpoint: `PUT https://api.roadsurfer.com/bookings/${bookingId}`,
      payload: {
        pickupDate: newPickupDate,
        returnDate: newReturnDate,
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 800));

    return Math.random() > 0.1;
  }
}

export const apiService = new ApiService();

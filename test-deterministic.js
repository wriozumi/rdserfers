// Quick test to verify deterministic behavior
import { ApiService } from "./src/services/api.js";

const api = new ApiService();

async function testDeterministicValues() {
  console.log("Testing deterministic booking values...");

  // Test the same booking ID multiple times
  const bookingId = "1";

  console.log("\n=== Testing booking ID:", bookingId, "===");

  for (let i = 0; i < 3; i++) {
    console.log(`\n--- Attempt ${i + 1} ---`);
    const booking = await api.getBookingDetail(bookingId);
    if (booking) {
      console.log("Status:", booking.status);
      console.log("Total Price:", booking.totalPrice);
      console.log("Vehicle Type:", booking.vehicleType);
    } else {
      console.log("Booking not found");
    }
  }
}

testDeterministicValues().catch(console.error);

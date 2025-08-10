// Debug script to test API functionality
import { apiService } from './src/services/api.ts';

console.log('🔍 Testing API Service...');

// Test search functionality
async function testSearch() {
  try {
    console.log('Testing station search...');
    const results = await apiService.searchStations('Berlin');
    console.log('Search results for "Berlin":', results);
    
    const allStations = await apiService.getAllStations();
    console.log('All stations:', allStations);
    
    if (allStations.length > 0) {
      const testStationId = allStations[0].id;
      console.log(`Testing bookings for station ${testStationId}...`);
      
      const startDate = new Date('2025-08-07');
      const endDate = new Date('2025-08-14');
      
      const bookings = await apiService.getBookingsForStation(testStationId, startDate, endDate);
      console.log('Bookings:', bookings);
    }
  } catch (error) {
    console.error('API Test Error:', error);
  }
}

testSearch();

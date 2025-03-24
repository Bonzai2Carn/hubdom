// mobile/src/services/NearbyLocation.ts
// Compatibility file to avoid breaking existing imports that use this file

import {
  LocationService,
  LocationStatus,
  LocationCoordinates
} from './locationService';

// Re-export the types that were previously in this file
export {
  LocationStatus,
  LocationCoordinates
};

// Export the LocationService class to maintain backward compatibility
// This ensures that any code that was using
// LocationService.getInstance() will continue to work
export { LocationService };
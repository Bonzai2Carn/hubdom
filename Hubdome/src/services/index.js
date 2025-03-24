// mobile/src/services/index.js
// This file exports all services consistently to maintain compatibility

// Export from LocationService.ts
export {
    LocationService,
    LocationCoordinates,
    LocationStatus,
    LocationData,
    ReverseGeocodeAddress,
    getCurrentLocation,
    updateUserLocation,
    geocodeAddress,
    reverseGeocodeLocation,
    calculateDistance
  } from './locationService';
  
  // Also export the compatibility functions from locationService.ts
  export {
    LocationSettings,
    NearbyQueryParams,
    updateLocationSharingSettings,
    getNearbyEvents,
    getNearbyHobbies
  } from './locationService';
  
  // API Services
  export { default as API } from './api';
  
  // Auth Services
  export {
    login,
    register,
    socialAuth,
    getCurrentUser
  } from './authService';
  
  // Event Services
  export {
    getAllEvents,
    getEvent,
    getEventsByHobbyType,
    getUserEvents,
    createEvent, 
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
    toggleAttendance
  } from './eventService';
  
  // Hobby Services
  export {
    getAllHobbies,
    getHobby,
    createHobby,
    updateHobby,
    deleteHobby,
    getNearbyHobbies as getHobbiesNearby,
    getPopularHobbies,
    joinHobby,
    leaveHobby
  } from './hobbyService';
  
  // This ensures that all services can be imported from a single location
  // instead of importing from individual files, which makes maintenance easier.
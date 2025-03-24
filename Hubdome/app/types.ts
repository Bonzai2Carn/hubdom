// Navigation types for the application

// Root navigation stack param list
export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  App: undefined;
  
  // Main screens that can be navigated to from any stack
  EventDetail: { eventId: string };
  HobbyDetail: { hobbyId: string };
  UserProfile: { userId: string };
  CreateEvent: undefined;
  EditEvent: { eventId: string };
  LocationSettings: undefined;
  Notifications: undefined;
  Map: { initialLocation?: [number, number] };
};

// Auth stack param list
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main app tab navigation param list
export type MainTabsParamList = {
  Home: undefined;
  Discover: undefined;
  Map: undefined; 
  Events: undefined;
  Teams: undefined;
  Profile: undefined;
};

// Hobby navigator stack param list
export type HobbyStackParamList = {
  HobbyList: undefined;
  CreateHobby: undefined;
  HobbyDetail: { id: string };
  HobbyCategory: { category: string };
};
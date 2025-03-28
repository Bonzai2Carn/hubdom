// mobile/src/types/models.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  hobbies?: string[];
}

export interface Hobby {
  id: string;
  name: string;
  description: string;
  category?: string;
  image?: string;
  tags?: string[];
  members: string[];
  isJoined?: boolean;
  popularity?: number;
  eventsCount?: number;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  hobby: Hobby;
  organizer: User;
  location: {
    formattedAddress: string;
    coordinates: [number, number];
  };
  startDate: string;
  endDate: string;
  capacity: number;
  participants: User[];
}

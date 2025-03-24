// mobile/src/types/models.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface Hobby {
  id: string;
  name: string;
  description: string;
  category?: string;
  image?: string;
  tags?: string[];
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

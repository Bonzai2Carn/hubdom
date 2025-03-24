-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  bio TEXT,
  avatar VARCHAR(255) DEFAULT 'default-avatar.jpg',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Hobbies Table
CREATE TABLE hobbies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'Other',
  image VARCHAR(255) DEFAULT 'no-photo.jpg',
  popularity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Hobby Tags Table
CREATE TABLE hobby_tags (
  id SERIAL PRIMARY KEY,
  hobby_id INTEGER REFERENCES hobbies(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  UNIQUE(hobby_id, tag)
);

-- User Hobbies Junction Table
CREATE TABLE user_hobbies (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  hobby_id INTEGER REFERENCES hobbies(id) ON DELETE CASCADE,
  proficiency_level VARCHAR(20) DEFAULT 'beginner',
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, hobby_id)
);

-- Events Table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  hobby_id INTEGER REFERENCES hobbies(id) ON DELETE SET NULL,
  organizer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  location_address TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  capacity INTEGER DEFAULT 10,
  is_private BOOLEAN DEFAULT FALSE,
  image VARCHAR(255) DEFAULT 'no-photo.jpg',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Event Participants Junction Table
CREATE TABLE event_participants (
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'going', -- going, interested, not_going
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

-- Venues Table
CREATE TABLE venues (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  website VARCHAR(255),
  image VARCHAR(255) DEFAULT 'no-photo.jpg',
  created_at TIMESTAMP DEFAULT NOW()
);

-- PostgreSQL Schema

-- User Profiles
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  bio TEXT,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  logo TEXT,
  area TEXT,
  zone TEXT,
  created_by TEXT NOT NULL REFERENCES user_profiles(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event Participants
CREATE TABLE event_participants (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES user_profiles(user_id),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, user_id)
);

-- Teams
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_by TEXT NOT NULL REFERENCES user_profiles(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Members
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES user_profiles(user_id),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, user_id)
);

-- Notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user_profiles(user_id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event Subscriptions
CREATE TABLE event_subscriptions (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES user_profiles(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, user_id)
);

-- Equipment Table
CREATE TABLE equipment (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT TRUE,
  daily_rate DECIMAL(10, 2),
  image VARCHAR(255) DEFAULT 'no-photo.jpg',
  created_at TIMESTAMP DEFAULT NOW()
);
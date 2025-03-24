// // src/redux/reducers/eventReducer.ts
// import { createSlice } from "@reduxjs/toolkit";
// import {
//   getAllEvents,
//   getEventById,
//   toggleEventAttendance,
//   createEvent,
// } from "../actions/eventActions";

// interface EventState {
//   events: any[];
//   currentEvent: any | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: EventState = {
//   events: [],
//   currentEvent: null,
//   loading: false,
//   error: null,
// };

// const eventSlice = createSlice({
//   name: "events",
//   initialState,
//   reducers: {
//     clearEventError: (state) => {
//       state.error = null;
//     },
//     clearCurrentEvent: (state) => {
//       state.currentEvent = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Get all events
//       .addCase(getAllEvents.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getAllEvents.fulfilled, (state, action) => {
//         state.loading = false;
//         state.events = action.payload;
//       })
//       .addCase(getAllEvents.rejected, (state, action: any) => {
//         state.loading = false;
//         state.error = action.payload?.error || "Failed to fetch events";
//       })

//       // Get event by ID
//       .addCase(getEventById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getEventById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentEvent = action.payload;
//       })
//       .addCase(getEventById.rejected, (state, action: any) => {
//         state.loading = false;
//         state.error = action.payload?.error || "Failed to fetch event";
//       })

//       // Toggle event attendance
//       .addCase(toggleEventAttendance.fulfilled, (state, action) => {
//         state.currentEvent = action.payload;

//         // Also update the event in the events array
//         const index = state.events.findIndex(
//           (event) => event.id === action.payload.id
//         );
//         if (index !== -1) {
//           state.events[index] = action.payload;
//         }
//       })

//       // Create event
//       .addCase(createEvent.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createEvent.fulfilled, (state, action) => {
//         state.loading = false;
//         state.events = [action.payload, ...state.events];
//         state.currentEvent = action.payload;
//       })
//       .addCase(createEvent.rejected, (state, action: any) => {
//         state.loading = false;
//         state.error = action.payload?.error || "Failed to create event";
//       });
//   },
// });

// export const { clearEventError, clearCurrentEvent } = eventSlice.actions;

// export default eventSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  getNearbyEvents,
  getUserEvents,
  getHobbyEvents,
} from "../actions/eventActions";

// Initial state
const initialState = {
  events: [],
  event: null,
  nearbyEvents: [],
  userEvents: [],
  hobbyEvents: [],
  loading: false,
  error: null,
  success: false,
};

// Create the event slice
const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentEvent: (state) => {
      state.event = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all events
      .addCase(getAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch events";
      })

      // Get a single event
      .addCase(getEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
      })
      .addCase(getEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch event";
      })

      // Create an event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.events.push(action.payload);
        state.event = action.payload;
        state.userEvents.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to create event";
      })

      // Update an event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        
        // Update event in the events array
        const index = state.events.findIndex(
          (event) => event.id === action.payload.id
        );
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        
        // Update in userEvents if present
        const userEventIndex = state.userEvents.findIndex(
          (event) => event.id === action.payload.id
        );
        if (userEventIndex !== -1) {
          state.userEvents[userEventIndex] = action.payload;
        }
        
        // Update in hobbyEvents if present
        const hobbyEventIndex = state.hobbyEvents.findIndex(
          (event) => event.id === action.payload.id
        );
        if (hobbyEventIndex !== -1) {
          state.hobbyEvents[hobbyEventIndex] = action.payload;
        }
        
        // Update in nearbyEvents if present
        const nearbyEventIndex = state.nearbyEvents.findIndex(
          (event) => event.id === action.payload.id
        );
        if (nearbyEventIndex !== -1) {
          state.nearbyEvents[nearbyEventIndex] = action.payload;
        }
        
        // Update current event if it matches the updated one
        if (state.event && state.event.id === action.payload.id) {
          state.event = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to update event";
      })

      // Delete an event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        
        // Remove the event from all event arrays
        const filteredEvents = (events) => 
          events.filter((event) => event.id !== action.payload.id);
        
        state.events = filteredEvents(state.events);
        state.userEvents = filteredEvents(state.userEvents);
        state.hobbyEvents = filteredEvents(state.hobbyEvents);
        state.nearbyEvents = filteredEvents(state.nearbyEvents);
        
        // Clear current event if it matches the deleted one
        if (state.event && state.event.id === action.payload.id) {
          state.event = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to delete event";
      })

      // Join an event
      .addCase(joinEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinEvent.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update event with new participant data
        const updateEventInArray = (events) => {
          return events.map((event) => {
            if (event.id === action.payload.id) {
              return action.payload;
            }
            return event;
          });
        };
        
        state.events = updateEventInArray(state.events);
        state.nearbyEvents = updateEventInArray(state.nearbyEvents);
        state.hobbyEvents = updateEventInArray(state.hobbyEvents);
        
        // Add to user events if not already present
        const userEventExists = state.userEvents.some(
          (event) => event.id === action.payload.id
        );
        if (!userEventExists) {
          state.userEvents.push(action.payload);
        } else {
          state.userEvents = updateEventInArray(state.userEvents);
        }
        
        // Update current event if it matches
        if (state.event && state.event.id === action.payload.id) {
          state.event = action.payload;
        }
      })
      .addCase(joinEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to join event";
      })

      // Leave an event
      .addCase(leaveEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveEvent.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update event with new participant data
        const updateEventInArray = (events) => {
          return events.map((event) => {
            if (event.id === action.payload.id) {
              return action.payload;
            }
            return event;
          });
        };
        
        state.events = updateEventInArray(state.events);
        state.nearbyEvents = updateEventInArray(state.nearbyEvents);
        state.hobbyEvents = updateEventInArray(state.hobbyEvents);
        
        // Remove from user events if user is no longer a participant
        state.userEvents = state.userEvents.filter(
          (event) => event.id !== action.payload.id
        );
        
        // Update current event if it matches
        if (state.event && state.event.id === action.payload.id) {
          state.event = action.payload;
        }
      })
      .addCase(leaveEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to leave event";
      })

      // Get nearby events
      .addCase(getNearbyEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNearbyEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyEvents = action.payload;
      })
      .addCase(getNearbyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch nearby events";
      })

      // Get user events
      .addCase(getUserEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.userEvents = action.payload;
      })
      .addCase(getUserEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch user events";
      })

      // Get hobby events
      .addCase(getHobbyEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHobbyEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.hobbyEvents = action.payload;
      })
      .addCase(getHobbyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch hobby events";
      });
  },
});

// Export actions
export const { clearError, clearSuccess, clearCurrentEvent } = eventSlice.actions;

// Export reducer
export default eventSlice.reducer;
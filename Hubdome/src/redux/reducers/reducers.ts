// src/redux/reducers/reducers.ts
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import hobbyReducer from "./hobbyReducer";
import eventReducer from "./eventReducer";

const rootReducer = combineReducers({
  user: userReducer,
  hobby: hobbyReducer,
  events: eventReducer,
  // Add other reducers here as needed
});

export default rootReducer;

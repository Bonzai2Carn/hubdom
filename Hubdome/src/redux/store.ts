// src/redux/store.ts
import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Import reducers
import authReducer from './slices/authSlice';
import hobbyReducer from './slices/hobbySlice';
import eventReducer from './slices/eventSlice';
import userReducer from './slices/userSlice';

// Logger middleware for development
const logger: Middleware = store => next => action => {
  if (__DEV__) {
    console.group(action.type);
    console.info('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    console.groupEnd();
    return result;
  }
  return next(action);
};

// Create root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  hobby: hobbyReducer,
  event: eventReducer,
  user: userReducer,
});

// Configure store with middleware
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in specific paths
        ignoredActions: [
          'auth/login/fulfilled', 
          'auth/register/fulfilled', 
          'auth/socialLogin/fulfilled',
          'auth/logout/fulfilled'
        ],
        ignoredActionPaths: ['payload.headers', 'payload.config', 'meta.arg'],
        ignoredPaths: [],
      },
    }).concat(logger),
  devTools: __DEV__,
});

// Root state type
export type RootState = ReturnType<typeof store.getState>;

// Dispatch type
export type AppDispatch = typeof store.dispatch;

// Custom hooks with types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
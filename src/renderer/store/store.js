import { configureStore } from '@reduxjs/toolkit';
import webSocketReducer from './slices/webSocketSlice';

export const store = configureStore({
  reducer: {
    webSocket: webSocketReducer,
    // Add your other reducers here as you create them
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'webSocket/setWebSocketConnectionStatus',
        ],
        ignoredPaths: [
          'webSocket.websocketConnected',
        ],
      },
    }),
});

/* 
// If using TypeScript, move these to a .ts file:
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
*/

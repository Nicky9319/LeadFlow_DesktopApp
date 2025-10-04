import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnectedToMobile: false,
};

const webSocketSlice = createSlice({
  name: 'webSocket',
  initialState,
  reducers: {
    handleMobileConnectRequest: (state, action) => {
      state.isConnectedToMobile = true;
      console.log('[WebSocket Slice] Mobile connect request handled:', action.payload);
    },
    handleMobileDisconnect: (state, action) => {
      state.isConnectedToMobile = false;
      console.log('[WebSocket Slice] Mobile disconnect handled:', action.payload);
    },
    resetMobileConnection: (state) => {
      state.isConnectedToMobile = false;
    }
  }
});

export const { 
  handleMobileConnectRequest, 
  handleMobileDisconnect,
  resetMobileConnection 
} = webSocketSlice.actions;

export default webSocketSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isAuthenticated: false,
    isActive: false,
    email: null,
    fullName: null,
    accessToken: null,
    refreshToken: null,
    role: null,
  };

const userAuthSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
      setUser: (state, action) => {
        console.log('setUser reducere called...');
        
        state.isAuthenticated = true;
        state.isActive = action.payload.isActive;
        state.email = action.payload.email;
        state.fullName = action.payload.fullName || null;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.role = action.payload.role;
        
      },
      refreshTokens: (state, action) => {
        console.log('refreshTokens reducer called...');
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
      },
      logout: (state) => {
        console.log('logout reducer called...');

        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isActive = false;
        state.email = null;
        state.fullName = null;
        state.role = null;
      }
      },
    });
  
export const {setUser, refreshTokens, logout} = userAuthSlice.actions;

export default userAuthSlice.reducer;
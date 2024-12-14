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
        console.log('setUser reducere called');
        
        state.isAuthenticated = true;
        state.isActive = action.payload.isActive;
        state.email = action.payload.email;
        state.fullName = action.payload.fullName || null;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.role = action.payload.role;
        
      },
      logout: (state) => {
        console.log('inside logout reducer');

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
  
export const {setUser, logout} = userAuthSlice.actions;

export default userAuthSlice.reducer;
//get createSlice from reduxjs toolkit
import { createSlice } from "@reduxjs/toolkit";

//Initial state
const initialAuthState = {
  token: null,
  isAuthenticated: false,
  errorEmailMsg: "",
  errorPasswordMsg: "",
  userEmail: "",
};

//Create authSlice
const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    //set authentication action
    setAuth: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.errorEmailMsg = "";
      state.errorPasswordMsg = "";
      state.userEmail = action.payload.userEmail;
    },
    //When error authentication set errors messages
    setAuthErrorMsg: (state, action) => {
      state.isAuthenticated = false;
      state.token = null;
      state.errorEmailMsg = action.payload.email;
      state.errorPasswordMsg = action.payload.password;
    },
    //When logout user
    setLogout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userEmail = "";
    },
  },
});

//Export authSlice actions object
export const authActions = authSlice.actions;

//Export auth reducer
export default authSlice.reducer;

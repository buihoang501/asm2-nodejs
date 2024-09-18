//import configureStore from @reduxjs tookit
import { configureStore } from "@reduxjs/toolkit";

//import authSlice reducer
import authSlice from "./reducers/authReducer";

//create store
const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

//export store
export default store;

//import configureStore from @reduxjs tookit
import { configureStore } from "@reduxjs/toolkit";

//import authSlice reducer
import authSlice from "./reducers/authReducer";

//import hotelSlice reducer
import hotelSlice from "./reducers/hotelReducer";

//create store
const store = configureStore({
  reducer: {
    auth: authSlice,
    hotel: hotelSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

//export store
export default store;

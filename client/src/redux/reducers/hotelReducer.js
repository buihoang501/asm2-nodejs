//get createSlice from reduxjs toolkit
import { createSlice } from "@reduxjs/toolkit";

//Initial state
const initialHotelState = {
  searchData: null,
  hotels: [],
  suitableRooms: [],
  hotel: null,
  transactions: [],
};

//Create hotelSlice
const hotelSlice = createSlice({
  name: "hotel",
  initialState: initialHotelState,
  reducers: {
    //Searching
    setFindHotels: (state, action) => {
      state.hotels = action.payload.hotels;
      state.suitableRooms = action.payload.suitableRooms;
    },
    //Detail hotel data
    setDetailHotel: (state, action) => {
      state.hotel = action.payload.hotel;
      state.transactions = action.payload.transactions;
    },

    //Saving searching data in homepage
    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },
  },
});

//Export hotel actions
export const hotelActions = hotelSlice.actions;

//Export hotelSlice reducer
export default hotelSlice.reducer;

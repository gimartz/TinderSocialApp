// locationSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import store from '..';

interface LocationState {
  loading: boolean;
  error: string | null;
  success: boolean;
  data: any; // You can define a more specific type based on your API response
}

const initialState: LocationState = {
  loading: false,
  error: null,
  success: false,
  data: null,
};

// Define the async thunk for updating the location
export const updateLocation = createAsyncThunk(
  'location/updateLocation',
  async (
    locationData: {address: string; latitude: string; longitude: string},
    {rejectWithValue},
  ) => {
    const myHeaders = new Headers();
    const state = store.getState();
    const userInfo = state.auth?.token;
    myHeaders.append('Authorization', `Bearer ${userInfo}`);
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify(locationData);

    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        'https://speedit-server.onrender.com/v1/api/restaurants/location',
        requestOptions,
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log('Update Location Response:', result);
      return result; // Return the result to the fulfilled action
    } catch (error: any) {
      console.error('Error updating location:', error);
      return rejectWithValue(error.message); // Handle errors
    }
  },
);

// Create the slice
const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    resetLocationState: state => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.data = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(updateLocation.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload.data; // Store the data from the response
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Store the error message
      });
  },
});

// Export actions and reducer
export const {resetLocationState} = locationSlice.actions;
export default locationSlice.reducer;

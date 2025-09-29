// src/features/restaurant/restaurantCategorySlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../service';
// import Client from '../../Api';

export const fetchRestaurantCategory = createAsyncThunk(
  'restaurant/fetchRestaurantCategory',
  async ({restaurantId}: {restaurantId?: string}, {rejectWithValue}) => {
    const url = restaurantId
      ? `/categories?restaurantId=${restaurantId}`
      : '/categories';
    try {
      const response = await apiClient.get(url);
      // console.log('Fetch restaurant categories response:', response);
      return response.data; // Assuming the API returns the profile data
    } catch (error: any) {
      // console.log('category fetch error:', error, error.response);
      let errorMessage = 'An unexpected error occurred';
      if (error.response && error.response.data) {
        errorMessage =
          error.response.data.message || JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  },
);

// Async thunk for creating a new restaurant category
export const createRestaurantCategory = createAsyncThunk(
  'restaurant/createRestaurantCategory',
  async (
    data: {profileData: {name: string; icon: string}},
    {rejectWithValue},
  ) => {
    try {
      const response = await apiClient.put('/categories', data);
      return response.data; // Or response.data if your API returns JSON
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred';
      if (error.response && error.response.data) {
        // Assuming error response might have a message field
        errorMessage =
          error.response.data.message || JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  },
);

export const updateRestaurantCategory = createAsyncThunk(
  'restaurant/updateRestaurantCategory',
  async (
    data: {profileData: {name: string; icon: string}},
    {rejectWithValue},
  ) => {
    try {
      const response = await apiClient.put('/categories', data);
      return response.data; // Or response.data if your API returns JSON
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred';
      if (error.response && error.response.data) {
        // Assuming error response might have a message field
        errorMessage =
          error.response.data.message || JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  },
);

export const deleteRestaurantCategory = createAsyncThunk(
  'restaurant/deleteRestaurantCategory',
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiClient.put('/categories');
      // console.log('Status update response:', response);
      return response.data; // Should return the updated restaurant object or a success message
    } catch (error) {
      return rejectWithValue(error || 'Failed to update status');
    }
  },
);

type InitialState = {
  restaurant_category: {};
  restaurant_categories: {
    id: string;
    name: string;
    icon: string;
    description: string | null;
    isActive: boolean;
    sortOrder: number;
  }[];
  selected_restaurant_categories: [];
  is_loading_restaurant_category: boolean;
  is_creating_restaurant_category: boolean;
  is_updating_restaurant_category: boolean;
  is_deleting_restaurant_category: boolean;
};

const initialState: InitialState = {
  restaurant_category: {},
  restaurant_categories: [],
  selected_restaurant_categories: [],
  is_loading_restaurant_category: false,
  is_creating_restaurant_category: false,
  is_updating_restaurant_category: false,
  is_deleting_restaurant_category: false,
};

const restaurantCategorySlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    // resetUpdateStatus: state => {
    //   state.status = 'idle';
    //   state.error = null;
    // },
  },
  extraReducers: builder => {
    builder
      .addCase(updateRestaurantCategory.pending, state => {
        state.is_updating_restaurant_category = true;
      })
      .addCase(updateRestaurantCategory.fulfilled, (state, action) => {
        console.log('Updated Restaurant category:', action.payload);
        state.is_updating_restaurant_category = false;
        state.restaurant_category = action.payload.data;
      })
      .addCase(updateRestaurantCategory.rejected, (state, action) => {
        state.is_updating_restaurant_category = false;
      })
      .addCase(fetchRestaurantCategory.pending, state => {
        state.is_loading_restaurant_category = true;
      })
      .addCase(fetchRestaurantCategory.fulfilled, (state, action) => {
        console.log('Fetched restaurant categories []:', action.payload);
        state.is_loading_restaurant_category = false;
        state.restaurant_categories = action.payload.data;
      })
      .addCase(fetchRestaurantCategory.rejected, (state, action) => {
        state.is_loading_restaurant_category = false;
      })
      .addCase(createRestaurantCategory.pending, state => {
        state.is_creating_restaurant_category = true;
      })
      .addCase(createRestaurantCategory.fulfilled, (state, action) => {
        state.is_creating_restaurant_category = false;
        state.restaurant_category = action.payload.data;
      })
      .addCase(createRestaurantCategory.rejected, (state, action) => {
        state.is_creating_restaurant_category = false;
      });
  },
});

// export const {resetUpdateStatus} = restaurantCategorySlice.actions;
export default restaurantCategorySlice.reducer;

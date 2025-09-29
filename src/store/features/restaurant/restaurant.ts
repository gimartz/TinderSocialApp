// src/features/restaurant/restaurantSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../service';

export const fetchRestaurantProfile = createAsyncThunk(
  'restaurant/fetchProfile',
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiClient.get('/profile');
      // console.log('Profile response:', response);
      return response.data; // Assuming the API returns the profile data
    } catch (error: any) {
      let errorMessage = 'Failed to fetch profile';
      if (error.response && error.response.data) {
        // Assuming error response might have a message field
        errorMessage =
          JSON.stringify(error.response.data.message) ||
          JSON.stringify(error.response.data.error) ||
          JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  },
);

// Async thunk for updating the restaurant profile
export const updateRestaurantProfile = createAsyncThunk(
  'restaurant/updateProfile',
  async (
    profileData: {
      name: string;
      description: string;
      deliveryFee: string | number;
      averagePrepTime: string | number;
      cuisines: string[];
      prefersCash: boolean;
      openingHours: {};
    },
    {rejectWithValue},
  ) => {
    try {
      // The `raw` data structure from your example
      const payload = {
        name: profileData.name,
        description: profileData.description,
        deliveryFee: Number(profileData.deliveryFee) || 0,
        averagePrepTime: Number(profileData.averagePrepTime) || 0,
        cuisines: profileData.cuisines, // Assuming comma-separated input
        prefersCash: profileData.prefersCash,
        openingHours: profileData.openingHours || {},
      };
      const response = await apiClient.put('/profile', payload);
      return response.data;
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred';
      if (error.response && error.response.data) {
        // Assuming error response might have a message field
        errorMessage =
          JSON.stringify(error.response.data.message) ||
          JSON.stringify(error.response.data.error) ||
          JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  },
);

export const updateRestaurantStatus = createAsyncThunk(
  'restaurant/updateRestaurantIsActiveStatus', // for setting isActive boolean between true and false
  async ({isActive}: {isActive: boolean}, {rejectWithValue}) => {
    try {
      const response = await apiClient.put('/status', {isActive});
      return response.data; // Should return the updated restaurant object or a success message
    } catch (error: any) {
      let errorMessage = 'Failed to update status';
      if (error.response && error.response.data) {
        // Assuming error response might have a message field
        errorMessage =
          JSON.stringify(error.response.data.message) ||
          JSON.stringify(error.response.data.error) ||
          JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  },
);
export const initiateRestaurantPasswordReset = createAsyncThunk(
  'restaurant/initiateRestaurantPasswordReset',
  async (
    {
      currentPassword,
      newPassword,
    }: {currentPassword: string; newPassword: string},
    {rejectWithValue},
  ) => {
    try {
      const response = await apiClient.post('/me/password/initiate-reset', {
        newPassword,
        currentPassword,
      });
      return response.data; // Should return the updated restaurant object or a success message
    } catch (error: any) {
      let errorMessage = 'Failed to update status';
      if (error.response && error.response.data) {
        // Assuming error response might have a message field
        errorMessage =
          JSON.stringify(error.response.data.message) ||
          JSON.stringify(error.response.data.error) ||
          JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  },
);
export const completeRestaurantPasswordReset = createAsyncThunk(
  'restaurant/completeRestaurantPasswordReset',
  async (
    {code, verificationId}: {code: string; verificationId: string},
    {rejectWithValue},
  ) => {
    try {
      const response = await apiClient.post('/me/password/verify-reset', {
        code,
        verificationId,
      });
      return response.data;
    } catch (error: any) {
      let errorMessage = 'Failed to update status';
      if (error.response && error.response.data) {
        // Assuming error response might have a message field
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          error.response.data;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  },
);

export type OpeningHours = {
  [day: string]: {
    open: string;
    close: string;
  };
};

// Or more specifically with day keys:
// type OpeningHours = {
//   monday?: {
//     open: string;
//     close: string;
//   };
//   tuesday?: {
//     open: string;
//     close: string;
//   };
//   wednesday?: {
//     open: string;
//     close: string;
//   };
//   thursday?: {
//     open: string;
//     close: string;
//   };
//   friday?: {
//     open: string;
//     close: string;
//   };
//   saturday?: {
//     open: string;
//     close: string;
//   };
//   sunday?: {
//     open: string;
//     close: string;
//   };
// };
export type InitialRestaurantProfileState = {
  profile: null | {
    // isActive: boolean;
    name: string;
    description: string;
    deliveryFee: string;
    averagePrepTime: string;
    deliveryRadius: string;
    minimumOrder: string;
    cuisines: string;
    prefersCash: boolean;
    openingHours: OpeningHours;
  };
  status:
    | 'idle'
    | 'failed'
    | 'fetched'
    | 'succeeded'
    | 'loading'
    | 'loading_update'
    | 'succeeded_update'
    | 'failed_update';
  error: null | string;
  isStatusUpdating: boolean;
  isStatusFetching: boolean;
  isPasswordResetting: boolean;
  passwordVerificationId: string;
};
const initialState: InitialRestaurantProfileState = {
  profile: null, // To store fetched or updated profile data if API returns it
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  isStatusUpdating: false,
  isStatusFetching: false,
  isPasswordResetting: false,
  passwordVerificationId: '',
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    resetUpdateStatus: state => {
      state.status = 'idle';
      state.isStatusUpdating = false;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(updateRestaurantProfile.pending, state => {
        state.isStatusUpdating = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateRestaurantProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload?.data; // Store the response
        // console.log('Update successful:', action.payload);
        state.isStatusUpdating = false;
      })
      .addCase(updateRestaurantProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as InitialRestaurantProfileState['error'];
        // console.error('Update failed:', action.payload);
        state.isStatusUpdating = false;
      })
      .addCase(fetchRestaurantProfile.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRestaurantProfile.fulfilled, (state, action) => {
        state.status = 'fetched';
        state.profile = action.payload.data; // Store the fetched profile
        // console.log('Fetch successful:', action.payload);
      })
      .addCase(fetchRestaurantProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as InitialRestaurantProfileState['error'];
        console.error('Fetch failed:', action.payload);
      })
      .addCase(updateRestaurantStatus.pending, state => {
        state.isStatusUpdating = true;
        state.status = 'loading_update';
      })
      .addCase(updateRestaurantStatus.fulfilled, (state, action) => {
        state.status = 'succeeded_update';
        state.isStatusUpdating = false;
      })
      .addCase(updateRestaurantStatus.rejected, (state, action) => {
        state.isStatusUpdating = false;
        state.status = 'failed_update'; // Use a more specific status for clarity
        state.error = action.payload as InitialRestaurantProfileState['error']; // Store the specific error message
      })
      .addCase(initiateRestaurantPasswordReset.pending, state => {
        state.isPasswordResetting = true;
      })
      .addCase(initiateRestaurantPasswordReset.fulfilled, (state, action) => {
        state.passwordVerificationId = action.payload.verificationId || '';
        state.isPasswordResetting = false;
      })
      .addCase(initiateRestaurantPasswordReset.rejected, (state, action) => {
        state.isPasswordResetting = false;
        state.error = action.payload as InitialRestaurantProfileState['error']; // Store the specific error message
      })
      .addCase(completeRestaurantPasswordReset.pending, state => {
        state.isPasswordResetting = true;
      })
      .addCase(completeRestaurantPasswordReset.fulfilled, (state, action) => {
        // state.passwordVerificationId = action.payload.verificationId || "";
        state.isPasswordResetting = false;
      })
      .addCase(completeRestaurantPasswordReset.rejected, (state, action) => {
        state.isPasswordResetting = false;
        state.error = action.payload as InitialRestaurantProfileState['error']; // Store the specific error message
      });
  },
});

export const {resetUpdateStatus, clearError} = restaurantSlice.actions;
export default restaurantSlice.reducer;

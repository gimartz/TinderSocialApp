// features/auth/authSlice.js
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import apiClient from '../../service'; // Adjust path as needed
import Client from '../../Api'; // Adjust path as needed
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootState} from '../..';
import {STORAGE_KEYS} from '../../../../utils/storage';

type InitialState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  userInfo: null | {
    id: string;
    name: string;
    email: string;
    phone: string;
    isActive: true;
    logoUrl: string;
  };
  loading: boolean;
  passwordResetIsLoading: boolean;
  error: null;
  fcmtoken: null | string;
  success: boolean;
  token: null | string; // Add a specific loading/error state for this new action if desired
  getVendorStatusLoading: boolean;
  getVendorStatusError: null | string;
  updateVendorStatusLoading: boolean;
  updateVendorStatusError: null | string;
  fcmToken: null | string;
  restaurantisActive: null; // Add this to track vendor active status
};
const initialState: InitialState = {
  isAuthenticated: false,
  isInitialized: false,
  userInfo: null,
  loading: false,
  passwordResetIsLoading: false,
  error: null,
  fcmtoken: null,
  success: false,
  token: null, // Add a specific loading/error state for this new action if desired
  getVendorStatusLoading: false,
  getVendorStatusError: null,
  updateVendorStatusLoading: false,
  updateVendorStatusError: null,
  fcmToken: null,
  restaurantisActive: null, // Add this to track vendor active status
};

const API_URL = 'https://speedit-server.onrender.com/v1/api/restaurants'; // Replace with your API URL

// Async thunk to initialize auth state from AsyncStorage
export const initializeAuthFromStorage = createAsyncThunk(
  'auth/initializeAuthFromStorage',
  async (_, {dispatch}) => {
    try {
      const [userData, tokenData] = await Promise.all([
        AsyncStorage.getItem('@user_profile'),
        AsyncStorage.getItem('@auth_token'),
      ]);
      // console.log(userData, tokenData);

      const user = userData ? JSON.parse(userData) : null;
      const token = tokenData ? JSON.parse(String(tokenData)) : null;

      return {user, token};
    } catch (error: any) {
      console.error('Failed to initialize auth from AsyncStorage:', error);
      return {user: null, token: null};
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, {rejectWithValue}) => {
    try {
      console.log('Registration data:', userData);
      const response = await axios.post(`${API_URL}/register`, userData);
      console.log('Registration response:', response); // Log the response data
      return response.data;
    } catch (error: any) {
      console.log(error.response);
      return rejectWithValue(
        error.response?.data?.error?.message ||
          error?.response?.data?.error ||
          error?.response?.error,
      );
    }
  },
);

// --- Async Thunk for Updating Vendor Active Status ---
export const getVendorActiveStatus = createAsyncThunk(
  'auth/getVendorActiveStatus', // or 'vendorProfile/updateActiveStatus' if new slice
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiClient.get('/status');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          error?.response?.error ||
          'Failed to update vendor status',
      );
    }
  },
);

// --- Async Thunk for Updating Vendor Active Status ---
export const updateVendorActiveStatus = createAsyncThunk(
  'auth/updateVendorActiveStatus', // or 'vendorProfile/updateActiveStatus' if new slice
  async (isActive: boolean, {getState, rejectWithValue}) => {
    try {
      // Get token from auth state (assuming it's stored there after login)
      // const token = getState().auth.userInfo?.token; // Or however you store the token

      const response = await apiClient.put('/status', {isActive});
      // Assuming the API returns the updated vendor profile or at least { isActive: true/false }
      // console.log('Vendor status update response:', response.data);
      return response.data; // This should ideally be the updated vendor info or {isActive: boolean}
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          error?.response?.error ||
          'Failed to update vendor status',
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, {rejectWithValue}) => {
    try {
      const response = await apiClient.post(`${API_URL}/login`, userData);
      // console.log('Login response:', response); // Log the response data
      if (response?.data?.data?.restaurant) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_PROFILE,
          JSON.stringify(response?.data?.data?.restaurant),
        );
        await AsyncStorage.setItem(
          STORAGE_KEYS.AUTH_TOKEN,
          JSON.stringify(response?.data?.data?.token),
        );
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message ||
          error?.response?.data?.error ||
          error?.response?.error,
      );
    }
  },
);
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, {rejectWithValue}) => {
    try {
      AsyncStorage.removeItem('@user_profile');
      AsyncStorage.removeItem('@auth_token');
    } catch (error: any) {
      console.log('logout error:', error);
      return rejectWithValue('Coul not log out. please try again');
    }
  },
);

export const UpdateFcm = createAsyncThunk(
  'auth/updateFCMToken',
  async (userData, {rejectWithValue}) => {
    try {
      const response = await apiClient.put(`${API_URL}/fcm-token`, userData);
      // console.log('fcm response:', response); // Log the response data
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message ||
          error?.response?.data?.error ||
          error?.response?.error,
      );
    }
  },
);

export const InitiateForgotPasswordReset = createAsyncThunk(
  'auth/initiateForgotPasswordReset',
  async ({email}: {email: string}, {rejectWithValue}) => {
    try {
      const response = await apiClient.post(
        `${API_URL}/forgot-password/initiate`,
        {email},
      );
      // console.log('initiate forgot password response from slice:', response); // Log the response data
      return response.data;
    } catch (error: any) {
      // console.log(error.response);
      return rejectWithValue(
        error.response?.data?.error?.message ||
          error?.response?.data?.error ||
          error?.response?.error,
      );
    }
  },
);

export const CompleteForgotPasswordReset = createAsyncThunk(
  'auth/CompleteForgotPasswordReset',
  async (userData, {rejectWithValue}) => {
    try {
      const response = await apiClient.post(
        `${API_URL}/forgot-password/complete`,
        userData,
      );
      // console.log('forgot password completion response:', response); // Log the response data
      return response.data;
    } catch (error: any) {
      // console.log('ver code error response:', error, error.response);
      return rejectWithValue(
        error.response?.data?.error?.message ||
          error?.response?.data?.error ||
          error?.response?.error,
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.userInfo = null;
      state.success = false; // Reset success on logout
      state.error = null; // Clear error on logout
    },
    getDetail: (state, action) => {
      state.userInfo = action.payload; // Set userInfo to the provided detail
    },
    setFcmToken(state, action) {
      // <--- Add this reducer
      state.fcmToken = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // initialize user from storage
      .addCase(initializeAuthFromStorage.pending, state => {
        state.loading = true;
      })
      .addCase(initializeAuthFromStorage.fulfilled, (state, action) => {
        // console.log('data from local storage:', action.payload);
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = !!(action.payload.user && action.payload.token);
        // state.isProfileSetupComplete =
        //   action.payload.user?.verificationStatus === 'verified' ||
        //   action.payload.user?.verificationStatus === 'approved';
        state.isInitialized = true;
        state.loading = false;
      })
      .addCase(initializeAuthFromStorage.rejected, state => {
        state.userInfo = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, state => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.userInfo = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, state => {
        // nothing significant should happen on logout rejection
        state.loading = false;
      })
      .addCase(registerUser.pending, state => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, {payload}: {payload: any}) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getVendorActiveStatus.pending, state => {
        state.getVendorStatusLoading = true;
        state.getVendorStatusError = null;
      })
      .addCase(getVendorActiveStatus.fulfilled, (state, action) => {
        state.restaurantisActive = action.payload.data.isActive; //
        state.getVendorStatusLoading = false;
      })
      .addCase(getVendorActiveStatus.rejected, (state, action: any) => {
        state.getVendorStatusLoading = false;
        state.getVendorStatusError = action.payload;
      })
      .addCase(updateVendorActiveStatus.pending, state => {
        state.updateVendorStatusLoading = true;
        state.updateVendorStatusError = null;
      })
      .addCase(updateVendorActiveStatus.fulfilled, (state, action) => {
        state.restaurantisActive = action.payload.data.isActive; //
        state.updateVendorStatusLoading = false;
      })
      .addCase(updateVendorActiveStatus.rejected, (state, action: any) => {
        state.updateVendorStatusLoading = false;
        state.updateVendorStatusError = action.payload;
      })
      .addCase(loginUser.pending, state => {
        state.loading = true; // Handle loading state for login
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const {restaurant, token} = action.payload.data;
        // console.log('Login response restaurant fulfilled:', restaurant); // Log the restaurant data
        state.loading = false;
        state.userInfo = restaurant;
        state.token = token; // Store the token
        state.success = true;
        // state.restaurantisActive = restaurant.isActive;
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false; // Handle loading state for login rejection
        state.error = action.payload;
      })
      .addCase(InitiateForgotPasswordReset.pending, state => {
        state.passwordResetIsLoading = true; // Handle passwordResetIsLoading state for login
      })
      .addCase(InitiateForgotPasswordReset.fulfilled, (state, action: any) => {
        state.passwordResetIsLoading = false; // Handle loading state for login rejection
      })
      .addCase(InitiateForgotPasswordReset.rejected, (state, action: any) => {
        state.passwordResetIsLoading = false; // Handle loading state for login rejection
        // console.log(action.payload);
        state.error = action.payload;
      })
      .addCase(CompleteForgotPasswordReset.pending, state => {
        state.passwordResetIsLoading = true; // Handle passwordResetIsLoading state for login
      })
      .addCase(CompleteForgotPasswordReset.fulfilled, (state, action) => {
        state.passwordResetIsLoading = false;
      })
      .addCase(CompleteForgotPasswordReset.rejected, (state, action) => {
        state.passwordResetIsLoading = false;
        // console.log(action.payload);
        // state.error = action.payload;
      });
  },
});

export const {logout, getDetail, setFcmToken} = authSlice.actions;
export const selectUserInfo = (state: RootState) => state.auth.userInfo;
export const selectIsVendorActive = (state: RootState) => {
  return state.auth.restaurantisActive; // If nested
  // return state.auth.userInfo?.storeStatus?.online; // Another possible structure
};
export const selectUpdateVendorStatusLoading = (state: RootState) =>
  state.auth.updateVendorStatusLoading;
export const selectUpdateVendorStatusError = (state: RootState) =>
  state.auth.updateVendorStatusError;
export const selectGetVendorStatusLoading = (state: RootState) =>
  state.auth.getVendorStatusLoading;
export const selectGetVendorStatusError = (state: RootState) =>
  state.auth.getVendorStatusError;
export const selectFcmToken = (state: RootState) => state.auth.fcmToken; // Selector for FCM token
export default authSlice.reducer;

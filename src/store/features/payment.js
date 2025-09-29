// src/features/payment/paymentSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import store from '..';
const {API_BASE_URL} = 'https://speedit-server.onrender.com/v1/api';
const getAuthToken = () => {
  const state = store.getState();
  const userInfo = state.auth?.userInfo;
  console.log('User Info:', userInfo); // Log the user info to check if it's being retrieved correctly
  return userInfo?.data?.token || null;
};

// --- Async Thunks ---
export const initializePayment = createAsyncThunk(
  'payment/initialize',
  async ({amount, token}, {rejectWithValue}) => {
    try {
      const authToken = token || getAuthToken();
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API_BASE_URL}/customers/wallet/fund`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({amount}),
      };
      const response = await axios(config);
      // Expected response: { "success": true, "data": { "authorizationUrl": "...", "accessCode": "...", "reference": "..." } }
      if (
        response.data &&
        response.data.success &&
        response.data.data &&
        response.data.data.authorizationUrl
      ) {
        return response.data.data; // Contains authorizationUrl, accessCode, reference
      }
      return rejectWithValue(
        response.data?.message ||
          'Invalid response from initialize payment API',
      );
    } catch (error) {
      console.error(
        'Initialize Payment Error:',
        error.response?.data || error.message,
      );
      return rejectWithValue(
        error.response?.data || 'Failed to initialize payment',
      );
    }
  },
);

export const verifyPayment = createAsyncThunk(
  'payment/verify',
  async (trxref, {rejectWithValue}) => {
    try {
      const authToken = token || getAuthToken();
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API_BASE_URL}/payments/verify?trxref=${trxref}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      };
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(
        'Verify Payment Error:',
        error.response?.data || error.message,
      );
      return rejectWithValue(
        error.response?.data || 'Failed to verify payment',
      );
    }
  },
);

const initialState = {
  isLoading: false,
  error: null,
  paymentDetails: null, // Will store { authorizationUrl, accessCode, reference }
  verificationStatus: null,
  // This will hold the reference extracted from Paystack callback URL, to be used for verification
  transactionReferenceForVerification: null,
  showWebViewModal: false, // To control WebView modal visibility
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentState: state => {
      state.isLoading = false;
      state.error = null;
      state.paymentDetails = null;
      state.verificationStatus = null;
      state.transactionReferenceForVerification = null;
      state.showWebViewModal = false;
    },
    // Sets the reference obtained from Paystack redirect, ready for verification
    setTransactionReferenceForVerification: (state, action) => {
      state.transactionReferenceForVerification = action.payload;
    },
    // Controls the visibility of the WebView modal
    setShowWebViewModal: (state, action) => {
      state.showWebViewModal = action.payload;
    },
    resetVerificationStatus: state => {
      state.verificationStatus = null;
    },
  },
  extraReducers: builder => {
    builder
      // Initialize Payment
      .addCase(initializePayment.pending, state => {
        state.isLoading = true;
        state.error = null;
        state.paymentDetails = null;
        state.verificationStatus = null;
        state.transactionReferenceForVerification = null;
        state.showWebViewModal = false;
      })
      .addCase(initializePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentDetails = action.payload; // { authorizationUrl, accessCode, reference }
        if (action.payload && action.payload.authorizationUrl) {
          state.showWebViewModal = true; // Show WebView modal once we have the URL
        }
      })
      .addCase(initializePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Verify Payment
      .addCase(verifyPayment.pending, state => {
        state.isLoading = true; // Can set a specific loading for verification if needed
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verificationStatus = action.payload;
        state.showWebViewModal = false; // Close WebView modal after verification attempt
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Or a specific verification error
        state.verificationStatus = {
          status: 'error',
          message: 'Verification API call failed or payment not successful.',
        }; // Set a generic error for UI
        state.showWebViewModal = false; // Close WebView modal
      });
  },
});

export const {
  clearPaymentState,
  setTransactionReferenceForVerification,
  setShowWebViewModal,
  resetVerificationStatus,
} = paymentSlice.actions;
export default paymentSlice.reducer;

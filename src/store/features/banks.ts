import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../Api';

// Async Thunks
export const fetchBankList = createAsyncThunk(
  'banks/fetchBankList',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/payments/banks/list');
      // console.log('banks response:', response.data.data);
      return response?.data?.data?.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch banks',
      );
    }
  },
);

export const verifyBankAccount = createAsyncThunk(
  'banks/verifyBankAccount',
  async (
    {
      entityType = 'restaurant',
      accountNumber,
      bankCode,
    }: {entityType: 'restaurant'; accountNumber: string; bankCode: string},
    {rejectWithValue},
  ) => {
    // Added token, assumed needed
    try {
      const response = await axiosInstance.post('/payments/banks/verify', {
        entityType,
        accountNumber,
        bankCode,
      });
      // console.log('Bank verification response:', response);
      return response.data; // Assuming API returns verification status/details
    } catch (error: any) {
      // console.log("bank veric=fication failure:", error.response);
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Bank verification failed',
      );
    }
  },
);

export const fetchWithdrawalRequests = createAsyncThunk(
  'banks/fetchWithdrawalRequests',
  async (_, {rejectWithValue}) => {
    // Assuming token is needed to get user-specific requests
    try {
      const response = await axiosInstance.get(
        'restaurants/wallet/transactions?limit=10&page=1',
      );
      return response.data; // Assuming API returns an array of withdrawal requests
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch withdrawal requests',
      );
    }
  },
);

// OPTIONAL: If you also need to INITIATE a withdrawal (likely a POST)
export const createWithdrawalRequest = createAsyncThunk(
  'banks/createWithdrawalRequest',
  async (
    {
      amount,
      bankCode,
      accountNumber,
      entityId,
    }: {
      amount: number;
      bankCode: string;
      accountNumber: string;
      entityId: string;
    },
    {rejectWithValue},
  ) => {
    try {
      const response = await axiosInstance.post(
        '/payments/request_withdrawal', // Or a different endpoint e.g., /payments/withdraw
        {amount, bankCode, accountNumber, entityId, entityType: 'restaurant'},
      );
      // console.log('Withdrawal request response:', response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Withdrawal request failed',
      );
    }
  },
);

type InitialState = {
  banks: [];
  loadingBanks: boolean;
  errorBanks: null | string;

  verificationResult: null;
  isVerifying: boolean;
  errorVerification: null | string;

  withdrawalRequests: [];
  loadingWithdrawalRequests: boolean;
  errorWithdrawalRequests: null | string;

  // For create withdrawal
  createdWithdrawal: null;
  isCreatingWithdrawal: boolean;
  errorCreatingWithdrawal: null | string;
};

const initialState: InitialState = {
  banks: [],
  loadingBanks: false,
  errorBanks: null,

  verificationResult: null,
  isVerifying: false,
  errorVerification: null,

  withdrawalRequests: [],
  loadingWithdrawalRequests: false,
  errorWithdrawalRequests: null,

  // For create withdrawal
  createdWithdrawal: null,
  isCreatingWithdrawal: false,
  errorCreatingWithdrawal: null,
};

const banksSlice = createSlice({
  name: 'banks',
  initialState,
  reducers: {
    clearPaymentsErrors: state => {
      state.errorBanks = null;
      state.errorVerification = null;
      state.errorWithdrawalRequests = null;
      state.errorCreatingWithdrawal = null;
    },
    clearVerificationResult: state => {
      state.verificationResult = null;
      state.errorVerification = null;
    },
    resetPaymentsState: () => initialState,
  },
  extraReducers: builder => {
    builder
      // Fetch Bank List
      .addCase(fetchBankList.pending, state => {
        state.loadingBanks = true;
        state.errorBanks = null;
      })
      .addCase(fetchBankList.fulfilled, (state, action) => {
        state.loadingBanks = false;
        state.banks = action.payload || [];
      })
      .addCase(fetchBankList.rejected, (state, action) => {
        state.loadingBanks = false;
        state.errorBanks = action.payload as InitialState['errorBanks'];
      })
      // Verify Bank Account
      .addCase(verifyBankAccount.pending, state => {
        state.isVerifying = true;
        state.errorVerification = null;
        state.verificationResult = null;
      })
      .addCase(verifyBankAccount.fulfilled, (state, action) => {
        state.isVerifying = false;
        state.verificationResult = action.payload;
      })
      .addCase(verifyBankAccount.rejected, (state, action) => {
        state.isVerifying = false;
        state.errorVerification =
          action.payload as InitialState['errorVerification'];
      })
      // Fetch Withdrawal Requests
      .addCase(fetchWithdrawalRequests.pending, state => {
        state.loadingWithdrawalRequests = true;
        state.errorWithdrawalRequests = null;
      })
      .addCase(fetchWithdrawalRequests.fulfilled, (state, action) => {
        state.loadingWithdrawalRequests = false;
        state.withdrawalRequests = action.payload.data || action.payload; // Adjust as needed
      })
      .addCase(fetchWithdrawalRequests.rejected, (state, action) => {
        state.loadingWithdrawalRequests = false;
        state.errorWithdrawalRequests =
          action.payload as InitialState['errorWithdrawalRequests'];
      })
      // Create Withdrawal Request (Optional)
      .addCase(createWithdrawalRequest.pending, state => {
        state.isCreatingWithdrawal = true;
        state.errorCreatingWithdrawal = null;
        state.createdWithdrawal = null;
      })
      .addCase(createWithdrawalRequest.fulfilled, (state, action) => {
        state.isCreatingWithdrawal = false;
        state.createdWithdrawal = action.payload;
        // Optionally add to withdrawalRequests list or refetch
      })
      .addCase(createWithdrawalRequest.rejected, (state, action) => {
        state.isCreatingWithdrawal = false;
        state.errorCreatingWithdrawal =
          action.payload as InitialState['errorCreatingWithdrawal'];
      });
  },
});

export const {
  clearPaymentsErrors,
  clearVerificationResult,
  resetPaymentsState,
} = banksSlice.actions;
export default banksSlice.reducer;

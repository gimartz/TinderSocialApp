import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../service'; // Using the instance

// Async Thunks
export const fetchRestaurantWallet = createAsyncThunk(
  'wallet/fetchRestaurantWallet',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/wallet/');
      // console.log('Wallet response:', response.data);
      return response.data;
    } catch (error: any) {
      // console.log('Error fetching wallet:', error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch wallet',
      );
    }
  },
);

export const fetchWalletTransactions = createAsyncThunk(
  'wallet/fetchWalletTransactions',
  async (
    {limit = 10, page = 1}: {limit: number; page: number},
    {rejectWithValue},
  ) => {
    try {
      const response = await axiosInstance.get(
        `/wallet/transactions?limit=${limit}&page=${page}`,
      );
      console.log('Transactions response:', response.data);
      return response.data; // Assuming API returns { data: [], page, totalPages, limit }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch transactions',
      );
    }
  },
);

// Define types for transaction item
export interface TransactionItem {
  id: string;
  _id?: string;
  type?: string;
  account_name: string;
  account_number: string;
  amount: number;
  currency?: string;
  createdAt: string;
  status: string;
}

// Define types for wallet details
export interface WalletDetails {
  data?: {
    balance?: number;
    currency?: string;
  };
  balance?: number;
  pendingBalance?: number;
  currency?: string;
}

export interface TransactionsResponse {
  transactions?: TransactionItem[];
}

// Define types for Redux state
export interface WalletState {
  walletDetails?: WalletDetails | null;
  transactions?: TransactionItem[];
  currentPage: number;
  totalPages?: number;
  limit?: number;
  loadingWallet?: boolean;
  errorWallet?: string | null;
  loadingTransactions?: boolean;
  errorTransactions?: string | null;
}

const initialState: WalletState = {
  walletDetails: null,
  transactions: [],
  currentPage: 1,
  totalPages: 1,
  limit: 10,
  loadingWallet: false,
  errorWallet: null,
  loadingTransactions: false,
  errorTransactions: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWalletErrors: state => {
      state.errorWallet = null;
      state.errorTransactions = null;
    },
    resetWalletState: () => initialState, // For logout or re-initialization
  },
  extraReducers: builder => {
    builder
      // Fetch Restaurant Wallet
      .addCase(fetchRestaurantWallet.pending, state => {
        state.loadingWallet = true;
        state.errorWallet = null;
      })
      .addCase(fetchRestaurantWallet.fulfilled, (state, action) => {
        state.loadingWallet = false;
        state.walletDetails = action.payload.data;
      })
      .addCase(fetchRestaurantWallet.rejected, (state, action) => {
        state.loadingWallet = false;
        state.errorWallet = action.payload as WalletState['errorWallet'];
      })
      // Fetch Wallet Transactions
      .addCase(fetchWalletTransactions.pending, state => {
        state.loadingTransactions = true;
        state.errorTransactions = null;
      })
      .addCase(fetchWalletTransactions.fulfilled, (state, action) => {
        state.loadingTransactions = false;
        const responseData = action.payload.data;
        // Assuming action.payload.data is an object like { transactions: [...], page: 1, total: 5, limit: 10 }
        // If page === 1, replace transactions, otherwise append for infinite scroll (adjust as needed)
        if (responseData?.page === 1 || !state?.transactions?.length) {
          state.transactions = responseData?.transactions;
          // state.transactions = action.payload.data;
        } else if (responseData?.page > state.currentPage) {
          state.transactions = [
            ...state.transactions,
            ...responseData.transactions,
          ];
        }
        state.currentPage = responseData.page;
        state.totalPages = responseData?.total;
        state.limit = responseData?.limit;
      })
      .addCase(fetchWalletTransactions.rejected, (state, action) => {
        state.loadingTransactions = false;
        state.errorTransactions =
          action.payload as WalletState['errorTransactions'];
      });
  },
});

export const {clearWalletErrors, resetWalletState} = walletSlice.actions;
export default walletSlice.reducer;

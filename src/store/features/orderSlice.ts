// src/features/orders/ordersSlice.ts
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';
import apiClient from '../service'; // Adjust path as needed
import {RootState} from '..';
// import { RootState } from '../store'; // Adjust path to your store

// --- Types ---
// --- Types ---
interface OrderItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

interface Customer {
  firstName?: string;
  lastName?: string;
  phone?: string;
  addresses?: Array<{
    address: string;
  }>;
}

interface Order {
  id: string;
  status: string;
  lastRestaurantStatus: string;
  lastRiderStatus?: string;
  customer?: Customer;
  items: OrderItem[];
  totalAmount: number;
  subTotal: number;
  deliveryFee: number;
  createdAt: string;
  specialInstructions?: string;
}

interface OrderState {
  items: Order[];
  itemsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  itemsError: string | null;
  singleOrder: Order | {};
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateError: string | null;
  isUpdating: boolean;
  currentlyUpdatingOrderId: string | null;
  updatingOrderId: string | null;

  allOrders: {
    items: Order[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  // Individual order categories
  pendingOrders: {
    items: Order[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  accepted_by_restaurantOrders: {
    items: Order[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  preparingOrders: {
    items: Order[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  readyOrders: {
    items: Order[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  completedOrders: {
    items: Order[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  cancelledOrders: {
    items: Order[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  todaysOrders: {
    items: Order[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  todaysSales: {
    amount: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
}

interface ApiResponse {
  data?: any;
  message?: string;
  error?: string;
}

// --- Async Thunks ---

// Individual thunks for each order status
export const fetchOrdersByStatus = createAsyncThunk(
  'orders/fetchOrdersByStatus',
  async (status: string, {rejectWithValue}) => {
    const apiUrl =
      status === 'completed' || status === 'cancelled'
        ? `/orders?status=${status}`
        : `/orders?restaurant_status=${status}`;

    try {
      const response = await apiClient.get(apiUrl);
      // console.log(`fetched ${status} orders from thunk`, response);
      return {status, data: response?.data?.data || response.data};
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          `Failed to fetch ${status} orders`,
      );
    }
  },
);

// Fetch all orders
// Remove this. It is stale, including the componnents that reference it
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({status}: {status?: string}, {rejectWithValue}) => {
    const apiUrl = status ? `/orders?restaurant_status=${status}` : '/orders'; // Fixed typo: /order -> /orders
    try {
      const response = await apiClient.get(apiUrl);
      console.log('fetched orders from thunk', response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch orders',
      );
    }
  },
);

// Fetch all orders
// Active thunk
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async ({status}: {status?: string}, {rejectWithValue}) => {
    const apiUrl = status ? `/orders?restaurant_status=${status}` : '/orders';
    try {
      const response = await apiClient.get(apiUrl);
      console.log('fetched orders from thunk', response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch orders',
      );
    }
  },
);

// Individual thunks for each order status
export const fetchPendingOrders = createAsyncThunk(
  'orders/fetchPendingOrders',
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiClient.get('/orders?restaurant_status=pending');
      return response.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message,
      );
    }
  },
);

export const fetchAcceptedOrders = createAsyncThunk(
  'orders/fetchAcceptedOrders',
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiClient.get(
        '/orders?restaurant_status=accepted_by_restaurant',
      );
      return response.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchPreparingOrders = createAsyncThunk(
  'orders/fetchPreparingOrders',
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiClient.get(
        '/orders?restaurant_status=preparing',
      );
      return response.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchReadyOrders = createAsyncThunk(
  'orders/fetchReadyOrders',
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiClient.get('/orders?restaurant_status=ready');
      return response.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchTodaysOrders = createAsyncThunk(
  'orders/fetchTodaysOrders',
  async (_, {rejectWithValue}) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await apiClient.get(`/orders?date=${today}`);
      return response.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchTodaysSales = createAsyncThunk(
  'orders/fetchTodaysSales',
  async (_, {rejectWithValue}) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await apiClient.get(`/orders/sales?date=${today}`);
      return response.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async (
    {orderId, newStatus}: {orderId: string; newStatus: string},
    {rejectWithValue},
  ) => {
    try {
      const endpoint = `/orders/${orderId}/status`;
      const payload = {status: newStatus};

      const response = await apiClient.patch(endpoint, payload);

      // console.log(
      //   `[OrderSlice] API call successful for order ${orderId}. Response:`,
      //   response.data,
      // );
      return response.data?.data || response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        `Failed to update status for order ${orderId}`;
      console.error(
        `[OrderSlice] API call failed for order ${orderId}:`,
        errorMessage,
        error.response?.data,
      );
      return rejectWithValue(errorMessage);
    }
  },
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (
    {orderId, reason}: {orderId: string; reason: string},
    {rejectWithValue},
  ) => {
    try {
      const response = await apiClient.patch(`/orders/${orderId}/cancel`, {
        reason,
      });
      return response.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to cancel order',
      );
    }
  },
);

const initialState: OrderState = {
  allOrders: {
    items: [],
    status: 'idle',
    error: null,
  },
  // Individual order categories
  pendingOrders: {
    items: [],
    status: 'idle',
    error: null,
  },
  accepted_by_restaurantOrders: {
    items: [],
    status: 'idle',
    error: null,
  },
  preparingOrders: {
    items: [],
    status: 'idle',
    error: null,
  },
  readyOrders: {
    items: [],
    status: 'idle',
    error: null,
  },
  completedOrders: {
    items: [],
    status: 'idle',
    error: null,
  },
  cancelledOrders: {
    items: [],
    status: 'idle',
    error: null,
  },
  todaysOrders: {
    items: [],
    status: 'idle',
    error: null,
  },
  todaysSales: {
    amount: 0,
    status: 'idle',
    error: null,
  },

  items: [],
  itemsStatus: 'idle',
  itemsError: null,
  singleOrder: {},
  updateStatus: 'idle',
  updateError: null,
  isUpdating: false,
  currentlyUpdatingOrderId: null,
  updatingOrderId: null,
};

// Helper function to update order in the correct array
const updateOrderInArrays = (state: OrderState, updatedOrder: Order) => {
  const statusArrays = [
    'pendingOrders',
    'accepted_by_restaurantOrders',
    'preparingOrders',
    'readyOrders',
    'completedOrders',
    'cancelledOrders',
  ] as const;

  // First, remove the order from ALL arrays
  statusArrays.forEach(arrayKey => {
    state[arrayKey].items = state[arrayKey].items.filter(
      (order: Order) => order.id !== updatedOrder.id,
    );
  });

  // Then, add it to the correct array based on lastRestaurantStatus
  const newStatus = updatedOrder.lastRestaurantStatus;

  // Map status to the correct array key
  const statusToArrayMap: Record<string, (typeof statusArrays)[number]> = {
    pending: 'pendingOrders',
    accepted_by_restaurant: 'accepted_by_restaurantOrders',
    preparing: 'preparingOrders',
    ready: 'readyOrders',
    completed: 'completedOrders',
    cancelled: 'cancelledOrders',
  };

  const targetArray = statusToArrayMap[newStatus];

  if (targetArray && statusArrays.includes(targetArray)) {
    state[targetArray].items.push(updatedOrder);
  }
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearUpdateStatus: state => {
      state.updateStatus = 'idle';
      state.updateError = null;
      state.isUpdating = false;
      state.currentlyUpdatingOrderId = null;
    },
    clearOrders: state => {
      state.pendingOrders.items = [];
      state.accepted_by_restaurantOrders.items = [];
      state.preparingOrders.items = [];
      state.readyOrders.items = [];
      state.cancelledOrders.items = [];
      state.completedOrders.items = [];
      state.todaysOrders.items = [];
      state.todaysSales.amount = 0;
    },
    setOrder: (state, action: PayloadAction<Order>) => {
      state.singleOrder = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllOrders.pending, state => {
        state.allOrders.status = 'loading';
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders.status = 'succeeded';
        state.allOrders.items = action?.payload?.data;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.allOrders.status = 'failed';
        state.allOrders.error = action.payload as string;
      });

    builder
      // Handle fetchOrdersByStatus for each status
      .addCase(fetchOrdersByStatus.pending, (state, action) => {
        const status = action.meta.arg;
        const statusKey = `${status}Orders` as keyof Pick<
          OrderState,
          | 'pendingOrders'
          | 'accepted_by_restaurantOrders'
          | 'preparingOrders'
          | 'readyOrders'
          | 'completedOrders'
          | 'cancelledOrders'
        >;
        if (state[statusKey]) {
          (state[statusKey] as any).status = 'loading';
          (state[statusKey] as any).error = null;
        }
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        // console.log('Order is fetched:', action.payload);
        const {status, data} = action.payload;
        const statusKey = `${status}Orders` as keyof Pick<
          OrderState,
          | 'pendingOrders'
          | 'accepted_by_restaurantOrders'
          | 'preparingOrders'
          | 'readyOrders'
          | 'completedOrders'
          | 'cancelledOrders'
        >;
        if (state[statusKey]) {
          (state[statusKey] as any).status = 'succeeded';
          (state[statusKey] as any).items = data;
          (state[statusKey] as any).error = null;
        }
      })
      .addCase(fetchOrdersByStatus.rejected, (state, action) => {
        const status = action.meta.arg;
        const statusKey = `${status}Orders` as keyof Pick<
          OrderState,
          | 'pendingOrders'
          | 'accepted_by_restaurantOrders'
          | 'preparingOrders'
          | 'readyOrders'
          | 'completedOrders'
          | 'cancelledOrders'
        >;
        if (state[statusKey]) {
          (state[statusKey] as any).status = 'failed';
          (state[statusKey] as any).error = action.payload as string;
        }
      })

      // Pending Orders
      .addCase(fetchPendingOrders.pending, state => {
        state.pendingOrders.status = 'loading';
      })
      .addCase(fetchPendingOrders.fulfilled, (state, action) => {
        state.pendingOrders.status = 'succeeded';
        // console.log(action.payload);
        state.pendingOrders.items = action.payload;
        state.pendingOrders.error = null;
      })
      .addCase(fetchPendingOrders.rejected, (state, action) => {
        state.pendingOrders.status = 'failed';
        state.pendingOrders.error = action.payload as string;
      })

      // Accepted Orders
      .addCase(fetchAcceptedOrders.pending, state => {
        state.accepted_by_restaurantOrders.status = 'loading';
      })
      .addCase(fetchAcceptedOrders.fulfilled, (state, action) => {
        state.accepted_by_restaurantOrders.status = 'succeeded';
        state.accepted_by_restaurantOrders.items = action.payload;
        state.accepted_by_restaurantOrders.error = null;
      })
      .addCase(fetchAcceptedOrders.rejected, (state, action) => {
        state.accepted_by_restaurantOrders.status = 'failed';
        state.accepted_by_restaurantOrders.error = action.payload as string;
      })

      // Preparing Orders
      .addCase(fetchPreparingOrders.pending, state => {
        state.preparingOrders.status = 'loading';
      })
      .addCase(fetchPreparingOrders.fulfilled, (state, action) => {
        state.preparingOrders.status = 'succeeded';
        state.preparingOrders.items = action.payload;
        state.preparingOrders.error = null;
      })
      .addCase(fetchPreparingOrders.rejected, (state, action) => {
        state.preparingOrders.status = 'failed';
        state.preparingOrders.error = action.payload as string;
      })

      // Ready Orders
      .addCase(fetchReadyOrders.pending, state => {
        state.readyOrders.status = 'loading';
      })
      .addCase(fetchReadyOrders.fulfilled, (state, action) => {
        state.readyOrders.status = 'succeeded';
        state.readyOrders.items = action.payload;
        state.readyOrders.error = null;
      })
      .addCase(fetchReadyOrders.rejected, (state, action) => {
        state.readyOrders.status = 'failed';
        state.readyOrders.error = action.payload as string;
      })

      // Today's Orders
      .addCase(fetchTodaysOrders.pending, state => {
        state.todaysOrders.status = 'loading';
      })
      .addCase(fetchTodaysOrders.fulfilled, (state, action) => {
        state.todaysOrders.status = 'succeeded';
        state.todaysOrders.items = action.payload;
        state.todaysOrders.error = null;
      })
      .addCase(fetchTodaysOrders.rejected, (state, action) => {
        state.todaysOrders.status = 'failed';
        state.todaysOrders.error = action.payload as string;
      })

      // Today's Sales
      .addCase(fetchTodaysSales.pending, state => {
        state.todaysSales.status = 'loading';
      })
      .addCase(fetchTodaysSales.fulfilled, (state, action) => {
        state.todaysSales.status = 'succeeded';
        state.todaysSales.amount = action.payload.totalSales || 0;
        state.todaysSales.error = null;
      })
      .addCase(fetchTodaysSales.rejected, (state, action) => {
        state.todaysSales.status = 'failed';
        state.todaysSales.error = action.payload as string;
      })

      // Fetch Orders (legacy)
      .addCase(fetchOrders.pending, state => {
        state.itemsStatus = 'loading';
        state.itemsError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.itemsStatus = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.itemsStatus = 'failed';
        state.itemsError =
          (action.payload as string) || 'Failed to fetch orders';
      })

      // Update Order Status
      .addCase(updateOrderStatus.pending, (state, action) => {
        state.updateStatus = 'loading';
        state.updateError = null;
        state.isUpdating = true;
        state.currentlyUpdatingOrderId = action.meta.arg.orderId;
        state.updatingOrderId = action.meta.arg.orderId;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.currentlyUpdatingOrderId = null;
        state.updatingOrderId = null;
        state.isUpdating = false;
        state.singleOrder = action.payload;

        const updatedOrder = action.payload;
        updateOrderInArrays(state, updatedOrder);
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload as string;
        state.currentlyUpdatingOrderId = null;
        state.isUpdating = false;
      }); // Add to your extraReducers

    builder
      .addCase(cancelOrder.pending, (state, action) => {
        state.updatingOrderId = action.meta.arg.orderId;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.updatingOrderId = null;

        // Remove from current array and add to cancelled array
        const statusArrays = [
          'pendingOrders',
          'accepted_by_restaurantOrders',
          'preparingOrders',
          'readyOrders',
        ] as const;

        statusArrays.forEach(arrayKey => {
          state[arrayKey].items = state[arrayKey].items.filter(
            order => order.id !== updatedOrder?.id,
          );
        });

        state.cancelledOrders.items.push(updatedOrder);
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.updatingOrderId = null;
        state.cancelledOrders.error = action.payload as string;
      });
  },
});

export const {clearUpdateStatus, setOrder, clearOrders} = ordersSlice.actions;

// Selectors
export const selectOrdersByStatus = (status: string) => (state: RootState) =>
  state.orders[
    `${status}Orders` as keyof Pick<
      OrderState,
      | 'pendingOrders'
      | 'accepted_by_restaurantOrders'
      | 'preparingOrders'
      | 'readyOrders'
      | 'completedOrders'
      | 'cancelledOrders'
    >
  ];

// export const selectOrdersByStatus = (status: string) =>
//   createSelector(
//     (state: RootState) => state.orders,
//     (orders) => ({
//       ...orders,
//       items: orders.items.filter(order =>
//         order.lastRestaurantStatus?.toLowerCase() === status.toLowerCase()
//       ),
//     })
//   );

export const selectPendingOrders = (state: RootState) =>
  state.orders.pendingOrders;
export const selectAcceptedOrders = (state: RootState) =>
  state.orders.accepted_by_restaurantOrders;
export const selectPreparingOrders = (state: RootState) =>
  state.orders.preparingOrders;
export const selectReadyOrders = (state: RootState) => state.orders.readyOrders;
export const selectTodaysOrders = (state: RootState) =>
  state.orders.todaysOrders;
export const selectTodaysSales = (state: RootState) => state.orders.todaysSales;

// export const selectAllOrders = (state: RootState) => {
//   const allOrders: Order[] = [];
//   const statusArrays = [
//     'pendingOrders',
//     'accepted_by_restaurantOrders',
//     'preparingOrders',
//     'readyOrders',
//     'completedOrders',
//     'cancelledOrders',
//   ] as const;

//   statusArrays.forEach(arrayKey => {
//     allOrders.push(...state.orders[arrayKey].items);
//   });

//   return {data: allOrders};
// };
// Add this selector
export const selectAllOrders = (state: RootState) =>
  state.orders.allOrders || {items: [], status: 'idle'};

export const selectOrderById = (state: RootState, orderId: string) =>
  state.orders.items.find(order => order.id === orderId);

export const selectOrdersFetchStatus = (state: RootState) =>
  state.orders.itemsStatus;
export const selectOrdersFetchError = (state: RootState) =>
  state.orders.itemsError;
export const selectOrdersUpdateStatus = (state: RootState) =>
  state.orders.updateStatus;
export const selectOrdersUpdateError = (state: RootState) =>
  state.orders.updateError;
export const selectCurrentlyUpdatingOrderId = (state: RootState) =>
  state.orders.currentlyUpdatingOrderId;
export const selectIsUpdating = (state: RootState) => state.orders.isUpdating;

export default ordersSlice.reducer;

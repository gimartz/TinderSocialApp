import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import apiClient from '../../service';
import {MenuItem} from '../../../../types/menu';
import { selectAndUploadImages } from '../imageUpload/imageMenu';
const API_BASE = 'https://speedit-server.onrender.com/v1/api/restaurants';

// Fetch all menu items
export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async (_, {rejectWithValue}) => {
    try {
      const res = await apiClient.get('/menu-items');
      // console.log('Fetched menu items:', res.data); // Log the fetched menu items
      return res.data?.data;
    } catch (error: any) {
      // console.error('Error fetching menu items:', error); // Log the error
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message,
      );
    }
  },
);

// Create menu item
export const createMenuItem = createAsyncThunk(
  'menu/createMenuItem',
  async ({menuItemData}: {menuItemData: any}, {rejectWithValue}) => {
    try {
      const res = await apiClient.post(`/menu-items`, menuItemData);
      return res.data?.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message,
      );
    }
  },
);

// Update menu item
export const updateMenuItem = createAsyncThunk(
  'menu/updateMenuItem',
  async (
    {id, menuItemData}: {id: string; menuItemData: any},
    {rejectWithValue},
  ) => {
    try {
      const res = await apiClient.put(`/menu-items/${id}`, menuItemData);
      return res.data?.data;
    } catch (error: any) {
      // console.log('Error updating menu item:', error); // Log the error
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message,
      );
    }
  },
);

// Delete menu item
export const deleteMenuItem = createAsyncThunk(
  'menu/deleteMenuItem',
  async ({id}: {id: string}, {rejectWithValue}) => {
    try {
      await apiClient.delete(`/menu-items/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message,
      );
    }
  },
);

type InitialState = {
  loading: boolean;
  items: MenuItem[];
  item: null;
  error: null | string;
  success: boolean;
};

const initialState: InitialState = {
  loading: false,
  items: [],
  item: null,
  error: null,
  success: false,
};

// Add this helper function to transform the API response
const transformMenuItems = (items: MenuItem[]) => {
  return items.map(item => ({
    ...item,
    imageUrl:
      item.images && item.images.length > 0 ? item.images[0] : undefined,
  }));
};

const menuSlice = createSlice({
  name: 'menu',
  initialState: initialState,
  reducers: {
    resetMenuState: state => {
      state.loading = false;
      state.item = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(selectAndUploadImages.fulfilled, (state, action) => {
        if (
          action.payload.uploaded &&
          action.payload.imageUrl &&
          action.payload.menuItemId
        ) {
          // Find the menu item and update its imageUrl
          const itemIndex = state.items.findIndex(
            item => item.id === action.payload.menuItemId,
          );
          if (itemIndex !== -1) {
            state.items[itemIndex].imageUrl = action.payload.imageUrl;
          }
        }
      })
      // Fetch Items
      .addCase(fetchMenuItems.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        // console.log('fetched menu items:', action.payload.data);
        // Transform the items to include imageUrl
        state.items = transformMenuItems(action.payload || []);
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as InitialState['error']) || 'Unknown error';
      })

      // Create Item
      .addCase(createMenuItem.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        // Transform the new item to include imageUrl
        const newItem = {
          ...action.payload,
          imageUrl:
            action.payload.images && action.payload.images.length > 0
              ? action.payload.images[0]
              : undefined,
        };
        state.items.push(newItem);
        state.success = true;
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as InitialState['error']) || 'Unknown error';
        state.success = false;
      })
      
      // Update Item
      .addCase(updateMenuItem.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          // Preserve the existing imageUrl if the update doesn't include images
          const existingImageUrl = state.items[index].imageUrl;
          state.items[index] = {
            ...state.items[index], // Keep existing data including images
            ...action.payload,
            imageUrl:
              action.payload.images && action.payload.images.length > 0
                ? action.payload.images[0]
                : existingImageUrl,
          };
        }
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as InitialState['error']) || 'Unknown error';
        state.success = false;
      })
      // Delete Item
      .addCase(deleteMenuItem.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as InitialState['error']) || 'Unknown error';
        state.success = false;
      });
  },
});

export const {resetMenuState} = menuSlice.actions;
export default menuSlice.reducer;

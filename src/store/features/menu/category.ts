import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import apiClient from '../../service';
const API_BASE = 'https://speedit-server.onrender.com/v1/api';

// Fetch all categories

export type CategoryData = {
  name?: string;
  icon?: string;
  description?: string;
};

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async ({restaurantId}: {restaurantId?: string}, {rejectWithValue}) => {
    try {
      const url = restaurantId
        ? `/menu-categories?restaurantId=${restaurantId}`
        : `/menu-categories`;
      const response = await apiClient.get(url);
      // console.log('Fetched categories:', response.data); // Log the fetched categories
      return response.data?.data;
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message,
      );
    }
  },
);

// Create category
export const createCategory = createAsyncThunk(
  'category/createCategory',
  async ({categoryData}: {categoryData: CategoryData}, {rejectWithValue}) => {
    try {
      const res = await apiClient.post(`/menu-categories`, categoryData);
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

// Update category
export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async (
    {
      id,
      categoryData,
    }: {
      id: string;
      categoryData: CategoryData;
    },
    {rejectWithValue},
  ) => {
    try {
      const res = await apiClient.put(`/menu-categories/${id}`, categoryData);
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

// Delete category
export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async ({id}: {id: string}, {rejectWithValue}) => {
    try {
      await apiClient.delete(`/menu-categories/${id}`);
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
  categories: CategoryData &
    {
      id: string;
      name: string;
      icon: string;
      description: string;
    }[];
  error: null | string;
  success: boolean;
};
const initialState: InitialState = {
  loading: false,
  categories: [],
  error: null,
  success: false,
};
const categorySlice = createSlice({
  name: 'category',
  initialState: initialState,
  reducers: {
    resetCategoryState: state => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as InitialState['error'];
      })
      // Create
      .addCase(createCategory.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push({
          id: action?.payload?.id,
          name: action?.payload?.name,
          icon: action?.payload?.icon,
          description: action?.payload?.description,
        });
        state.success = true;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as InitialState['error'];
        state.success = false;
      })
      // Update
      .addCase(updateCategory.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.categories.findIndex(
          cat => cat.id === action.payload.id,
        );
        if (index !== -1) state.categories[index] = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as InitialState['error'];
        state.success = false;
      })
      // Delete
      .addCase(deleteCategory.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          cat => cat.id !== action.payload,
        );
        state.success = true;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as InitialState['error'];
        state.success = false;
      });
  },
});

export const {resetCategoryState} = categorySlice.actions;
export default categorySlice.reducer;

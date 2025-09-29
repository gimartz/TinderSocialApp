import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Assuming a configured axios instance might be better
import { Alert } from 'react-native';
import apiClient from '../service';
import store from '..';

// --- Configuration ---
// Replace with your actual API base URL
const API_BASE_URL = 'https://speedit-server.onrender.com/v1/api/restaurants';
// Replace with your actual upload endpoints
const LOGO_UPLOAD_URL = `${API_BASE_URL}/logo`;
const COVER_UPLOAD_URL = `${API_BASE_URL}/cover`;
const PROFILE_URL = `${API_BASE_URL}/profile`;
// --------------------

// Define the initial state type (optional but good practice with TypeScript)
interface VendorProfile {
    name: string;
    description: string;
    coverImage: string | null;
    logo: string | null;
    email: string;
}

interface VendorProfileState {
    profileData: VendorProfile | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed'; // For fetching data
    uploadingLogo: 'idle' | 'pending' | 'succeeded' | 'failed';
    uploadingCover: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null | undefined; // Can store error message strings
}

const initialState: VendorProfileState = {
    profileData: null, // Start with null until data is fetched
    status: 'idle',
    uploadingLogo: 'idle',
    uploadingCover: 'idle',
    error: null,
};

// --- Async Thunks ---

// Fetch vendor profile data
export const fetchVendorProfile = createAsyncThunk(
    'vendorProfile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            // Get token when needed
            const state = store.getState();
            const token = state.auth?.token || null;
           
            // TODO: Add authentication headers if needed
            const response = await axios.get(PROFILE_URL, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            return response.data as VendorProfile;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

// Upload Logo Image
export const uploadLogo = createAsyncThunk(
    'vendorProfile/uploadLogo',
    async (image: { uri: string; type: string; name: string }, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append('logo', {
            uri: image.uri,
            type: image.type,
            name: image.name,
        });

        try {
            // Get token when needed
            const state = store.getState();
            const token = state.auth?.token || null;
            const response = await axios.post(LOGO_UPLOAD_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upload logo');
        }
    }
);

// Upload Cover Image
export const uploadCoverImage = createAsyncThunk(
    'vendorProfile/uploadCover',
    async (image: { uri: string; type: string; name: string }, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append('coverImage', {
            uri: image.uri,
            type: image.type,
            name: image.name,
        });

        try {
            // Get token when needed
            const state = store.getState();
            const token = state.auth?.token || null;
            const response = await axios.post(COVER_UPLOAD_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            console.log('Cover image upload response:', response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upload cover image');
        }
    }
);


// --- Slice Definition ---
const vendorProfileSlice = createSlice({
    name: 'vendorProfile',
    initialState,
    reducers: {
        // Add synchronous reducers if needed, e.g., for local state updates
        // clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Profile Cases
            .addCase(fetchVendorProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchVendorProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profileData = action.payload;
            })
            .addCase(fetchVendorProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Upload Logo Cases
            .addCase(uploadLogo.pending, (state) => {
                state.uploadingLogo = 'pending';
                state.error = null; // Clear previous errors on new attempt
            })
            .addCase(uploadLogo.fulfilled, (state, action) => {
                state.uploadingLogo = 'succeeded';
                 // Update the logo URL in the profile data
                 // Adjust based on your API response structure
                if (state.profileData && action.payload?.logo) {
                    state.profileData.logo = action.payload.logo;
                } else if (state.profileData && typeof action.payload === 'object' && action.payload !== null) {
                     // If the API returns the full updated profile
                     state.profileData = { ...state.profileData, ...action.payload.data };
                }
                 Alert.alert('Success', 'Logo updated successfully!');
            })
            .addCase(uploadLogo.rejected, (state, action) => {
                state.uploadingLogo = 'failed';
                state.error = action.payload as string; // Already handled by Alert in thunk
            })

            // Upload Cover Image Cases
            .addCase(uploadCoverImage.pending, (state) => {
                state.uploadingCover = 'pending';
                 state.error = null; // Clear previous errors on new attempt
            })
            .addCase(uploadCoverImage.fulfilled, (state, action) => {
                state.uploadingCover = 'succeeded';
                // Update the cover image URL in the profile data
                // Adjust based on your API response structure
                if (state.profileData && action.payload?.coverImageUrl) {
                    state.profileData.coverImage = action.payload.coverImageUrl;
                } else if (state.profileData && typeof action.payload === 'object' && action.payload !== null) {
                    // If the API returns the full updated profile
                    state.profileData = { ...state.profileData, ...action.payload };
               }
                 Alert.alert('Success', 'Cover image updated successfully!');
            })
            .addCase(uploadCoverImage.rejected, (state, action) => {
                state.uploadingCover = 'failed';
                state.error = action.payload as string; // Already handled by Alert in thunk
            });
    },
});

// export const { clearError } = vendorProfileSlice.actions; // Export synchronous actions if any
export default vendorProfileSlice.reducer;
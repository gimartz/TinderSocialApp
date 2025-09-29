// FILE: src/store/slices/menuItemImageSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
import {ToastAndroid} from 'react-native';
import { RootState } from '../..';

const API_BASE_URL = 'https://speedit-server.onrender.com/v1/api/restaurants';
// const API_BASE_URL = 'http://192.168.180.196:8080/v1/api/restaurants';

// Async thunk for selecting and uploading images
export const selectAndUploadImages = createAsyncThunk(
  'menuItemImages/selectAndUpload',
  async (
    {menuItemId, maxSelection = 1}: {menuItemId: string; maxSelection?: number},
    {rejectWithValue, dispatch, getState},
  ) => {
    try {
      // 1. Select Images using react-native-image-picker
      const response = await new Promise<any>((resolve, reject) => {
        launchImageLibrary(
          {
            mediaType: 'photo',
            quality: 0.8,
            selectionLimit: maxSelection,
          },
          pickerResponse => {
            if (pickerResponse.didCancel) {
              resolve({assets: []});
              return;
            }
            if (pickerResponse.errorCode) {
              reject(
                new Error(
                  pickerResponse.errorMessage || 'Image selection failed',
                ),
              );
              return;
            }
            resolve(pickerResponse);
          },
        );
      });

      if (!response.assets || response.assets.length === 0) {
        dispatch(clearPreviewImages());
        return {
          message: 'No images selected',
          data: null,
          uploaded: false,
          menuItemId,
        };
      }

      // For previewing selected images
      dispatch(
        setSelectedImagePreviews(
          response.assets.map((asset: {uri: string}) => asset.uri),
        ),
      );

      // 2. Prepare FormData - upload only one image at a time
      const formData = new FormData();
      const asset = response.assets[0]; // Only upload the first selected image
      formData.append('images', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `image_${Date.now()}.jpg`,
      });

      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication required');
      }
    
      // 3. Make the API call
      const apiResponse = await axios.post(
        `${API_BASE_URL}/menu-items/${menuItemId}/images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout
        },
      );

      ToastAndroid.show('Image uploaded successfully!', ToastAndroid.SHORT);

      // Extract the image URL from the response - adjust this based on your API response structure
      const imageUrl =
        apiResponse.data?.data?.images?.[0] ||
        apiResponse.data?.data?.imageUrl ||
        apiResponse.data?.imageUrl;

      return {
        message: 'Image uploaded successfully!',
        data: apiResponse.data,
        imageUrl,
        menuItemId,
        uploaded: true,
      };
    } catch (error: any) {
      console.log('Upload error:', error?.response);

      let errorMessage = 'An unknown error occurred during image upload.';
      if (error.response?.data) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          'Server error';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return rejectWithValue(errorMessage);
    }
  },
);

interface ImageUploadState {
  selectedImagePreviews: string[];
  isUploading: boolean;
  uploadError: string | null;
  uploadSuccessMessage: string | null;
  lastUploadedImage?: {
    menuItemId: string;
    imageUrl: string;
  };
}

const initialState: ImageUploadState = {
  selectedImagePreviews: [],
  isUploading: false,
  uploadError: null,
  uploadSuccessMessage: null,
};

const menuItemImageSlice = createSlice({
  name: 'menuItemImages',
  initialState,
  reducers: {
    setSelectedImagePreviews: (state, action) => {
      state.selectedImagePreviews = action.payload;
    },
    clearPreviewImages: state => {
      state.selectedImagePreviews = [];
    },
    clearUploadStatus: state => {
      state.isUploading = false;
      state.uploadError = null;
      state.uploadSuccessMessage = null;
      state.lastUploadedImage = undefined;
    },
    // Add a reducer to manually update an item's image URL
    updateMenuItemImage: (state, action) => {
      // This is just for local state management if needed
    },
  },
  extraReducers: builder => {
    builder
      .addCase(selectAndUploadImages.pending, state => {
        state.isUploading = true;
        state.uploadError = null;
        state.uploadSuccessMessage = null;
      })
      .addCase(selectAndUploadImages.fulfilled, (state, action) => {
        state.isUploading = false;

        if (action.payload.uploaded && action.payload.imageUrl) {
          state.uploadSuccessMessage = action.payload.message;
          state.lastUploadedImage = {
            menuItemId: action.payload.menuItemId,
            imageUrl: action.payload.imageUrl,
          };
        } else {
          state.uploadSuccessMessage = action.payload.message;
        }
      })
      .addCase(selectAndUploadImages.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadError =
          (action.payload as string) || 'Image upload failed.';
      });
  },
});

export const {
  setSelectedImagePreviews,
  clearPreviewImages,
  clearUploadStatus,
  updateMenuItemImage,
} = menuItemImageSlice.actions;
export default menuItemImageSlice.reducer;

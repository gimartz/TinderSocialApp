// src/features/menu/menuSlice.js
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  activeMainTab: 'Meals', // Default active tab
};
const tabSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setActiveMainTab(state, action) {
      state.activeMainTab = action.payload;
    },
  },
});
// Export the action
export const { setActiveMainTab } = tabSlice.actions;
// Selector to get the active main tab
export const selectActiveMainTab = (state) => state.tabs.activeMainTab;
// Export the reducer
export default tabSlice.reducer;
// store.js
import {configureStore} from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import vendorProfileReducer from './features/updateVendore'; // Import the menu slice
import restaurantReducer from './features/restaurant/restaurant';
import restaurantCategoryReducer from './features/restaurant/restaurant-category';
// import passwordReducer from './passwordSlice';
import ordersReducer from './features/orderSlice';
import menuReducer from './features/menu/menuSlice';
import categoryReducer from './features/menu/category';
import locationReducer from './features/location';
import menuItemImageReducer from './features/imageUpload/imageMenu';
import walletReducer from './features/wallet';
import paymentsReducer from './features/payment';
import bankReducer from './features/banks';
import tabSlice from './features/selectTab';
const store = configureStore({
  reducer: {
    auth: authReducer,
    vendorProfile: vendorProfileReducer, // Add the menu reducer
    restaurant: restaurantReducer,
    restaurantCategory: restaurantCategoryReducer,
    orders: ordersReducer,
    menu: menuReducer,
    // password: passwordReducer,
    location: locationReducer,
    wallet: walletReducer,
    banks: bankReducer,
    payments: paymentsReducer,
    menuItemImages: menuItemImageReducer,
    category: categoryReducer,
    tabs: tabSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

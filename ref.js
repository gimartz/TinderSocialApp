// src/navigation/navigationRef.js
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    // You can decide what to do if the navigator is not ready
    // Queue the navigation, log an error, etc.
    console.warn("Navigation attempted before navigator was ready:", name, params);
    // Example: queueing (simple implementation)
    // setTimeout(() => navigate(name, params), 100);
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}
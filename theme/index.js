// src/theme/colors.js

export const ToastColors = {
  // We keep the original red for its intended purpose: critical errors.
  error: {
    background: '#FFF0F0', // A softer red background
    accent: '#D50000',     // The strong original red for text and icons
  },
  // We transform the pale yellow into a more vibrant, professional amber for warnings.
  warning: {
    background: '#FFF8E1',
    accent: '#FFAB00',
  },
  success: {
    background: '#E8F5E9',
    accent: '#2E7D32',
  },
  info: {
    background: '#E3F2FD',
    accent: '#1565C0',
  },
  // General styles
  text: '#1C1C1E',
  surface: '#FEFEFE', // A slightly creamy, off-white surface
};
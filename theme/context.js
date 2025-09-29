// src/context/ToastProvider.js
import React, {createContext, useState, useContext, useCallback} from 'react';
import CustomToast from './toast';

const ToastContext = createContext(null);

export const ToastProvider = ({children}) => {
  const [toastConfig, setToastConfig] = useState(null);

  // Use useCallback to prevent re-renders of consuming components
  const showToast = useCallback(config => {
    setToastConfig(config);
  }, []);

  const hideToast = useCallback(() => {
    setToastConfig(null);
  }, []);

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      {toastConfig && (
        <CustomToast config={toastConfig} onDismiss={hideToast} />
      )}
    </ToastContext.Provider>
  );
};

// Custom hook for easy consumption
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

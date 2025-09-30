// App.js
import React, {useEffect} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider, useDispatch} from 'react-redux';

// import { paperTheme } from './src/theme/colors'; // Import theme if you created one
import AppNavigator from './navigator';
import {ToastProvider} from './theme/context';
import {CustomAlertProvider} from './components/customAlert';
import { AuthProvider, useAuth } from './screens/context/cat';

export default function App() {
 

  return (

          <AuthProvider>
      <PaperProvider>
        <ToastProvider>
       
          <CustomAlertProvider>
            <AppNavigator />
          </CustomAlertProvider>
        </ToastProvider>
      </PaperProvider>
         </AuthProvider>
  
  );
}

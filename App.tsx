// App.js
import React, {useEffect} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider, useDispatch} from 'react-redux';
import store from './src/store/index'; // Import your Redux store
// import { paperTheme } from './src/theme/colors'; // Import theme if you created one
import AppNavigator from './navigator';
import {ToastProvider} from './theme/context';
import {CustomAlertProvider} from './components/customAlert';


export default function App() {
 

  return (
    <Provider store={store}>
      <PaperProvider>
        <ToastProvider>
       
          <CustomAlertProvider>
            <AppNavigator />
          </CustomAlertProvider>
        </ToastProvider>
      </PaperProvider>
    </Provider>
  );
}

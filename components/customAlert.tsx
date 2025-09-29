import React, {createContext, useContext, useState, ReactNode} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

type AlertType = 'success' | 'error' | 'warning';

interface AlertContextType {
  showAlert: (type: AlertType, title: string, message: string) => void;
}

const AlertContext = createContext<AlertContextType>({
  showAlert: () => {},
});

export const useCustomAlert = () => useContext(AlertContext);

export const CustomAlertProvider = ({children}: {children: ReactNode}) => {
  const [visible, setVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>('success');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const showAlert = (type: AlertType, title: string, message: string) => {
    const messageText =
      typeof message === 'string' ? message : JSON.stringify(message);

    setAlertType(type);
    setTitle(title);
    setMessage(messageText);
    setVisible(true);
  };

  const hideAlert = () => setVisible(false);

  const getColors = () => {
    switch (alertType) {
      case 'error':
        return {bg: '#fce4e4', text: '#c0392b', btn: '#e74c3c'};
      case 'warning':
        return {bg: '#fff8e1', text: '#e67e22', btn: '#f39c12'};
      case 'success':
      default:
        return {bg: '#e8f5e9', text: '#27ae60', btn: '#2ecc71'};
    }
  };

  const colors = getColors();

  return (
    <AlertContext.Provider value={{showAlert}}>
      {children}
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={hideAlert}>
        <View style={styles.overlay}>
          <View style={[styles.alertBox, {backgroundColor: colors.bg}]}>
            <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
            <Text style={[styles.message, {color: colors.text}]}>
              {message}
            </Text>
            <TouchableOpacity
              style={[styles.okButton, {backgroundColor: colors.btn}]}
              onPress={hideAlert}>
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: 300,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  message: {fontSize: 16, marginBottom: 20, textAlign: 'center'},
  okButton: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  okText: {color: '#fff', fontWeight: 'bold'},
});

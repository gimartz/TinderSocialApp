// FILE: src/screens/PasswordVerifyScreen.js

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Appbar} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

import {THEME} from '../../../../../src/constants/theme'; // Import your shared theme
// import {
//   verifyPasswordReset,
//   clearPasswordResetState,
// } from '../../../../../src/store/passwordSlice';
import OtpInput from '../../../../../components/passwordInput/otp'; // Import our new component
import {AppDispatch, RootState} from '../../../../../src/store';
import {completeRestaurantPasswordReset} from '../../../../../src/store/features/restaurant/restaurant';
import {useCustomAlert} from '../../../../../components/customAlert';
import {logoutUser} from '../../../../../src/store/features/auth/authSlice';

const PasswordVerifyScreen = ({navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {isPasswordResetting, passwordVerificationId} = useSelector(
    (state: RootState) => state.restaurant,
  );
  const [verificationCode, setVerificationCode] = useState('');

  const {showAlert} = useCustomAlert();

  // Effect to handle success/error feedback with toasts

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // Navigation will be handled by the splash screen based on auth state
      navigation.reset({
        index: 0,
        routes: [{name: 'OnboardLogin', screen: 'Login'} as any],
      });
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.trim().length !== 6) {
      showAlert('error', 'Invalid Code', 'Please enter all 6 digits.');
      return;
    }

    console.log(verificationCode, passwordVerificationId);

    const result = await dispatch(
      completeRestaurantPasswordReset({
        code: verificationCode.trim(),
        verificationId: passwordVerificationId,
      }),
    );
    if (result.meta.requestStatus === 'fulfilled') {
      showAlert('success', 'Password Reset Succesful!', '');
      handleLogout();
    } else {
    }
  };

  const handleResendCode = () => {
    // TODO: Dispatch an action to resend the code
    showAlert('success', 'Code Resent!', 'A new code has been sent.');
  };

  return (
    <View style={styles.pageContainer}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={THEME.CREAM_WHITE}
        />
        <Appbar.Content
          title="Enter Verification Code"
          titleStyle={styles.appbarTitle}
        />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.formHeader}>
            <MaterialCommunityIcons
              name="numeric-6-box-multiple-outline"
              size={48}
              color={THEME.VIBRANT_RED}
            />
            <Text style={styles.formTitle}>Check Your Device</Text>
            <Text style={styles.formSubtitle}>
              We've sent a 6-digit verification code. Enter it below to
              continue.
            </Text>
          </View>

          <OtpInput
            codeLength={6}
            value={verificationCode}
            onChange={setVerificationCode}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive a code? </Text>
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleVerifyCode}
            disabled={isPasswordResetting}>
            {isPasswordResetting ? (
              <ActivityIndicator color={THEME.DARK_CHARCOAL} />
            ) : (
              <Text style={styles.submitButtonText}>Verify & Reset</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: THEME.CREAM_WHITE,
  },
  appbar: {
    backgroundColor: THEME.DARK_CHARCOAL,
    elevation: 0,
  },
  appbarTitle: {
    color: THEME.CREAM_WHITE,
    fontWeight: '800',
    fontSize: 20,
  },
  formContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
    marginTop: 15,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 16,
    color: THEME.MEDIUM_GRAY,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  resendText: {
    fontSize: 15,
    color: THEME.MEDIUM_GRAY,
  },
  resendLink: {
    fontSize: 15,
    color: THEME.VIBRANT_RED,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  submitButton: {
    backgroundColor: THEME.BOLD_YELLOW,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#B0B0B0',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
  },
});

export default PasswordVerifyScreen;

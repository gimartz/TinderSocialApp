// src/screens/ChangePasswordScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Appbar, TextInput} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {THEME} from '../../../../theme';
import {useCustomAlert} from '../../../../../components/customAlert';
import {AppDispatch, RootState} from '../../../../../src/store';
import {
  clearError,
  initiateRestaurantPasswordReset,
} from '../../../../../src/store/features/restaurant/restaurant';

const ChangePasswordScreen = ({navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {isPasswordResetting, error} = useSelector(
    (state: RootState) => state.restaurant,
  );

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCurrentPasswordSecure, setIsCurrentPasswordSecure] = useState(true);
  const [isNewPasswordSecure, setIsNewPasswordSecure] = useState(true);
  const [isConfirmPasswordSecure, setIsConfirmPasswordSecure] = useState(true);

  const {showAlert} = useCustomAlert();

  useEffect(() => {
    if (error) {
      showAlert('error', 'Reset Failed', error);
      dispatch(clearError());
    }
  }, [error, showAlert, dispatch]);

  // Password validation function
  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password,
    );

    return {
      isValid:
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar,
      errors: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumber,
        hasSpecialChar,
      },
    };
  };

  const handleInitiateReset = async () => {
    // Validate current password is provided
    if (!currentPassword.trim()) {
      showAlert('error', 'Validation Error', 'Current password is required.');
      return;
    }

    // Validate new password meets requirements
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      const errorMessages = [];
      if (!passwordValidation.errors.minLength)
        errorMessages.push('at least 8 characters');
      if (!passwordValidation.errors.hasUpperCase)
        errorMessages.push('one uppercase letter');
      if (!passwordValidation.errors.hasLowerCase)
        errorMessages.push('one lowercase letter');
      if (!passwordValidation.errors.hasNumber)
        errorMessages.push('one number');
      if (!passwordValidation.errors.hasSpecialChar)
        errorMessages.push('one special character');

      showAlert(
        'error',
        'Password Requirements',
        `Password must contain: ${errorMessages.join(', ')}.`,
      );
      return;
    }

    // Check if new password is different from current password
    if (currentPassword === newPassword) {
      showAlert(
        'error',
        'Validation Error',
        'New password must be different from current password.',
      );
      return;
    }

    // Confirm password match
    if (newPassword !== confirmPassword) {
      showAlert('error', 'Validation Error', 'New passwords do not match.');
      return;
    }

    const result = await dispatch(
      initiateRestaurantPasswordReset({currentPassword, newPassword}),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      showAlert(
        'success',
        'Verification Sent',
        'We sent an sms to the number linked to this account. Please check it for your six-digit verification code to complete password reset.',
      );
      navigation.navigate('PasswordVerifyScreen');
    }
  };

  // Get password validation status for UI feedback
  const passwordValidation = validatePassword(newPassword);
  const isPasswordValid = newPassword ? passwordValidation.isValid : false;

  return (
    <View style={styles.pageContainer}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={THEME.CREAM_WHITE}
        />
        <Appbar.Content
          title="Change Password"
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
              name="lock-reset"
              size={48}
              color={THEME.VIBRANT_RED}
            />
            <Text style={styles.formTitle}>Secure Your Account</Text>
            <Text style={styles.formSubtitle}>
              Update your password with a strong, secure combination.
            </Text>
          </View>

          {/* Current Password Field */}
          <TextInput
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            style={styles.input}
            secureTextEntry={isCurrentPasswordSecure}
            activeUnderlineColor={THEME.BOLD_YELLOW}
            textColor={THEME.DARK_CHARCOAL}
            right={
              <TextInput.Icon
                icon={isCurrentPasswordSecure ? 'eye-off' : 'eye'}
                onPress={() =>
                  setIsCurrentPasswordSecure(!isCurrentPasswordSecure)
                }
              />
            }
          />

          {/* New Password Field */}
          <TextInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            secureTextEntry={isNewPasswordSecure}
            activeUnderlineColor={THEME.BOLD_YELLOW}
            textColor={THEME.DARK_CHARCOAL}
            right={
              <TextInput.Icon
                icon={isNewPasswordSecure ? 'eye-off' : 'eye'}
                onPress={() => setIsNewPasswordSecure(!isNewPasswordSecure)}
              />
            }
          />

          {/* Password Requirements */}
          {newPassword.length > 0 && (
            <View style={styles.validationContainer}>
              <Text style={styles.validationTitle}>Password must contain:</Text>
              <Text
                style={[
                  styles.validationItem,
                  passwordValidation.errors.minLength &&
                    styles.validationSuccess,
                ]}>
                • At least 8 characters
              </Text>
              <Text
                style={[
                  styles.validationItem,
                  passwordValidation.errors.hasUpperCase &&
                    styles.validationSuccess,
                ]}>
                • One uppercase letter (A-Z)
              </Text>
              <Text
                style={[
                  styles.validationItem,
                  passwordValidation.errors.hasLowerCase &&
                    styles.validationSuccess,
                ]}>
                • One lowercase letter (a-z)
              </Text>
              <Text
                style={[
                  styles.validationItem,
                  passwordValidation.errors.hasNumber &&
                    styles.validationSuccess,
                ]}>
                • One number (0-9)
              </Text>
              <Text
                style={[
                  styles.validationItem,
                  passwordValidation.errors.hasSpecialChar &&
                    styles.validationSuccess,
                ]}>
                • One special character (!@#$%^&* etc.)
              </Text>
              <Text
                style={[
                  styles.validationItem,
                  currentPassword !== newPassword && styles.validationSuccess,
                ]}>
                • Different from current password
              </Text>
            </View>
          )}

          <TextInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry={isConfirmPasswordSecure}
            activeUnderlineColor={THEME.BOLD_YELLOW}
            textColor={THEME.DARK_CHARCOAL}
            right={
              <TextInput.Icon
                icon={isConfirmPasswordSecure ? 'eye-off' : 'eye'}
                onPress={() =>
                  setIsConfirmPasswordSecure(!isConfirmPasswordSecure)
                }
              />
            }
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!isPasswordValid || !confirmPassword || !currentPassword) &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleInitiateReset}
            disabled={
              isPasswordResetting ||
              !isPasswordValid ||
              !confirmPassword ||
              !currentPassword
            }>
            {isPasswordResetting ? (
              <ActivityIndicator color={THEME.DARK_CHARCOAL} />
            ) : (
              <Text style={styles.submitButtonText}>
                Request Password Reset
              </Text>
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
    fontSize: 22,
  },
  formContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 50,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 30,
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
  input: {
    backgroundColor: THEME.LIGHT_GRAY,
    borderRadius: 12,
    fontSize: 16,
    color: THEME.DARK_CHARCOAL,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  validationContainer: {
    backgroundColor: THEME.LIGHT_GRAY,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  validationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.DARK_CHARCOAL,
    marginBottom: 8,
  },
  validationItem: {
    fontSize: 12,
    color: THEME.MEDIUM_GRAY,
    marginBottom: 4,
  },
  validationSuccess: {
    color: '#4CAF50', // Green color for success
    fontWeight: '600',
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
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
  },
});

export default ChangePasswordScreen;

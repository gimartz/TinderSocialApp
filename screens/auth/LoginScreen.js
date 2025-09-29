// src/screens/LoginScreen.js
import React, {useState} from 'react';
import {
  StyleSheet,
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  HelperText,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {
  loginUser,
  selectFcmToken,
  UpdateFcm,
} from '../../src/store/features/auth/authSlice';
import {colors} from '../../theme/colors'; // Your defined color theme
import {SafeAreaView} from 'react-native-safe-area-context'; // For handling safe areas (notches, etc.)
import {useCustomAlert} from '../../components/customAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../../utils/storage';
import { THEME } from '../theme';

// Replace with your actual logo
const logo = require('../../assets/rider-logo.jpeg'); // Ensure this path is correct and the image exists

const LoginScreen = ({navigation}) => {
  const {showAlert} = useCustomAlert();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [deviceOs] = useState(Platform.OS === 'ios' ? 'IOS' : 'ANDROID');

  const FcmToken = useSelector(selectFcmToken);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch();

  const validateFields = () => {
    let isValid = true;
    if (!email.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Password is required.');
      isValid = false;
    } else {
      setPasswordError('');
    }
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateFields()) {
      return;
    }

    const vendor = {email, password};
    setLoading(true);

    try {
      const resultAction = await dispatch(loginUser(vendor));

      if (loginUser.fulfilled.match(resultAction)) {
        try {
          const payload = {token: FcmToken, deviceOs: deviceOs};
          await dispatch(UpdateFcm(payload)); // No need to await if not using the result immediately
        } catch {
          console.log('FCM token could not be updated on login');
        }
    
        // Navigate to Dashboard
        navigation.navigate('MainApp', {screen: 'Dashboard'});
        showAlert('success', 'Success', 'Welcome back');
      } else {
        console.log('Login failed:', resultAction.payload);
        showAlert(
          'error',
          'Error',
          typeof resultAction.payload === 'string'
            ? resultAction.payload
            : 'Login Failed',
        );
      }
    } catch (err) {
      console.error('An unexpected error occurred', err);
      showAlert(
        'error',
        'Error',
        err?.message || 'An unexpected error occurred. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled">
          {/* Top Section with Logo and Title */}
          <View style={styles.topSection}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Title style={styles.appTitle}>Vendor</Title>
            <Paragraph style={styles.appSubtitle}>
              Manage your operations efficiently
            </Paragraph>
          </View>

          {/* Login Card - Overlapping the top section */}
          <Card style={styles.loginCard} elevation={10}>
            <Card.Content>
              <Title style={styles.cardTitle}>Sign In</Title>
              <Paragraph style={styles.cardSubtitle}>
                Welcome back! Please enter your details
              </Paragraph>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  mode="flat" // Modern flat input style
                  style={styles.input}
                  textColor={THEME.DARK_CHARCOAL}
                  activeUnderlineColor={colors.primary} // Underline color when active
                  underlineColor={colors.grey_medium} // Default underline color
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={!!emailError}
                  theme={{
                    colors: {
                      placeholder: colors.placeholder,
                      text: colors.text,
                      primary: colors.primary,
                      background: colors.surface,
                    },
                  }}
                />
                <HelperText
                  type="error"
                  visible={!!emailError}
                  style={styles.helperText}>
                  {emailError}
                </HelperText>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  mode="flat" // Modern flat input style
                  style={styles.input}
                  activeUnderlineColor={colors.primary}
                  textColor={THEME.DARK_CHARCOAL}
                  underlineColor={colors.grey_medium}
                  secureTextEntry={!isPasswordVisible}
                  error={!!passwordError}
                  right={
                    <TextInput.Icon
                      icon={isPasswordVisible ? 'eye-off' : 'eye'}
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                      color={colors.grey_medium}
                    />
                  }
                  theme={{
                    colors: {
                      placeholder: colors.placeholder,
                      text: colors.text,
                      primary: colors.primary,
                      background: colors.surface,
                    },
                  }}
                />
                <HelperText
                  type="error"
                  visible={!!passwordError}
                  style={styles.helperText}>
                  {passwordError}
                </HelperText>
              </View>

              {/* Forgot Password Button */}
              <Button
                mode="text"
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotPasswordButton}
                labelStyle={styles.forgotPasswordText}>
                Forgot Password?
              </Button>

              {/* Login Button */}
              <Button
                buttonColor={colors.primary}
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}
                disabled={loading}
                loading={loading}
                labelStyle={styles.loginButtonLabel}>
                {loading ? 'Authenticating...' : 'Login'}
              </Button>
            </Card.Content>
          </Card>

          {/* Sign Up Link */}
          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            style={styles.signUpButton}
            labelStyle={styles.signUpText}>
            Don't have an account?{' '}
            <Paragraph style={{fontWeight: 'bold', color: colors.primary}}>
              Sign Up
            </Paragraph>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background, // Main screen background
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
    justifyContent: 'flex-start', // Align content to the top initially
  },
  topSection: {
    backgroundColor: colors.primary, // Header background color
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50, // Space from the top of the screen
    paddingBottom: 100, // Provides space for the card to overlap
    borderBottomLeftRadius: 30, // Subtle curve
    borderBottomRightRadius: 30,
    overflow: 'hidden', // Ensures radius is clipped correctly
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50, // Circular logo
    borderWidth: 2,
    borderColor: colors.background, // White border around logo
    marginBottom: 15,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text, // Using text color for contrast on primary background
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 16,
    color: colors.grey_dark, // Slightly darker grey for subtitle
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  loginCard: {
    width: '90%', // Wider card
    alignSelf: 'center', // Center the card
    marginTop: -70, // Overlaps the topSection
    borderRadius: 15, // Rounded corners for the card
    backgroundColor: colors.surface,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8}, // More pronounced shadow
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 10, // Space below the card
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardSubtitle: {
    textAlign: 'center',
    marginBottom: 25,
    color: colors.grey_medium,
    fontSize: 15,
  },
  inputContainer: {
    marginBottom: 5,
  },
  input: {
    backgroundColor: colors.surface, // Ensures input background matches card for flat mode
    fontSize: 16,
    paddingHorizontal: 0, // Remove default padding for flat mode
  },
  helperText: {
    marginLeft: 0,
    marginBottom: 10,
    color: colors.accent, // Error messages in accent red
    fontSize: 12,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 5,
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: colors.primary, // Link text in primary color
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    width: '100%',
    paddingVertical: 8,
    marginTop: 15,
    borderRadius: 8,
    backgroundColor: colors.primary, // Login button in primary color
  },
  loginButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text, // Text color for contrast on primary button
  },
  signUpButton: {
    marginTop: 20,
    marginBottom: 30, // Space at the bottom
    alignSelf: 'center', // Center the sign up button
  },
  signUpText: {
    color: colors.text, // Default text color
    fontSize: 15,
  },
});

export default LoginScreen;

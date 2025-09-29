import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';

type RouteParams = {
  verificationId: string;
  email: string;
};

type NavigationProps = {
  goBack: () => void;
  navigate: (screen: string, params?: any) => void;
};

const ForgotPasswordCompleteScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProps>();
  const {verificationId, email} = route.params as RouteParams;
  const [code, setCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

 
  const handleGoBack = () => navigation.goBack();

  const validatePasswordFrontend = (password: string) => {
    // Reset errors
    setPasswordError(null);
    
    // Minimum length check
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }

    // Check for required character types
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    // Identify invalid characters (not in the allowed set)
    const allowedChars = /^[A-Za-z\d@$!%_*?&]+$/;
    const invalidChars = [...password].filter((char) => !allowedChars.test(char));
    const uniqueInvalidChars = [...new Set(invalidChars)];

    // Build error message
    let errorMessage = "";
    if (!hasLowercase) errorMessage += "• At least one lowercase letter\n";
    if (!hasUppercase) errorMessage += "• At least one uppercase letter\n";
    if (!hasNumber) errorMessage += "• At least one number\n";
    if (!hasSpecialChar) errorMessage += "• At least one special character (@$!%*?&)\n";
    if (invalidChars.length > 0) {
      errorMessage += `• Invalid characters: ${uniqueInvalidChars.join(", ")}\n`;
    }

    if (errorMessage) {
      setPasswordError("Password requirements:\n" + errorMessage);
      return false;
    }

    return true;
  };

  const validatePasswordMatch = () => {
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError(null);
    return true;
  };

  const handleSubmit = async () => {
    // Validate passwords match
    if (!validatePasswordMatch()) return;
    
    // Validate password complexity
    if (!validatePasswordFrontend(newPassword)) return;

     Alert.alert('Success', 'Password updated successfully!');
        navigation.navigate('Login');
  };

   // Add this useEffect to validate whenever passwords change
   useEffect(() => {
    if (newPassword && confirmPassword) {
      validatePasswordMatch();
    }
  }, [newPassword, confirmPassword]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <AntDesign name="leftcircle" size={24} color="#FFA500" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.illustrationContainer}>
            <AntDesign
              name="lock"
              size={72}
              color="#FFA500"
              style={styles.icon}
            />
            <Text style={styles.subtitle}>
              Code sent to phone linked with {email}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="Verification Code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              mode="outlined"
              style={styles.input}
              theme={{
                colors: {
                  primary: '#FFA500',
                  placeholder: '#999',
                  background: '#FFF8E1',
                },
              }}
              left={<TextInput.Icon icon="numeric" color="#FFA500" />}
            />

            <TextInput
              label="New Password"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                validatePasswordFrontend(text);
                // if (confirmPassword) validatePasswordMatch();
              }}
              secureTextEntry={!showPassword}
              mode="outlined"
              style={styles.input}
              theme={{
                colors: {
                  primary: '#FFA500',
                  placeholder: '#999',
                  background: '#FFF8E1',
                },
              }}
              left={<TextInput.Icon icon="lock" color="#FFA500" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                  color="#FFA500"
                />
              }
            />
            {passwordError && (
              <Text style={styles.errorText}>{passwordError}</Text>
            )}

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                validatePasswordMatch();
              }}
              secureTextEntry={!showConfirmPassword}
              mode="outlined"
              style={styles.input}
              theme={{
                colors: {
                  primary: '#FFA500',
                  placeholder: '#999',
                  background: '#FFF8E1',
                },
              }}
              left={<TextInput.Icon icon="lock-reset" color="#FFA500" />}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  color="#FFA500"
                />
              }
            />
            {confirmPasswordError && (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                ( 
                 !code || 
                 !newPassword || 
                 !confirmPassword || 
                 passwordError || 
                 confirmPasswordError) && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={
                
                !code || 
                !newPassword || 
                !confirmPassword || 
                !!passwordError || 
                !!confirmPasswordError
              }>
             
                <Text style={styles.buttonText}>Reset Password</Text>
              
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFECB3',
    backgroundColor: '#FFECB3',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF8C00',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#E65100',
    textAlign: 'center',
    marginTop: 8,
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFF',
    marginBottom: 8, // Reduced to make room for error text
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FFA500',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 8,
  },
});

export default ForgotPasswordCompleteScreen;
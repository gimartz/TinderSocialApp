import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {InitiateForgotPasswordReset} from '../../../src/store/features/auth/authSlice';
import {AppDispatch, RootState} from '../../../src/store';

type NavigationProps = {
  goBack: () => void;
  navigate: (screen: string, params?: any) => void;
};

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();

  const {passwordResetIsLoading} = useSelector(
    (store: RootState) => store.auth,
  );
  const navigation = useNavigation<NavigationProps>();

  const handleGoBack = () => navigation.goBack();

  const handleSubmit = async () => {
    try {
      const response = await dispatch(InitiateForgotPasswordReset({email}));
      // console.log('forgot password response:', response);
      if (response.meta.requestStatus === 'fulfilled') {
        navigation.navigate('ForgotPasswordComplete', {
          verificationId: response?.payload?.data?.verificationId,
          email,
        });
      } else {
        // console.log('forgot password error:', response.payload);
        Alert.alert(
          'Error',
          typeof response.payload === 'string'
            ? response.payload
            : 'Failed to reset password',
        );
      }
    } catch (error: any) {
      console.log('forgot password error:', error?.response, error);
      Alert.alert(
        'Error',
        error?.data?.error ? error?.data?.error : 'Failed to send code',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <AntDesign name="leftcircle" size={24} color="#FFA500" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot Password</Text>
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
              Enter your email. We will send a verification code to the phone
              number linked to entered email
            </Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              style={styles.input}
              theme={{
                colors: {
                  primary: '#FFA500',
                  placeholder: '#999',
                  background: '#FFF8E1',
                },
              }}
              left={<TextInput.Icon icon="email" color="#FFA500" />}
            />

            <TouchableOpacity
              style={[
                styles.button,
                passwordResetIsLoading && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={passwordResetIsLoading}>
              {passwordResetIsLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Send Verification Code</Text>
              )}
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
    justifyContent: 'center',
    paddingBottom: 100,
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
    padding: 10,
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFF',
    marginBottom: 20,
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
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;

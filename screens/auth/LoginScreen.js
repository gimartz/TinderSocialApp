// src/screens/LoginScreen.js
import React, {useState} from 'react';
import {
  StyleSheet,
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {colors} from '../../theme/colors'; // Your defined color theme
import {SafeAreaView} from 'react-native-safe-area-context'; // For handling safe areas (notches, etc.)
import {useCustomAlert} from '../../components/customAlert';
import {
  Text,
  TextInput,
  Button,
  Checkbox,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';;
import Icon from 'react-native-vector-icons/Ionicons';

// Define a custom theme to override default colors
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#BF0071', // Brand 
    accent: '#4A90E2',  // Forgot password blue
    background: 'white',
    surface: '#F5F5F5', // Input background
    onSurface: '#000000',
  },
};

const LoginScreen = ({navigation}) => {
  const {showAlert} = useCustomAlert();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [deviceOs] = useState(Platform.OS === 'ios' ? 'IOS' : 'ANDROID');
  const [rememberMe, setRememberMe] = useState(true);
  

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
 const handleBack = () => {
  
      navigation.goBack();
    
  };
  const handleLogin = async () => {
    // if (!validateFields()) {
    //   return;
    // }

    const vendor = {email, password};
    setLoading(true);

    try {
    
        // Navigate to Dashboard
        navigation.navigate('MainApp', {screen: 'Dashboard'});
        showAlert('success', 'Success', 'Welcome back');
    
    } catch (err) {
      console.error('An unexpected error occurred', err);
      showAlert(
        'error',
        'Error',
      
      );
    } finally {
      setLoading(false);
    }
  };

  return (
     <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        {/* Header */} 
               
                
        <View style={styles.header}>
 <TouchableOpacity onPress={handleBack}>
                  <Icon name="arrow-back" size={28} color="#121212" />
                </TouchableOpacity>
          <Text variant="headlineLarge" style={styles.titleRed}>Welcome</Text>
          <Text variant="headlineLarge" style={styles.titleBlack}>back!</Text>
        </View>
        <Text style={styles.subtitle}>
       Sign in to discover matches, chat instantly, and find meaningful connections near you. </Text>

        {/* Input Fields */}
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="email-outline" />}
          theme={{ roundness: 12 }}
          outlineStyle={styles.inputOutline}
        />
        <TextInput
          label="Password"
          value={password} 
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={!isPasswordVisible}
          style={styles.input}
          left={<TextInput.Icon icon="lock-outline" />}
          right={
            <TextInput.Icon
              icon={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            />
          }
          theme={{ roundness: 12 }}
          outlineStyle={styles.inputOutline}
        />

        {/* Options Row */}
        <View style={styles.optionsRow}>
          <Checkbox.Item
            label="Remember me"
            status={rememberMe ? 'checked' : 'unchecked'}
            onPress={() => setRememberMe(!rememberMe)}
            position="leading"
            style={styles.checkboxContainer}
            labelStyle={styles.checkboxLabel}
            color={theme.colors.primary}
          />
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot password</Text>
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.signInButton}
          labelStyle={styles.signInButtonLabel}
          contentStyle={styles.signInButtonContent}
        >
          Sign in
        </Button>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          mode="outlined"
          onPress={() => console.log('Continue with Google')}
          style={styles.googleButton}
          labelStyle={styles.googleButtonLabel}
          icon={() => <Image source={require('../../assets/logo.png')} style={{width: 20, height: 20}} />} // Add google-logo.png to your assets
        >
          Continue with google
        </Button>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.createAccountText}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 25,
  },
  header: {
    marginBottom: 10,
  },
  titleRed: {
    color: '#BF0071',
    fontWeight: 'bold',fontSize:40
  },
  titleBlack: {
    color: '#000',
    fontWeight: 'bold',fontSize:40,
    marginTop: 10, // To bring it closer to "Welcome"
  },
  subtitle: {
    fontSize: 15,
    color: '#8A8A8A',
    marginBottom: 30,
    lineHeight: 22,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',height:80
  },
  inputOutline: {
      borderColor: '#F7F7F7', // Match background to hide the border initially
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    paddingHorizontal: 0,
    marginLeft: -10, // Align checkbox with input fields
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#555',
  },
  forgotPassword: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
  signInButton: {
    borderRadius: 12,
    elevation: 2,
  },
  signInButtonContent: {
      paddingVertical: 8,
  },
  signInButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#8A8A8A',
  },
  googleButton: {
    borderRadius: 12,
    borderColor: '#E0E0E0',
    paddingVertical: 4,
  },
  googleButtonLabel: {
    color: '#555',
    fontWeight: '600',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 10,
  },
  footerText: {
    color: '#8A8A8A',
  },
  createAccountText: {
    color: '#BF0071',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
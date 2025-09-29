import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  View,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {THEME} from '../theme';
import {useFocusEffect} from '@react-navigation/native';
import { useAuth } from '../context/cat';

const {width, height} = Dimensions.get('window');

type Props = {
  navigation: any;
};

const SplashScreen = ({navigation}: Props) => {
   const { isAuthenticated } = useAuth();
  const [isInitialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [navigationDecided, setNavigationDecided] = useState(false);
  const [minWaitTimeElapsed, setMinWaitTimeElapsed] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  // Initialize auth state from AsyncStorage
  useEffect(() => {
    const init = async () => {

      try {
        const value = await AsyncStorage.getItem('@viewedOnboarding');
        if (value !== null) {
          setInitialized(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };


    init();
  }, []);
  // Set minimum wait timer (5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinWaitTimeElapsed(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Handle navigation when both conditions are met
  useEffect(() => {
    if (navigationDecided && minWaitTimeElapsed && animationComplete) {
      // Navigate based on auth status
      if (!isAuthenticated) {
        navigation.replace('OnboardLogin', {
          screen: 'Land',
        });
      } else {
        navigation.replace('MainApp', {screen: 'Dashboard'});
      }
    }
  }, [
    navigationDecided,
    minWaitTimeElapsed,
    animationComplete,
    isAuthenticated,
    navigation,
  ]);

  // Start the animation sequence
  useEffect(() => {
    Animated.sequence([
      // Fade in and scale up logo
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),

      // Fade in text
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),

      // Wait for a moment
      Animated.delay(500),

      // Fade everything out
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setAnimationComplete(true);
    });
  }, [logoOpacity, logoScale, textOpacity]);

  // Handle navigation decision once auth is initialized
  useEffect(() => {
    if (isInitialized && !isLoading) {
      setNavigationDecided(true);
    }
  }, [isInitialized, isLoading]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: logoOpacity,
            transform: [{scale: logoScale}],
          },
        ]}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
        />
        <Text
          style={{
            color: THEME.WARNING_ORANGE,
            fontSize: 20,
            fontWeight: 'bold',
            position: 'absolute',
            bottom: 25,
          }}>
          App
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 100,
  },
});

export default SplashScreen;

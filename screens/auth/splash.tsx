import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  View,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME } from '../theme';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: any;
};

const SplashScreen = ({ navigation }: Props) => {
  const [isInitialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [navigationDecided, setNavigationDecided] = useState(false);
  const [minWaitTimeElapsed, setMinWaitTimeElapsed] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // simplified auth state

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  // Initialize auth state and onboarding from AsyncStorage
  useEffect(() => {
    const init = async () => {
      try {
        const viewedOnboarding = await AsyncStorage.getItem('@viewedOnboarding');
        const userToken = await AsyncStorage.getItem('@userToken'); // or any auth token/key

        if (viewedOnboarding !== null) {
          setInitialized(true);
        }

        if (userToken !== null) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Minimum wait timer (5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinWaitTimeElapsed(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Navigation decision
  useEffect(() => {
    if (isInitialized && !isLoading) {
      setNavigationDecided(true);
    }
  }, [isInitialized, isLoading]);

  // Navigate when ready
  useEffect(() => {
    if ( minWaitTimeElapsed && animationComplete) {
      if (!isAuthenticated) {
     navigation.replace('OnboardLogin', {
screen: 'Land',
});
      } else {
   navigation.replace('MainApp', {screen: 'Dashboard'});

      }
    }
  }, [navigationDecided, minWaitTimeElapsed, animationComplete, isAuthenticated, navigation]);

  // Animation sequence
  useEffect(() => {
    Animated.sequence([
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
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(new Animated.Value(0), {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
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
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Animated.Text
          style={{
            color: THEME.WARNING_ORANGE,
            fontSize: 20,
            fontWeight: 'bold',
            position: 'absolute',
            bottom: 25,
            opacity: textOpacity,
          }}
        >
          App
        </Animated.Text>
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

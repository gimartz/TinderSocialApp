// src/components/CustomToast.js
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Surface, Text, Title} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ToastColors} from './index';
import {runOnJS} from 'react-native-reanimated';

const TOAST_HEIGHT = 80;
const TOAST_VISIBLE_DURATION = 4000; // 4 seconds

const ICONS = {
  success: 'check-circle-outline',
  error: 'alert-circle-outline',
  warning: 'alert-outline',
  info: 'information-outline',
};

const CustomToast = ({config, onDismiss}) => {
  const insets = useSafeAreaInsets();
  const topPosition = insets.top + 10;
  const translateY = useSharedValue(-TOAST_HEIGHT - topPosition);

  const {type = 'info', title, message} = config;
  const theme = ToastColors[type];

  // Animation for the toast sliding in and out
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  // Gesture for swiping the toast away
  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      // Only allow swiping up
      if (event.translationY < 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd(() => {
      if (translateY.value < -TOAST_HEIGHT / 2) {
        // If swiped far enough, animate it out and dismiss
        translateY.value = withTiming(
          -TOAST_HEIGHT - topPosition,
          {},
          finished => {
            if (finished) runOnJS(onDismiss)();
          },
        );
      } else {
        // Otherwise, spring back to the visible position
        translateY.value = withSpring(0);
      }
    });

  // Effect to show and hide the toast
  useEffect(() => {
    // Animate in
    translateY.value = withSpring(0, {damping: 15, stiffness: 120});

    // Set a timer to automatically dismiss
    const timer = setTimeout(() => {
      translateY.value = withTiming(
        -TOAST_HEIGHT - topPosition,
        {},
        finished => {
          if (finished) runOnJS(onDismiss)();
        },
      );
    }, TOAST_VISIBLE_DURATION);

    return () => clearTimeout(timer);
  }, [onDismiss, translateY, topPosition]);

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[styles.container, {top: topPosition}, animatedStyle]}>
          <Surface
            style={[
              styles.surface,
              {backgroundColor: theme.background, borderColor: theme.accent},
            ]}>
            <MaterialCommunityIcons
              name={ICONS[type]}
              size={30}
              color={theme.accent}
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              <Title style={[styles.title, {color: theme.accent}]}>
                {title}
              </Title>
              <Text style={styles.message}>{message}</Text>
            </View>
          </Surface>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  surface: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 8, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: ToastColors.text,
    lineHeight: 20,
  },
});

export default CustomToast;

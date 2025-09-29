import React, {useEffect, useRef, useState} from 'react';
import {TouchableOpacity, StyleSheet, Animated, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectGetVendorStatusLoading,
  selectIsVendorActive,
  selectUpdateVendorStatusLoading,
  updateVendorActiveStatus,
} from '../../src/store/features/auth/authSlice';
import {AppDispatch, RootState} from '../../src/store';
import {useCustomAlert} from '../customAlert';

const AvailabilityToggle = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isVendorActive = useSelector(selectIsVendorActive);

  const isLoadingStatusUpdate = useSelector(selectUpdateVendorStatusLoading);
  const isLoadingStatusFetching = useSelector(selectGetVendorStatusLoading);

  const translateX = useRef(
    new Animated.Value(isVendorActive ? 18 : 0),
  ).current;

  const {showAlert} = useCustomAlert();

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isVendorActive ? 18 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isVendorActive, translateX]);

  const handleToggle = async () => {
    if (isLoadingStatusUpdate) {
      console.log('Toggle disabled due to:', {
        isLoadingStatusUpdate,
      });
      return;
    }

    const newStatus = !isVendorActive;

    try {
      const resultAction = await dispatch(
        updateVendorActiveStatus(!isVendorActive),
      );

      if (resultAction.meta.requestStatus === 'fulfilled') {
        // console.log('Toggle successful');
        newStatus
          ? showAlert('success', 'Status Updated', `Your store is now online.`)
          : showAlert('error', 'Status Updated', `Your store is now offline`);
      } else {
        // console.log('Toggle failed - reverting');
        // setLocalIsAvailable(!newStatus);
        showAlert('error', 'Update Failed', 'Could not update status.');
      }
    } catch (error) {
      // console.log('Toggle error - reverting:', error);
      // setLocalIsAvailable(!newStatus);
      showAlert('error', 'Update Failed', 'An unexpected error occurred.');
    }
  };

  // Render the thumb content in a separate variable to avoid hook order issues
  const renderThumbContent = () => {
    if (isLoadingStatusUpdate) {
      return <ActivityIndicator size={20} color="#FFFFFF" />;
    }
    return (
      <Animated.View style={[styles.thumb, {transform: [{translateX}]}]} />
    );
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={handleToggle}
        disabled={isLoadingStatusUpdate}
        activeOpacity={0.7}>
        <Animated.View
          style={[styles.track, isVendorActive && styles.trackEnabled]}>
          {renderThumbContent()}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 44,
    height: 28,
    justifyContent: 'center',
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    backgroundColor: '#BDBDBD',
    justifyContent: 'center',
    padding: 2,
  },
  trackEnabled: {
    backgroundColor: '#34C759',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default AvailabilityToggle;

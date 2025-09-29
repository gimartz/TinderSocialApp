import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityIndicator, Switch} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PageHeader from '../../src/constants/Header';
import {registerUser} from '../../src/store/features/auth/authSlice';
import {COLORS} from '../../src/constants/colors';
import {AppDispatch, RootState} from '../../src/store';
import {fetchRestaurantCategory} from '../../src/store/features/restaurant/restaurant-category';
import CategorySelector from '../../components/auth/registration/categorySelector';

// Enhanced type definitions
type OpeningHours = {
  [key: string]: {
    open: string;
    close: string;
  };
};

type LocationData = {
  latitude?: string;
  longitude?: string;
};

type RouteParams = {
  params: {
    data: {
      email: string;
      phone: string;
      password: string;
      address: string;
      loc: LocationData;
      vendorDesc: string;
      restaurantName: string;
    };
  };
};

// Color scheme
const colors = {
  primary: '#FFC107',
  primaryDark: '#FFA000',
  background: '#FFFDE7',
  surface: '#FFFFFF',
  text: '#2E2E2E',
  textSecondary: '#616161',
  error: '#E53935',
  border: '#FFE082',
  placeholder: '##9E9E9E',
  info: '#FF9800',
};

const DEFAULT_OPEN_TIME = '08:00';
const DEFAULT_CLOSE_TIME = '21:00';

// Centralized Tooltip Modal Component
const TooltipModal = ({
  isVisible,
  message,
  onClose,
}: {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={tooltipStyles.modalOverlay} onPress={onClose}>
        <View style={tooltipStyles.tooltipContainer}>
          <View style={tooltipStyles.tooltip}>
            <Text style={tooltipStyles.tooltipText}>{message}</Text>
            <TouchableOpacity
              style={tooltipStyles.closeButton}
              onPress={onClose}>
              <Icon name="close" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

// Information Tooltip Component that triggers the centralized modal
const InfoTooltip = ({
  message,
  onShowTooltip,
}: {
  message: string;
  onShowTooltip: (message: string) => void;
}) => {
  return (
    <View style={tooltipStyles.container}>
      <TouchableOpacity
        onPress={() => onShowTooltip(message)}
        style={tooltipStyles.iconButton}>
        <Icon name="info-outline" size={18} color={colors.info} />
      </TouchableOpacity>
    </View>
  );
};

const CompleteOnboarding: React.FC<{route: RouteParams; navigation: any}> = ({
  route,
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {fcmToken} = useSelector((store: RootState) => store.auth);
  const {restaurant_categories, is_loading_restaurant_category} = useSelector(
    (store: RootState) => store.restaurantCategory,
  );

  const [deliveryOrder, setDeliveryOrder] = useState<number>(1);
  const [deliveryRadius, setDeliveryRadius] = useState<number>(5);
  const [useSameHours, setUseSameHours] = useState<boolean>(true);
  const [sameHours, setSameHours] = useState({
    open: DEFAULT_OPEN_TIME,
    close: DEFAULT_CLOSE_TIME,
  });
  const [customHours, setCustomHours] = useState<OpeningHours>({});
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [currentDay, setCurrentDay] = useState<string>('');
  const [currentTimeType, setCurrentTimeType] = useState<'open' | 'close'>(
    'open',
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // State for centralized tooltip modal
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [currentTooltipMessage, setCurrentTooltipMessage] = useState('');

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const {data} = route.params;
  const {email, phone, password, address, loc, vendorDesc, restaurantName} =
    data;
  const {latitude, longitude} = loc || {};

  const daysOfWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const handleShowTooltip = (message: string) => {
    setCurrentTooltipMessage(message);
    setTooltipVisible(true);
  };

  const handleCloseTooltip = () => {
    setTooltipVisible(false);
  };

  const formatTimeForDisplay = (time: string | undefined) => {
    if (!time) return 'Set time';

    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const handleTimeConfirm = (time: Date) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    // console.log('Setting time for:', currentDay, currentTimeType, formattedTime);

    if (useSameHours) {
      setSameHours(prev => ({
        ...prev,
        [currentTimeType]: formattedTime,
      }));
    } else {
      setCustomHours(prev => ({
        ...prev,
        [currentDay]: {
          ...prev[currentDay],
          [currentTimeType]: formattedTime,
        },
      }));
    }
    setIsTimePickerVisible(false);
  };

  const showTimePicker = (day: string, type: 'open' | 'close') => {
    setCurrentDay(day);
    setCurrentTimeType(type);
    setIsTimePickerVisible(true);
  };

  const getDayHours = (day: string) => {
    if (useSameHours) return sameHours;

    // Return the custom hours for the day, or default hours if not set
    const dayHours = customHours[day];
    if (dayHours && dayHours.open && dayHours.close) {
      return dayHours;
    }

    return {
      open: DEFAULT_OPEN_TIME,
      close: DEFAULT_CLOSE_TIME,
    };
  };

  const toggleCustomHours = () => {
    const newUseSameHours = !useSameHours;
    setUseSameHours(newUseSameHours);

    if (newUseSameHours) {
      // When switching back to same hours, clear custom hours
      setCustomHours({});
    } else {
      // When switching to custom hours, initialize all days with current sameHours
      const initialCustomHours: OpeningHours = {};
      daysOfWeek.forEach(day => {
        initialCustomHours[day] = {...sameHours};
      });
      setCustomHours(initialCustomHours);
    }
  };

  const handleRegister = async () => {
    if (selectedCategoryIds.length === 0) {
      Alert.alert('Error', 'Please select at least one restaurant category');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      // Prepare opening hours object
      const openingHours: OpeningHours = {};

      daysOfWeek.forEach(day => {
        if (useSameHours) {
          openingHours[day] = sameHours;
        } else {
          openingHours[day] = customHours[day] || {
            open: DEFAULT_OPEN_TIME,
            close: DEFAULT_CLOSE_TIME,
          };
        }
      });

      const registerVendor = {
        name: restaurantName,
        email,
        phone,
        password,
        description: vendorDesc,
        fcmToken: fcmToken || 'placeholder_token_for_get_fcmtoken_failure',
        categoryIds: selectedCategoryIds,
        address,
        latitude: parseFloat(String(latitude) || '0'),
        longitude: parseFloat(String(longitude) || '0'),
        deliveryRadius,
        minimumOrder: deliveryOrder,
        openingHours,
      };

      // console.log(registerVendor);

      const resultAction = await dispatch(registerUser(registerVendor as any));

      if (resultAction.meta.requestStatus === 'fulfilled') {
        Alert.alert(
          'Success',
          'Registration successful! Please login with your newly created credentials',
        );
        navigation.navigate('Login');
      } else {
        const errorMessage =
          resultAction.payload || 'Registration failed. Please try again.';
        Alert.alert('Error', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshCategories = async () => {
    await dispatch(fetchRestaurantCategory({}));
  };

  // Fetch categories on component mount
  useEffect(() => {
    if (!restaurant_categories || restaurant_categories.length === 0) {
      handleRefreshCategories();
    }
  }, []);

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={{marginTop: 20}}>
        <PageHeader title="Store Operations" show={false} action={false} />
      </View>

      {/* Minimum Order */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.label, {color: colors.text}]}>Minimum Order</Text>
        <View style={styles.infoIconContainer}>
          <InfoTooltip
            message="Set the minimum order quantity required for customers to place an order"
            onShowTooltip={handleShowTooltip}
          />
        </View>
      </View>
      <View
        style={[
          styles.inputContainer,
          {backgroundColor: colors.surface, borderColor: colors.border},
        ]}>
        <Picker
          selectedValue={deliveryOrder}
          onValueChange={setDeliveryOrder}
          style={{color: colors.text}}>
          {Array.from({length: 5}, (_, i) => (
            <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
          ))}
        </Picker>
      </View>

      {/* Delivery Radius */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.label, {color: colors.text}]}>
          Delivery Radius (km)
        </Text>
        <View style={styles.infoIconContainer}>
          <InfoTooltip
            message="Set the maximum distance you can deliver orders to"
            onShowTooltip={handleShowTooltip}
          />
        </View>
      </View>
      <View
        style={[
          styles.inputContainer,
          {backgroundColor: colors.surface, borderColor: colors.border},
        ]}>
        <Picker
          selectedValue={deliveryRadius}
          onValueChange={setDeliveryRadius}
          style={{color: colors.text}}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
            <Picker.Item key={value} label={`${value}`} value={value} />
          ))}
        </Picker>
      </View>

      {/* Opening Hours Section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.label, {color: colors.text, marginTop: 20}]}>
          Opening Hours
        </Text>
        <View style={styles.infoIconContainer}>
          <InfoTooltip
            message="Set your restaurant's operating hours. You can set the same hours for all days or customize for each day"
            onShowTooltip={handleShowTooltip}
          />
        </View>
      </View>
      <View style={styles.switchContainer}>
        <Text style={{color: colors.text}}>Same hours every day</Text>
        <Switch
          value={useSameHours}
          onValueChange={toggleCustomHours}
          color={colors.primary}
        />
      </View>
      {useSameHours ? (
        <View style={[styles.timeContainer, {backgroundColor: colors.surface}]}>
          <Text style={[styles.dayLabel, {color: colors.text}]}>All Days</Text>

          <View style={styles.timeRow}>
            <Text style={[styles.timeLabel, {color: colors.text}]}>Open:</Text>
            <TouchableOpacity
              style={[styles.timeButton, {borderColor: colors.border}]}
              onPress={() => showTimePicker('monday', 'open')}>
              <Text style={{color: colors.text}}>
                {formatTimeForDisplay(sameHours.open)}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeRow}>
            <Text style={[styles.timeLabel, {color: colors.text}]}>Close:</Text>
            <TouchableOpacity
              style={[styles.timeButton, {borderColor: colors.border}]}
              onPress={() => showTimePicker('monday', 'close')}>
              <Text style={{color: colors.text}}>
                {formatTimeForDisplay(sameHours.close)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        daysOfWeek.map(day => {
          const hours = getDayHours(day);
          return (
            <View
              key={day}
              style={[styles.timeContainer, {backgroundColor: colors.surface}]}>
              <Text style={[styles.dayLabel, {color: colors.text}]}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </Text>

              <View style={styles.timeRow}>
                <Text style={[styles.timeLabel, {color: colors.text}]}>
                  Open:
                </Text>
                <TouchableOpacity
                  style={[styles.timeButton, {borderColor: colors.border}]}
                  onPress={() => showTimePicker(day, 'open')}>
                  <Text style={{color: colors.text}}>
                    {formatTimeForDisplay(hours.open)}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.timeRow}>
                <Text style={[styles.timeLabel, {color: colors.text}]}>
                  Close:
                </Text>
                <TouchableOpacity
                  style={[styles.timeButton, {borderColor: colors.border}]}
                  onPress={() => showTimePicker(day, 'close')}>
                  <Text style={{color: colors.text}}>
                    {formatTimeForDisplay(hours.close)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}

      {/* Restaurant Categories Section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.label, {color: colors.text}]}>
          Restaurant Categories
        </Text>
        <View style={styles.infoIconContainer}>
          <InfoTooltip
            message="Select the categories that best describe your restaurant. This helps customers find your business"
            onShowTooltip={handleShowTooltip}
          />
        </View>
      </View>
      <CategorySelector
        categories={restaurant_categories || []}
        selectedIds={selectedCategoryIds}
        onSelect={setSelectedCategoryIds}
        loading={is_loading_restaurant_category}
        onRefresh={handleRefreshCategories}
      />

      {/* Register Button */}
      <TouchableOpacity
        onPress={handleRegister}
        disabled={isLoading}
        style={[styles.registerButton, {backgroundColor: colors.primary}]}>
        {isLoading ? (
          <ActivityIndicator size="small" color={COLORS.primaryRed} />
        ) : (
          <Text style={[styles.registerButtonText, {color: colors.surface}]}>
            Register Vendor
          </Text>
        )}
      </TouchableOpacity>

      {/* Centralized Tooltip Modal */}
      <TooltipModal
        isVisible={tooltipVisible}
        message={currentTooltipMessage}
        onClose={handleCloseTooltip}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={() => setIsTimePickerVisible(false)}
      />
    </ScrollView>
  );
};

const tooltipStyles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  iconButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipContainer: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltip: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    maxWidth: 300,
    position: 'relative',
  },
  tooltipText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 4,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 50,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 5,
    overflow: 'hidden',
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
    fontFamily: 'Inter-Medium',
  },
  input: {
    backgroundColor: 'transparent',
    height: 56,
    paddingHorizontal: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  timeContainer: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
  },
  dayLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  timeLabel: {
    width: 60,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  timeButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
  infoText: {
    fontSize: 14,
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  infoIconContainer: {
    marginLeft: 8,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 4,
  },
  refreshText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 12,
  },
  retryButton: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  retryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  registerButton: {
    padding: 15,
    borderRadius: 8,
    marginTop: 25,
    alignItems: 'center',
    elevation: 2,
    marginBottom: 50,
  },
  registerButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});

export default CompleteOnboarding;

// src/features/restaurant/components/GeneralProfileSettings.tsx
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  updateRestaurantProfile,
  fetchRestaurantProfile,
  OpeningHours,
} from '../../../../../src/store/features/restaurant/restaurant';
import {AppDispatch, RootState} from '../../../../../src/store';
import {useNavigation} from '@react-navigation/native';
import {THEME} from '../../../../theme';
import {useCustomAlert} from '../../../../../components/customAlert';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';

const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

const DAY_DISPLAY_NAMES: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

type FormData = {
  name: string;
  description: string;
  deliveryFee: string;
  averagePrepTime: string;
  deliveryRadius: string;
  minimumOrder: string;
  cuisines: string;
  prefersCash: boolean;
};

type RootStackParamList = {
  // Define your navigation params here
  GeneralProfileSettings: undefined;
};

// Helper function to convert 24h time to 12h format with AM/PM
const formatTimeTo12h = (time24: string): string => {
  if (!time24) return '';

  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minutes} ${period}`;
};

// Helper function to convert Date object to 24h format string
const formatDateTo24h = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Helper function to convert 24h string to Date object
const parseTimeToDate = (time24: string): Date => {
  if (!time24) return new Date();

  const [hours, minutes] = time24.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return date;
};

type DateTimePickerEvent = {
  type: string;
  nativeEvent: {
    timestamp: number;
  };
};

const GeneralProfileSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {profile, status, error, isStatusUpdating} = useSelector(
    (state: RootState) => state.restaurant,
  );

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    deliveryFee: '',
    averagePrepTime: '',
    deliveryRadius: '',
    minimumOrder: '',
    cuisines: '',
    prefersCash: false,
  });

  const [openingHours, setOpeningHours] = useState<OpeningHours>({});
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState<FormData | null>(null);
  const [originalOpeningHours, setOriginalOpeningHours] =
    useState<OpeningHours>({});
  const [editingDay, setEditingDay] = useState<DayOfWeek | null>(null);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState<'open' | 'close' | null>(
    null,
  );
  const [openTimeDate, setOpenTimeDate] = useState(new Date());
  const [closeTimeDate, setCloseTimeDate] = useState(new Date());

  const {showAlert} = useCustomAlert();

  useEffect(() => {
    if (!profile) {
      dispatch(fetchRestaurantProfile());
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (profile) {
      const initialData: FormData = {
        name: profile.name || '',
        description: profile.description || '',
        deliveryFee: profile.deliveryFee ? String(profile.deliveryFee) : '',
        averagePrepTime: profile.averagePrepTime
          ? String(profile.averagePrepTime)
          : '',
        deliveryRadius: profile.deliveryRadius
          ? String(profile.deliveryRadius)
          : '',
        minimumOrder: profile.minimumOrder ? String(profile.minimumOrder) : '',
        cuisines: Array.isArray(profile.cuisines)
          ? profile.cuisines.join(', ')
          : '',
        prefersCash: profile.prefersCash || false,
      };

      setFormData(initialData);
      setOriginalData(initialData);

      if (profile.openingHours) {
        setOpeningHours(profile.openingHours);
        setOriginalOpeningHours(profile.openingHours);
      }
    }
  }, [profile]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditDayHours = (day: DayOfWeek) => {
    const hours = openingHours[day] || {open: '', close: ''};
    setEditingDay(day);

    // Set initial time values
    if (hours.open) {
      setOpenTimeDate(parseTimeToDate(hours.open));
    }
    if (hours.close) {
      setCloseTimeDate(parseTimeToDate(hours.close));
    }

    setIsTimeModalVisible(true);
  };

  const handleTimeChange = (
    event: any,
    selectedDate?: Date,
    type: 'open' | 'close' = 'open',
  ) => {
    setShowTimePicker(null);

    if (event.type === 'set' && selectedDate) {
      if (type === 'open') {
        setOpenTimeDate(selectedDate);
      } else {
        setCloseTimeDate(selectedDate);
      }
    }
  };

  const handleSaveDayHours = () => {
    if (editingDay) {
      const openTime24 = formatDateTo24h(openTimeDate);
      const closeTime24 = formatDateTo24h(closeTimeDate);

      const updatedHours: OpeningHours = {
        ...openingHours,
        [editingDay]: {
          open: openTime24,
          close: closeTime24,
        },
      };
      setOpeningHours(updatedHours);
    }
    setIsTimeModalVisible(false);
    setEditingDay(null);
    setShowTimePicker(null);
  };

  const handleRemoveDayHours = (day: DayOfWeek) => {
    const updatedHours = {...openingHours};
    delete updatedHours[day];
    setOpeningHours(updatedHours);
  };

  const handleClearAllHours = () => {
    setOpeningHours({});
  };

  const hasOpeningHoursChanges = () => {
    return (
      JSON.stringify(openingHours) !== JSON.stringify(originalOpeningHours)
    );
  };

  const hasChanges = () => {
    return (
      JSON.stringify(formData) !== JSON.stringify(originalData) ||
      hasOpeningHoursChanges()
    );
  };

  const handleSave = async () => {
    try {
      const cuisinesArray = formData.cuisines
        .split(',')
        .map(cuisine => cuisine.trim())
        .filter(cuisine => cuisine.length > 0);

      const payload = {
        name: formData.name,
        description: formData.description,
        deliveryFee: Number(formData.deliveryFee) || 0,
        averagePrepTime: Number(formData.averagePrepTime) || 0,
        deliveryRadius: Number(formData.deliveryRadius) || 0,
        minimumOrder: Number(formData.minimumOrder) || 0,
        cuisines: cuisinesArray,
        prefersCash: formData.prefersCash,
        openingHours: openingHours,
      };

      // console.log('payload to be sent:', payload);

      const result = await dispatch(updateRestaurantProfile(payload)).unwrap();

      if (result.data) {
        const updatedData: FormData = {
          name: result.data.name || '',
          description: result.data.description || '',
          deliveryFee: result.data.deliveryFee
            ? String(result.data.deliveryFee)
            : '',
          averagePrepTime: result.data.averagePrepTime
            ? String(result.data.averagePrepTime)
            : '',
          deliveryRadius: result.data.deliveryRadius
            ? String(result.data.deliveryRadius)
            : '',
          minimumOrder: result.data.minimumOrder
            ? String(result.data.minimumOrder)
            : '',
          cuisines: Array.isArray(result.data.cuisines)
            ? result.data.cuisines.join(', ')
            : '',
          prefersCash: result.data.prefersCash || false,
        };
        setFormData(updatedData);
        setOriginalData(updatedData);

        if (result.data.openingHours) {
          setOpeningHours(result.data.openingHours);
          setOriginalOpeningHours(result.data.openingHours);
        }
      }

      setIsEditing(false);
      showAlert('success', 'Success', 'Profile updated successfully!');
    } catch (error: any) {
      showAlert(
        'error',
        'Error Updating profile',
        String(error) ||
          'Try again or contact support at support@speeditng.com',
      );
    }
  };

  const handleCancel = () => {
    originalData && setFormData(originalData);
    setOpeningHours(originalOpeningHours);
    setIsEditing(false);
  };

  if (status === 'loading' && !profile) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error && !profile) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={48} color="#D84315" />
        <Text style={styles.errorText}>Failed to load profile</Text>
        <Text style={styles.errorSubText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchRestaurantProfile())}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Ionicons
            size={20}
            name="arrow-back"
            color={THEME.CREAM_WHITE}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.appbarTitle}>General Settings</Text>
        </View>
        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}>
            <Ionicons name="pencil" size={20} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.saveButton,
                !hasChanges() && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!hasChanges() || isStatusUpdating}>
              {isStatusUpdating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Restaurant Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Restaurant Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.name}
              onChangeText={text => handleInputChange('name', text)}
              editable={isEditing}
              placeholder="Enter restaurant name"
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                !isEditing && styles.inputDisabled,
              ]}
              value={formData.description}
              onChangeText={text => handleInputChange('description', text)}
              editable={isEditing}
              placeholder="Describe your restaurant"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Cuisines */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cuisines</Text>
            <Text style={styles.subLabel}>
              Separate multiple cuisines with commas
            </Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.cuisines}
              onChangeText={text => handleInputChange('cuisines', text)}
              editable={isEditing}
              placeholder="Italian, Mexican, Chinese"
            />
          </View>

          {/* Payment Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Preferences</Text>
            <View style={styles.switchGroup}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Prefer Cash Payments</Text>
                <Switch
                  value={formData.prefersCash}
                  onValueChange={value =>
                    handleInputChange('prefersCash', value)
                  }
                  disabled={!isEditing}
                  trackColor={{false: '#767577', true: '#FFB74D'}}
                  thumbColor={formData.prefersCash ? '#FF9800' : '#f4f3f4'}
                />
              </View>
              <Text style={styles.switchDescription}>
                When enabled, you will receive physical cash from rider, instead
                of getting paid to your wallet
              </Text>
            </View>
          </View>

          {/* Opening Hours Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Opening Hours</Text>
              {isEditing && (
                <TouchableOpacity
                  onPress={handleClearAllHours}
                  style={styles.clearAllButton}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.sectionSubtitle}>
              Set your restaurant's operating hours. Only days with set hours
              will be sent to the server.
            </Text>

            {DAYS_OF_WEEK.map(day => {
              const hours = openingHours[day];
              const isSet = hours && hours.open && hours.close;

              return (
                <View key={day} style={styles.dayRow}>
                  <Text style={styles.dayLabel}>{DAY_DISPLAY_NAMES[day]}</Text>

                  {isSet ? (
                    <View style={styles.timeDisplay}>
                      <Text style={styles.timeText}>
                        {formatTimeTo12h(hours.open)} -{' '}
                        {formatTimeTo12h(hours.close)}
                      </Text>
                      {isEditing && (
                        <View style={styles.timeActions}>
                          <TouchableOpacity
                            onPress={() => handleEditDayHours(day)}
                            style={styles.editTimeButton}>
                            <Ionicons name="pencil" size={16} color="#FF9800" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleRemoveDayHours(day)}
                            style={styles.removeTimeButton}>
                            <Ionicons name="close" size={16} color="#D84315" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => isEditing && handleEditDayHours(day)}
                      style={[
                        styles.addTimeButton,
                        !isEditing && styles.addTimeButtonDisabled,
                      ]}
                      disabled={!isEditing}>
                      <Text style={styles.addTimeText}>
                        {isEditing ? 'Set Hours' : 'Not Set'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>

          {/* Delivery Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Settings</Text>

            <View style={styles.row}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>Delivery Fee ($)</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={formData.deliveryFee}
                  onChangeText={text =>
                    handleInputChange(
                      'deliveryFee',
                      text.replace(/[^0-9.]/g, ''),
                    )
                  }
                  editable={isEditing}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>Minimum Order ($)</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={formData.minimumOrder}
                  onChangeText={text =>
                    handleInputChange(
                      'minimumOrder',
                      text.replace(/[^0-9.]/g, ''),
                    )
                  }
                  editable={isEditing}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>Delivery Radius (km)</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={formData.deliveryRadius}
                  onChangeText={text =>
                    handleInputChange(
                      'deliveryRadius',
                      text.replace(/[^0-9]/g, ''),
                    )
                  }
                  editable={isEditing}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>Avg. Prep Time (min)</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={formData.averagePrepTime}
                  onChangeText={text =>
                    handleInputChange(
                      'averagePrepTime',
                      text.replace(/[^0-9]/g, ''),
                    )
                  }
                  editable={isEditing}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Bottom margin */}
          <View style={{marginBottom: 100}}></View>
        </View>
      </ScrollView>

      {/* Time Editing Modal */}
      <Modal
        visible={isTimeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsTimeModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Set Hours for {editingDay ? DAY_DISPLAY_NAMES[editingDay] : ''}
            </Text>

            <View style={styles.timeInputGroup}>
              <Text style={styles.timeLabel}>Open Time</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowTimePicker('open')}>
                <Text style={styles.timeDisplayText}>
                  {formatTimeTo12h(formatDateTo24h(openTimeDate)) ||
                    'Select time'}
                </Text>
                <Ionicons name="time-outline" size={20} color="#FF9800" />
              </TouchableOpacity>
            </View>

            <View style={styles.timeInputGroup}>
              <Text style={styles.timeLabel}>Close Time</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowTimePicker('close')}>
                <Text style={styles.timeDisplayText}>
                  {formatTimeTo12h(formatDateTo24h(closeTimeDate)) ||
                    'Select time'}
                </Text>
                <Ionicons name="time-outline" size={20} color="#FF9800" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setIsTimeModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={handleSaveDayHours}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Time Pickers */}
        {showTimePicker && (
          <DateTimePicker
            value={showTimePicker === 'open' ? openTimeDate : closeTimeDate}
            mode="time"
            is24Hour={false} // Show AM/PM to user
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) =>
              handleTimeChange(event, date, showTimePicker)
            }
          />
        )}
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  appbarTitle: {
    color: THEME.CREAM_WHITE,
    fontWeight: '800',
    fontSize: 22,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF8F0',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8D6E63',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#D84315',
  },
  errorSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#8D6E63',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#FF9800',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingVertical: 15,
    backgroundColor: THEME.DARK_CHARCOAL,
    elevation: 0,
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5722',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#8D6E63',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  form: {
    gap: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF5722',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8D6E63',
    marginBottom: 16,
    lineHeight: 20,
  },
  clearAllButton: {
    padding: 4,
  },
  clearAllText: {
    color: '#D84315',
    fontSize: 14,
    fontWeight: '500',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#5D4037',
    flex: 1,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#8D6E63',
    fontWeight: '500',
  },
  timeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editTimeButton: {
    padding: 4,
  },
  removeTimeButton: {
    padding: 4,
  },
  addTimeButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addTimeButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },

  timePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFCCBC',
    borderRadius: 8,
    padding: 12,
  },
  timeDisplayText: {
    fontSize: 16,
    color: '#5D4037',
    fontWeight: '500',
  },
  addTimeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputGroupHalf: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 14,
    color: '#8D6E63',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFCCBC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#5D4037',
  },
  inputDisabled: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFE0B2',
    color: '#8D6E63',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  switchGroup: {
    marginTop: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4037',
    flex: 1,
    marginRight: 16,
  },
  switchDescription: {
    fontSize: 14,
    color: '#8D6E63',
    lineHeight: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF5722',
    marginBottom: 20,
    textAlign: 'center',
  },
  timeInputGroup: {
    marginBottom: 16,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 8,
  },
  timeInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFCCBC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#5D4037',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#8D6E63',
  },
  modalSaveButton: {
    backgroundColor: '#4CAF50',
  },
  modalCancelText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default GeneralProfileSettings;

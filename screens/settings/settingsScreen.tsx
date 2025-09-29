// FILE: src/screens/SettingsScreen.tsx
import React, {useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Appbar, List, Text, Avatar, Card} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {THEME} from '../theme';
import {useNavigation} from '@react-navigation/native';

// Import your actual Redux actions and navigation helpers
import {navigate} from '../../ref';
import AvailabilityToggle from '../../components/storeStatusToggler/toggle';
import {
  getVendorActiveStatus,
  logoutUser,
  selectIsVendorActive,
} from '../../src/store/features/auth/authSlice';
import {AppDispatch, RootState} from '../../src/store';
import {useCustomAlert} from '../../components/customAlert';

const SettingsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation: any = useNavigation();

  const isVendorActive = useSelector(selectIsVendorActive);
  // --- Connecting to the Redux Store ---
  const userInfo = useSelector((state: RootState) => state.auth?.userInfo);
  const restaurantDetails = useSelector(
    (state: RootState) => state.restaurant?.profile,
  );
  const {status} = useSelector((state: RootState) => state.restaurant);

  const {showAlert} = useCustomAlert();
  const fetchVendorAvailabilityStatus = useCallback(async () => {
    await dispatch(getVendorActiveStatus());
  }, [dispatch]);

  // Combine data for display, with fallbacks
  const restaurant = {
    name: userInfo?.name || 'Your Restaurant',
    logoUrl: userInfo?.logoUrl || null,
    isActive: isVendorActive,
  };

  useEffect(() => {
    fetchVendorAvailabilityStatus();
  }, [fetchVendorAvailabilityStatus]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // Navigation will be handled by the splash screen based on auth state
      navigation.reset({
        index: 0,
        routes: [{name: 'OnboardLogin'}],
      });
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // --- Initial Loading State ---
  if (status === 'loading' && !restaurant.name) {
    return (
      <View style={styles.centeredLoader}>
        <ActivityIndicator size="large" color={THEME.VIBRANT_RED} />
      </View>
    );
  }

  // Reusable list item component for a consistent look
  const SettingsItem = ({
    title,
    description,
    icon,
    onPress,
  }: {
    title: string;
    description: string;
    icon: string;
    onPress: () => void;
  }) => (
    <List.Item
      title={title}
      description={description}
      titleStyle={styles.listItemTitle}
      descriptionStyle={styles.listItemDescription}
      onPress={onPress}
      left={props => (
        <MaterialCommunityIcons
          {...props}
          name={icon}
          size={24}
          color={THEME.VIBRANT_RED}
          style={styles.listItemIcon}
        />
      )}
      right={props => (
        <MaterialCommunityIcons
          {...props}
          name="chevron-right"
          size={24}
          color={THEME.MEDIUM_GRAY}
        />
      )}
    />
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Settings" titleStyle={styles.appbarTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* --- REFINED PROFILE CARD --- */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Avatar.Image
              size={64}
              source={
                restaurant.logoUrl
                  ? {uri: restaurant.logoUrl}
                  : require('../../assets/bowl.png')
              }
              style={styles.avatar}
            />
            <View style={styles.profileTextContainer}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text
                style={[
                  styles.restaurantStatus,
                  {
                    color: restaurant.isActive
                      ? THEME.SUCCESS_GREEN
                      : THEME.MEDIUM_GRAY,
                  },
                ]}>
                {restaurant.isActive ? 'Accepting Orders' : 'Currently Offline'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('RestaurantProfileForm')}>
            <MaterialCommunityIcons
              name="pencil-outline"
              size={20}
              color={THEME.DARK_CHARCOAL}
            />
          </TouchableOpacity>
        </View>

        {/* --- STORE STATUS CARD --- */}
        <Card style={styles.sectionCard}>
          <List.Subheader style={styles.sectionHeader}>
            Store Status
          </List.Subheader>
          <View style={styles.statusRow}>
            <View style={styles.statusInfo}>
              <MaterialCommunityIcons
                name={
                  restaurant.isActive
                    ? 'store-check-outline'
                    : 'store-remove-outline'
                }
                size={24}
                color={
                  restaurant.isActive ? THEME.SUCCESS_GREEN : THEME.VIBRANT_RED
                }
                style={styles.listItemIcon}
              />
              <View>
                <Text
                  style={[
                    styles.statusTitle,
                    {
                      color: restaurant.isActive
                        ? THEME.SUCCESS_GREEN
                        : THEME.VIBRANT_RED,
                    },
                  ]}>
                  {restaurant.isActive ? 'Store is Online' : 'Store is Offline'}
                </Text>
                <Text style={styles.statusDescription}>
                  Toggle to accept new orders
                </Text>
              </View>
            </View>
            <AvailabilityToggle />
          </View>
        </Card>

        {/* --- GENERAL SETTINGS CARD --- */}
        <Card style={styles.sectionCard}>
          <List.Subheader style={styles.sectionHeader}>
            General Settings
          </List.Subheader>
          <SettingsItem
            title="Restaurant Information"
            description="Name, address, hours"
            icon="information-outline"
            onPress={() => navigation.navigate('VendorDetails')}
          />
          <SettingsItem
            title="Payout & Wallet"
            description="Manage withdrawals"
            icon="wallet-outline"
            onPress={() => navigate('walletScreen')}
          />
          <SettingsItem
            title="Notification Settings"
            description="Manage app alerts"
            icon="bell-outline"
            // onPress={() => navigate('notsScreen')}
            // For now, use an Alert
            onPress={() =>
              showAlert(
                'success',
                'This Feature is being worked on',
                'For now, please reach us at support@speeditng.com or call 08067268692',
              )
            }
          />
        </Card>

        {/* --- SUPPORT CARD --- */}
        <Card style={styles.sectionCard}>
          <List.Subheader style={styles.sectionHeader}>Support</List.Subheader>
          <SettingsItem
            title="Help Center"
            description="FAQs and troubleshooting"
            icon="help-circle-outline"
            //This navigation works. But we will build out the feature later
            onPress={() => navigate('helpCenter')}
            // // For now, use an Alert
            // onPress={() =>
            //   showAlert(
            //     'success',
            //     'This Feature will being worked on',
            //     'For now, please reach us at support@speeditng.com or call 08067268692',
            //   )
            // }
          />
          <SettingsItem
            title="Contact Support"
            description="Get help from our team"
            icon="email-outline"
            //This navigation works. But we will build out the feature later
            // onPress={() => navigate('support')}
            // For now, use an Alert
            onPress={() =>
              showAlert(
                'success',
                'This Feature is being worked on',
                'For now, please reach us at support@speeditng.com or call 08067268692',
              )
            }
          />
        </Card>

        {/* --- REFINED LOGOUT BUTTON --- */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons
            name="logout"
            size={22}
            color={THEME.CREAM_WHITE}
          />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// ... styles remain the same

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: THEME.CREAM_WHITE},
  centeredLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.CREAM_WHITE,
  },
  appbar: {backgroundColor: THEME.DARK_CHARCOAL, elevation: 0},
  appbarTitle: {color: THEME.CREAM_WHITE, fontWeight: '800', fontSize: 24},
  scrollContainer: {padding: 20, paddingBottom: 40},

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusDescription: {
    fontSize: 13,
    color: THEME.MEDIUM_GRAY,
  },
  // --- Profile Card Styles ---
  profileCard: {
    backgroundColor: THEME.CARD_BACKGROUND,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#B0B0B0',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: THEME.LIGHT_GRAY,
  },
  profileTextContainer: {
    marginLeft: 15,
    flexShrink: 1, // Allows text to shrink if needed
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
  },
  restaurantStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  editProfileButton: {
    backgroundColor: THEME.BOLD_YELLOW,
    borderRadius: 15,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  // --- Section Card Styles ---
  sectionCard: {
    backgroundColor: THEME.CARD_BACKGROUND,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#E0E0E0',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // --- List Item Styles ---
  listItemIcon: {
    marginRight: 10, // Add space between icon and text
    alignSelf: 'center',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.DARK_CHARCOAL,
  },
  listItemDescription: {
    fontSize: 13,
    color: THEME.MEDIUM_GRAY,
  },

  // --- Logout Button Styles ---
  logoutButton: {
    backgroundColor: THEME.VIBRANT_RED,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 10,
    elevation: 2,
    shadowColor: THEME.VIBRANT_RED,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 3},
  },
  logoutButtonText: {
    color: THEME.CREAM_WHITE,
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default SettingsScreen;

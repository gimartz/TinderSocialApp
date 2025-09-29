// FILE: src/screens/ProfileSettingsScreen.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {Appbar, Card, List, Avatar} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {THEME} from '../../../theme';
import {AppDispatch, RootState} from '../../../../src/store';
import {logoutUser} from '../../../../src/store/features/auth/authSlice';

const ProfileSettingsScreen = ({navigation}: any) => {
  const userInfo = useSelector((state: RootState) => state.auth?.userInfo);
  const restaurant = userInfo;
  const dispatch = useDispatch<AppDispatch>();

  // Logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // Navigation will be handled by the splash screen based on auth state
      navigation.reset({
        index: 0,
        routes: [{name: 'OnboardLogin', screen: 'Login'} as any],
      });
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // logout confirmation
  const confirmLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', style: 'destructive', onPress: handleLogout},
    ]);
  };
  
  // Re-organize menu items into logical sections for card-based UI
  const menuSections = [
    {
      title: 'Account & Security',
      items: [
        {
          id: 6,
          name: 'General Settings',
          icon: 'hammer',
          nav: 'GeneralProfileSettings',
        },
        {
          id: 1,
          name: 'Change Password',
          icon: 'lock-outline',
          nav: 'ChangePassword',
        },
      ],
    },
    {
      title: 'Store Appearance',
      items: [
        {
          id: 2,
          name: 'Change Cover Photo',
          icon: 'image-area',
          nav: 'VendorDetailsLogo',
        },
        {
          id: 3,
          name: 'Change Logo',
          icon: 'image-size-select-actual',
          nav: 'VendorDetailsLogo',
        },
        {
          id: 4,
          name: 'Update Location',
          icon: 'map-marker-outline',
          nav: 'AddLocation',
        },
      ],
    },
  ];

  // A reusable component for consistent list items
  const SettingsItem = ({
    name,
    icon,
    onPress,
  }: {
    name: string;
    icon: string;
    onPress: any;
  }) => (
    <List.Item
      title={name}
      titleStyle={styles.listItemTitle}
      onPress={onPress}
      left={() => (
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={THEME.VIBRANT_RED}
          style={styles.listItemIcon}
        />
      )}
      right={() => (
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={THEME.MEDIUM_GRAY}
        />
      )}
    />
  );

  return (
    <View style={styles.pageContainer}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={THEME.CREAM_WHITE}
        />
        <Appbar.Content
          title="Profile & Settings"
          titleStyle={styles.appbarTitle}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* --- REFINED PROFILE HEADER CARD --- */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileCardContent}>
            <Avatar.Image
              size={64}
              source={
                restaurant?.logoUrl
                  ? {uri: restaurant.logoUrl}
                  : require('../../../../assets/bowl.png')
              } // Fallback to a local asset
              style={styles.avatar}
            />
            <View>
              <Text style={styles.profileName}>
                {restaurant?.name || 'Restaurant Name'}
              </Text>
              <Text style={styles.profileEmail}>
                {restaurant?.email || 'email@example.com'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* --- DYNAMICALLY RENDERED SETTINGS SECTIONS --- */}
        {menuSections.map((section, index) => (
          <Card key={index} style={styles.sectionCard}>
            <List.Subheader style={styles.sectionHeader}>
              {section.title}
            </List.Subheader>
            {section.items.map(item => (
              <SettingsItem
                key={item.id}
                name={item.name}
                icon={item.icon}
                onPress={() => navigation.navigate(item.nav)}
              />
            ))}
          </Card>
        ))}

        {/* --- REFINED LOGOUT BUTTON --- */}
        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
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

// --- STYLESHEET ---
const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: THEME.CREAM_WHITE,
  },
  appbar: {
    backgroundColor: THEME.DARK_CHARCOAL,
    elevation: 0,
  },
  appbarTitle: {
    color: THEME.CREAM_WHITE,
    fontWeight: '800',
    fontSize: 22,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  // --- Profile Card Styles ---
  profileCard: {
    backgroundColor: THEME.CARD_BACKGROUND,
    borderRadius: 20,
    marginBottom: 25,
    elevation: 6,
    shadowColor: '#B0B0B0',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10, // Internal padding for card content
  },
  avatar: {
    backgroundColor: THEME.LIGHT_GRAY,
    marginRight: 15,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
  },
  profileEmail: {
    fontSize: 15,
    color: THEME.MEDIUM_GRAY,
    marginTop: 2,
  },

  // --- Section Card Styles ---
  sectionCard: {
    backgroundColor: THEME.CARD_BACKGROUND,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
    paddingLeft: 15,
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
    marginRight: 10,
    alignSelf: 'center',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.DARK_CHARCOAL,
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

export default ProfileSettingsScreen;

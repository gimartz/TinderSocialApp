// src/screens/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../components/constants/colors';
import { CURRENT_USER } from '../../src/navigation/data';


const ProfileScreen = () => {
  const menuItems = [
    { id: '1', icon: 'settings-outline', title: 'Settings', subtitle: 'Privacy, Notifications' },
    { id: '2', icon: 'shield-checkmark-outline', title: 'Safety', subtitle: 'Community Guidelines' },
    { id: '3', icon: 'heart-outline', title: 'Get Tinder Plus', subtitle: 'Unlock premium features' },
    { id: '4', icon: 'help-circle-outline', title: 'Help & Support', subtitle: 'FAQ, Contact us' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity>
            <Icon name="create-outline" size={24} color={Colors.gray} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: CURRENT_USER.image }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {CURRENT_USER.name}, {CURRENT_USER.age}
            </Text>
            {CURRENT_USER.bio && (
              <Text style={styles.bio}>{CURRENT_USER.bio}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>EDIT PROFILE</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="settings-outline" size={28} color={Colors.gray} />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Settings</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="star-outline" size={28} color={Colors.secondary} />
            <Text style={styles.statNumber}>28</Text>
            <Text style={styles.statLabel}>Super Likes</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="flame-outline" size={28} color={Colors.primary} />
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <Icon name={item.icon} size={24} color={Colors.gray} />
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
  },
  profileCard: {
    backgroundColor: Colors.white,
    margin: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray,
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-around',
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    color: Colors.gray,
  },
  logoutButton: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.gray,
    marginTop: 20,
  },
});

export default ProfileScreen;
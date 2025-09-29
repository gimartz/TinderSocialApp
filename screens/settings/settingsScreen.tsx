import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileListItem from './profile';
import { useAuth } from '../context/cat'; // Import useAuth for logout
import {Appbar, Card, Button} from 'react-native-paper';
import {THEME} from '../theme';
const ProfileScreen = () => {
  const { logout } = useAuth(); // Get the logout function

  const handleLogout = () => {
    // Here you can add a confirmation dialog if you want
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Header */}  
         <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Manage your Matches" titleStyle={styles.appbarTitle} />
      </Appbar.Header>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <Icon name="share-social-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 15 }}>
              <Icon name="settings-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfoSection}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' }}
            style={styles.avatar}
          />
          <View style={styles.userInfoText}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>Shafikul Islam</Text>
              <Icon name="checkmark-circle" size={18} color="#4CAF50" style={{ marginLeft: 5 }} />
            </View>
            <Text style={styles.userHandle}>@partha31416</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#7B61FF' }]}>
            <Text style={styles.statLabel}>Total Love</Text>
            <Text style={styles.statValue}>34</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FF5B79' }]}>
            <Text style={styles.statLabel}>Matched</Text>
            <Text style={styles.statValue}>67%</Text>
          </View>
        </View>

        {/* List Items */}
        <View style={styles.menuWrapper}>
          <ProfileListItem
            icon="location-outline"
            iconColor="#FF5B79"
            iconBackgroundColor="#FFF0F3"
            title="Address"
            subtitle="8146 Reinger Oval,"
            onPress={() => { /* Navigate to Address screen */ }}
          />
          <ProfileListItem
            icon="globe-outline"
            iconColor="#FF5B79"
            iconBackgroundColor="#FFF0F3"
            title="Language"
            subtitle="English"
            onPress={() => { /* Navigate to Language screen */ }}
          />
          <ProfileListItem
            icon="log-out-outline"
            iconColor="#FF5B79"
            iconBackgroundColor="#FFF0F3"
            title="Log Out"
            subtitle="You will be logged out"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5FF', // Light purple background
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },   appbar: {backgroundColor: THEME.DARK_CHARCOAL, elevation: 0},
  appbarTitle: {color: THEME.CREAM_WHITE, fontWeight: '800', fontSize: 22},
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  userInfoText: {
    justifyContent: 'center',
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userHandle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  menuWrapper: {
    marginTop: 10,
  },
});

export default ProfileScreen;
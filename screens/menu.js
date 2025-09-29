// src/features/menu/MenuScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, List, Switch, Divider,Icon as MaterialCommunityIcons } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { setActiveMainTab, selectActiveMainTab } from '../src/store/features/selectTab';
import SegmentedControl from './tabs'; // Import custom component
import { COLORS } from '../src/constants/colors';

// Assume you have this image in your assets
const bowlIcon = require('../assets/bowl.png');

const menuTabs = [
  { id: 'Meals', title: 'Meals' },
  { id: 'Categories', title: 'Categories', isNew: true },
  { id: 'Option Groups', title: 'Option Groups' },
  { id: 'Options', title: 'Options' }, // Assuming full name is "Options"
];

const MenuScreen = () => {
  const dispatch = useDispatch();
  const activeMainTab = useSelector(selectActiveMainTab);

  const handleTabPress = (tabId) => {
    dispatch(setActiveMainTab(tabId));
  };

  const renderContent = () => {
    if (activeMainTab === 'Option Groups') {
      return (
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <Image source={bowlIcon} style={styles.bowlIcon} />
          </View>
          <Text style={styles.emptyStateText}>No option groups</Text>
          <Text style={styles.emptyStateText}>created yet</Text>
          <TouchableOpacity style={styles.createGroupButton}>
            <Text style={styles.createGroupButtonText}>Create a group</Text>
          </TouchableOpacity>
        </View>
      );
    }
    // Placeholder for other tabs
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.placeholderText}>Content for {activeMainTab}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Menu</Text>

        <SegmentedControl
          tabs={menuTabs}
          activeTab={activeMainTab}
          onTabPress={handleTabPress}
        />

        {renderContent()}
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={[styles.fab, styles.fabSecondary]}>
          <MaterialCommunityIcons name="message-text-outline" size={24} color={COLORS.primaryGreen} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fab, styles.fabPrimary]}>
          <Ionicons name="add" size={28} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightGray, // Background of the whole screen
  },
  scrollViewContent: {
    paddingBottom: 100, // Space for FABs and bottom nav
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60, // Give some space from tabs
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bowlIcon: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  emptyStateText: {
    fontSize: 18,
    color: COLORS.black,
    fontWeight: '500',
    textAlign: 'center',
  },
  createGroupButton: {
    backgroundColor: COLORS.primaryGreen,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  createGroupButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeholderText: {
    fontSize: 18,
    color: COLORS.gray,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 80, // Adjust if you have a taller bottom tab bar
    right: 20,
    alignItems: 'flex-end',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabPrimary: {
    backgroundColor: COLORS.primaryGreen, // In image it's white, but often FABs are primary
                                        // Let's make it white with green icon if it's a plus
                                        // Or green with white icon. Let's go with white background as in image
    // backgroundColor: COLORS.white,
    // Change to white with primaryGreen icon if you prefer that
  },
  fabSecondary: {
    backgroundColor: COLORS.white, // In image it's green.
    marginBottom: 15,
  },
});

export default MenuScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Using MaterialIcons

// --- Mock Navigation Hook (Replace with actual useNavigation from React Navigation) ---
const useNavigation = () => {
  return {
    navigate: (screenName, params) => console.log(`Navigating to ${screenName}`, params || ''),
    goBack: () => console.log('Going back'),
  };
};
// ------------------------------------------------------------------------------------

// Define Primary Colors (Red and Yellow)
const PRIMARY_RED = '#D50000'; // A strong Red
const SECONDARY_YELLOW = '#FFC107'; // Amber/Yellow
const ACCENT_TEXT_COLOR = PRIMARY_RED;
const BACKGROUND_COLOR_LIGHT = '#f7f7f7'; // Very light grey/off-white
const CARD_BACKGROUND_COLOR = '#FFFFFF'; // White card, slight tint maybe later if needed
const TEXT_COLOR_PRIMARY = '#333333';
const TEXT_COLOR_SECONDARY = '#666666';
const ICON_COLOR_INACTIVE = '#9E9E9E'; // Grey for inactive icons/elements

const SetupScreen = () => {
  const navigation = useNavigation();
  const [isStoreOpen, setIsStoreOpen] = useState(true); // State for the toggle switch
  const [selectedBottomTab, setSelectedBottomTab] = useState('Orders'); // State for bottom nav

  // Placeholder data for checklist
  const checklistItems = [
    { id: '1', text: 'Add store information', completed: true, screen: 'StoreInfoSetup' },
    { id: '2', text: 'Set up store operations', completed: true, screen: 'StoreOperationsSetup' },
    { id: '3', text: 'Create your menu', completed: false, screen: 'MenuSetup' },
  ];

  const handleToggleSwitch = () => setIsStoreOpen(previousState => !previousState);

  const handleBottomTabPress = (tabName) => {
    setSelectedBottomTab(tabName);
    console.log(`Selected Bottom Tab: ${tabName}`);
    // Replace with navigation.navigate(...) for bottom tabs
    if (tabName !== 'Orders') {
        navigation.navigate(tabName); // Example navigation
    }
  };

  const handleContinueSetup = () => {
    console.log('Pressed Continue Setup');
    // Logic to navigate to the first incomplete step or a general setup flow
    const firstIncomplete = checklistItems.find(item => !item.completed);
    if (firstIncomplete) {
        navigation.navigate(firstIncomplete.screen);
    } else {
        navigation.navigate('SetupComplete'); // Or wherever it should go
    }
  };

  const handleChecklistItemPress = (item) => {
    console.log(`Pressed checklist item: ${item.text}`);
    navigation.navigate(item.screen); // Navigate to the specific setup screen
  };

   const handleChatPress = () => {
    console.log('Pressed Chat FAB');
    navigation.navigate('ChatScreen'); // Example navigation
  };

  const handlePowerPress = () => {
      console.log('Power button pressed');
      // Add logic for power button action (e.g., logout, settings)
      navigation.navigate('SettingsScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.container.backgroundColor} />
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <View style={styles.headerRight}>
            <Text style={styles.openText}>Open</Text>
            <Switch
              trackColor={{ false: '#767577', true: PRIMARY_RED + '80' }} // Lighter red track
              thumbColor={isStoreOpen ? PRIMARY_RED : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggleSwitch}
              value={isStoreOpen}
              style={styles.switch}
            />
           
          </View>
        </View>

        {/* Main Content Area */}
        <ScrollView contentContainerStyle={styles.contentArea}>
          {/* Setup Checklist Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Just a few things to go live!</Text>
            <Text style={styles.cardSubtitle}>You have a to-do list to set up your store fully</Text>

            {checklistItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistItem}
                onPress={() => handleChecklistItemPress(item)}
              >
                <Icon
                  name={item.completed ? 'check-circle' : 'radio-button-unchecked'}
                  size={24}
                  color={item.completed ? PRIMARY_RED : ICON_COLOR_INACTIVE}
                  style={styles.checklistIcon}
                />
                <Text style={[styles.checklistText, item.completed && styles.checklistTextCompleted]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.continueButton} onPress={handleContinueSetup}>
              <Text style={styles.continueButtonText}>Continue Setup</Text>
              <Icon name="chevron-right" size={22} color={ACCENT_TEXT_COLOR} />
            </TouchableOpacity>
          </View>

          {/* Add other content for the Orders screen below the card if needed */}

        </ScrollView>

         {/* Floating Action Button */}
         <TouchableOpacity style={styles.fab} onPress={handleChatPress}>
            <Icon name="chat-bubble-outline" size={24} color="#FFFFFF" />
         </TouchableOpacity>


        
       
        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR_LIGHT,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR_LIGHT,
  },
  // --- Header Styles ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: TEXT_COLOR_PRIMARY,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative', // To position power button
  },
  openText: {
    fontSize: 16,
    color: TEXT_COLOR_SECONDARY,
    marginRight: 8,
    fontWeight: '500',
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }], // Slightly larger switch
  },
  powerButton: {
    marginLeft: 8,
    // position: 'absolute', // Allow positioning relative to headerRight
    // right: -15, // Adjust as needed
    // top: 25, // Adjust as needed
    padding: 5, // Tap area
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerButtonOutline: { // Simple visual cue, not the gradient from image
      position: 'absolute',
      width: 42,
      height: 42,
      borderRadius: 21,
      borderWidth: 1.5,
      borderColor: '#E0E0E0', // Light grey outline
      opacity: 0.8,
  },
  // --- Content Area Styles ---
  contentArea: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 10,
  },
  // --- Card Styles ---
  card: {
    backgroundColor: CARD_BACKGROUND_COLOR,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_COLOR_PRIMARY,
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: TEXT_COLOR_SECONDARY,
    marginBottom: 20,
  },
  // --- Checklist Styles ---
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12, // Increased vertical padding
  },
  checklistIcon: {
    marginRight: 15,
  },
  checklistText: {
    fontSize: 16,
    color: TEXT_COLOR_PRIMARY,
    flex: 1, // Take remaining space
  },
  checklistTextCompleted: {
    // Optional: style differently if needed, e.g., lighter color or strikethrough
    // color: TEXT_COLOR_SECONDARY,
    // textDecorationLine: 'line-through',
  },
  // --- Continue Button Styles ---
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1, // Optional separator line
    borderTopColor: '#eee',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ACCENT_TEXT_COLOR,
    marginRight: 4,
  },
  // --- FAB Styles ---
 fab: {
    position: 'absolute',
    bottom: 85, // Adjust based on bottom nav height + spacing
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY_RED, // Use primary red
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
 },
 // --- Bottom Nav Styles ---
  bottomNavBar: {
    flexDirection: 'row',
    height: 65,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  bottomNavItem: {
    flex: 1, // Distribute space evenly for inactive items
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    height: '100%', // Ensure full height for tap area
  },
  bottomNavItemMain: { // Specific style for the item that gets the background
    flexGrow: 0, // Don't allow it to grow with flex: 1
    flexBasis: 'auto', // Base size on content
    flexDirection: 'row',
    borderRadius: 25,
    paddingHorizontal: 18, // More padding horizontally
    paddingVertical: 8,
    marginHorizontal: 5,
    minWidth: 100, // Ensure minimum width
    height: 45, // Fixed height for the capsule
  },
  bottomNavItemMainSelected: {
    backgroundColor: PRIMARY_RED, // Red background when selected
    // Shadow for selected tab
    shadowColor: PRIMARY_RED,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  bottomNavText: {
     fontSize: 12,
     marginLeft: 6, // Space between icon and text
     color: TEXT_COLOR_SECONDARY, // Default text color matches inactive icon
     fontWeight: '500',
  },
  bottomNavTextSelected: {
     color: '#FFFFFF', // White text when selected
     fontWeight: 'bold',
  },
});

export default SetupScreen;
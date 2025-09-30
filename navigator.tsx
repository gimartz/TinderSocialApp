// src/navigation/AppNavigator.js
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Import Screens
import LoginScreen from './screens/auth/LoginScreen';
import DashboardScreen from './screens/dashboard/dashboardScreen';
import OrdersScreen from './screens/match/match';
import SettingsScreen from './screens/settings/settingsScreen';
import {colors} from './theme/colors'; // Import your colors
import RegisterScreen from './screens/auth/registerScreen';
import MenuScreen from './screens/menu';
import {navigationRef} from './ref';
import ForgotPasswordScreen from './screens/auth/forgotPassword/forgotPasswordScreen';
import ForgotPasswordCompleteScreen from './screens/auth/forgotPassword/resetPasswordScreen';
import SplashScreen from './screens/auth/splash';
import ChatTabsScreen from './screens/chat/index';
import ChatsScreen from './screens/chat/chat';
import LandingScreen from './screens/auth/landing';
import ChatDetailScreen from './screens/chat/chatDetail';
import ChatScreen from './screens/chat/main';
import { Colors } from './components/constants/colors';
import ProfileScreen from './screens/settings/index';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const matcheStack = createStackNavigator();
const ChatStack = createStackNavigator();
const OnboardStack = createStackNavigator();
const SettingsStack = createStackNavigator();
// Stack Navigator for Orders flow
function MatchesNavigator() {
  return (
    <matcheStack.Navigator screenOptions={{headerShown: false}}>
      <matcheStack.Screen name="match" component={OrdersScreen} />
    </matcheStack.Navigator>
  );
}

// Stack Navigator for Menu flow
function ChatNavigator() {
  return (
    <ChatStack.Navigator screenOptions={{headerShown: false}}>
      <ChatStack.Screen
        name="chatTabs"
        component={ChatTabsScreen}
      />
      <ChatStack.Screen name="chatItem" component={ChatsScreen} />
       <ChatStack.Screen name="ChatDetail" component={ChatDetailScreen} />
  
    </ChatStack.Navigator>
  );
}

// Settings Navigator - FIXED: Remove props passing
function SettingsNavigator() {
  return (
    <SettingsStack.Navigator
      initialRouteName="Setting"
      screenOptions={{headerShown: false}}>
      <SettingsStack.Screen name="Setting" component={ProfileScreen} />
    
   
  
    </SettingsStack.Navigator>
  );
}

// Main Bottom Tab Navigator - FIXED: Remove props passing for Settings
function MainAppTabs() {
  return (
    <Tab.Navigator
  
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'flame' : 'flame-outline';
          } else if (route.name === 'Matches') {
            iconName = focused ? 'heart' : 'heart-outline';
             } else if (route.name === 'Chats') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.lightGray,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Matches" component={MatchesNavigator} />
      <Tab.Screen name="Chats" component={ChatNavigator} />
     
      <Tab.Screen
        name="Profile"
        component={SettingsNavigator}
      
      />
    </Tab.Navigator>
  );
}

function OnBoardingNavigator() {
  return (
    <OnboardStack.Navigator  screenOptions={{headerShown: false}}>
      <OnboardStack.Screen name="land" component={LandingScreen} />
      <OnboardStack.Screen name="Login" component={LoginScreen} />
      <OnboardStack.Screen name="Register" component={RegisterScreen} />
    
      <OnboardStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <OnboardStack.Screen
        name="ForgotPasswordComplete"
        component={ForgotPasswordCompleteScreen}
      />
 
    </OnboardStack.Navigator>
  );
}

// Root Navigator with Splash Screen as default
export default function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/* Splash Screen as the first/default screen */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* Main App Tabs */}
        <Stack.Screen name="MainApp" component={MainAppTabs} />

        {/* Onboarding/Login Flow */}
        <Stack.Screen name="OnboardLogin" component={OnBoardingNavigator} />

      
      </Stack.Navigator>
    </NavigationContainer>
  );
}

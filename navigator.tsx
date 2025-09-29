// src/navigation/AppNavigator.js
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Or another icon set

// Import Screens
import LoginScreen from './screens/auth/LoginScreen';
import DashboardScreen from './screens/dashboard/dashboardScreen';
import OrdersScreen from './screens/match/OrdersScreen';

import SettingsScreen from './screens/settings/settingsScreen';

import {colors} from './theme/colors'; // Import your colors
import RegisterScreen from './screens/auth/registerScreen';
import MenuScreen from './screens/menu';
import {navigationRef} from './ref';
import ForgotPasswordScreen from './screens/auth/forgotPassword/forgotPasswordScreen';
import ForgotPasswordCompleteScreen from './screens/auth/forgotPassword/resetPasswordScreen';
import SplashScreen from './screens/auth/splash';
import ChatTabsScreen from './screens/chat/index';
import ChangePasswordScreen from './screens/settings/generalSettings/restaurantInformation/passwordReset/changepass';
import LandingScreen from './screens/auth/landing';
import GeneralProfileSettings from './screens/settings/generalSettings/restaurantInformation/accountSettings/generalProfileSettingsScreen';

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
      <matcheStack.Screen name="OrdersList" component={OrdersScreen} />
    </matcheStack.Navigator>
  );
}

// Stack Navigator for Menu flow
function ChatNavigator() {
  return (
    <ChatStack.Navigator screenOptions={{headerShown: false}}>
      <ChatStack.Screen
        name="MenuTabs"
        component={ChatTabsScreen}
      />
      <ChatStack.Screen name="MenuItem" component={MenuScreen} />
   
  
    </ChatStack.Navigator>
  );
}

// Settings Navigator - FIXED: Remove props passing
function SettingsNavigator() {
  return (
    <SettingsStack.Navigator
      initialRouteName="Setting"
      screenOptions={{headerShown: false}}>
      <SettingsStack.Screen name="Setting" component={SettingsScreen} />
    
      <SettingsStack.Screen
        name="GeneralProfileSettings"
        component={GeneralProfileSettings}
      />

      <SettingsStack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />
  
    </SettingsStack.Navigator>
  );
}

// Main Bottom Tab Navigator - FIXED: Remove props passing for Settings
function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string = '';

          if (route.name === 'Dashboard') iconName = 'dashboard';
          else if (route.name === 'Orders') iconName = 'list-alt';
          else if (route.name === 'Menu') iconName = 'food-bank';
         
          else if (route.name === 'Settings')
            iconName = focused ? 'settings' : 'settings-applications';

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grey_medium,
        tabBarStyle: {backgroundColor: colors.background},
      })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="matches" component={MatchesNavigator} />
      <Tab.Screen name="Chat" component={ChatNavigator} />
     
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            // Reset the settings stack to initial route
            navigation.navigate('Settings', {
              screen: 'Setting',
            });
          },
        })}
      />
    </Tab.Navigator>
  );
}

function OnBoardingNavigator() {
  return (
    <OnboardStack.Navigator screenOptions={{headerShown: false}}>
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

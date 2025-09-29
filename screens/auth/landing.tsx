import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar } from 'react-native';
import { Banner } from 'react-native-paper';

import Icon from 'react-native-vector-icons/Ionicons';

// You'll need to add a background image to your assets folder
const backgroundImage = require('../../assets/hero-one.jpg'); 

const LandingScreen = ({ navigation }: { navigation: any }) => {
  return (
    <ImageBackground source={backgroundImage}  resizeMode='cover' style={styles.background}>
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.logo}>BEYOND DATING</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.taglineContainer}>
            <Icon name="female" size={20} color="#FF6B6B" />
            <Icon name="heart" size={20} color="#FF6B6B" style={{ marginHorizontal: 5 }}/>
            <Text style={styles.tagline}>Live Chat Matchmaking</Text>
            <Icon name="male" size={20} color="#4D96FF" style={{ marginHorizontal: 5 }}/>
            <Icon name="heart" size={20} color="#4D96FF" />
          </View>

          <View style={styles.bottomCard}>
            <View style={styles.handle} />
            <Text style={styles.cardTitle}>Start Your Journey to Find Love</Text>
            <Text style={styles.cardDescription}>
              Join a vibrant community where you can find meaningful connections based on shared interests and values.
            </Text>
            <TouchableOpacity style={styles.loginButtonWrapper} onPress={() => navigation.navigate('Login')}>
             <View  style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>Login</Text>
            </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.signupText, styles.signupLink]}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60, // Adjust as needed for status bar height
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginHorizontal: 10,
  },
  bottomCard: {
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 2.5,
    marginBottom: 25,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  loginButtonWrapper: {
    width: '100%',
    shadowColor: '#FF556B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,borderRadius: 15,
    elevation: 10,
  },
  loginButton: {
    width: '100%',
    paddingVertical: 15,backgroundColor:'#FF556B',
    borderRadius: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white', // Match the card's background
  },
  signupText: {
    fontSize: 16,
    color: '#666',
  },
  signupLink: {
    color: '#FF556B',
    fontWeight: 'bold',
  },
});

export default LandingScreen;
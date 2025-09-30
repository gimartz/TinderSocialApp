// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, Platform } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import TinderCard from '../../components/tinCard';
import ActionButton from '../../components/button';

import { Colors } from '../../components/constants/colors';
import { USERS } from '../../src/navigation/data';

const HomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeIndex = useSharedValue(0);

  const handleResponse = (isLike: boolean) => {
    console.log(isLike ? 'Liked' : 'Passed');
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const handleLike = () => {
    if (currentIndex < USERS.length) {
      activeIndex.value = currentIndex + 1;
      handleResponse(true);
    }
  };

  const handlePass = () => {
    if (currentIndex < USERS.length) {
      activeIndex.value = currentIndex + 1;
      handleResponse(false);
    }
  };

  const handleSuperLike = () => {
    if (currentIndex < USERS.length) {
      console.log('Super Liked!');
      activeIndex.value = currentIndex + 1;
      handleResponse(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
       Discover <Text style={{ color: Colors.primary }}>more</Text>
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {currentIndex >= USERS.length ? (
          <View style={styles.noMoreCards}>
            <Text style={styles.noMoreCardsText}>No more profiles</Text>
            <Text style={styles.noMoreCardsSubtext}>
              Check back later for new matches
            </Text>
          </View>
        ) : (
          <>
            {USERS.slice(currentIndex, currentIndex + 3).map((user, index) => (
              <TinderCard
                key={user.id}
                user={user}
                numOfCards={3}
                index={currentIndex + index}
                activeIndex={activeIndex}
                onResponse={handleResponse}
              />
            ))}
          </>
        )}
      </View>

      {currentIndex < USERS.length && (
        <View style={styles.buttonsContainer}>
          <ActionButton
            name="close"
            size={32}
            color={Colors.nope}
            onPress={handlePass}
          />
          <ActionButton
            name="star"
            size={28}
            color={Colors.secondary}
            onPress={handleSuperLike}
            style={styles.superLikeButton}
          />
          <ActionButton
            name="heart"
            size={32}
            color={Colors.like}
            onPress={handleLike}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',paddingTop:Platform.OS=='android'?40:2
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreCards: {
    alignItems: 'center',
    padding: 40,
  },
  noMoreCardsText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  noMoreCardsSubtext: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    gap: 20,
  },
  superLikeButton: {
    width: 50,
    height: 50,
  },
});

export default HomeScreen;
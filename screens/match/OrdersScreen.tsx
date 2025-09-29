import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { moods, exploreProfiles, Mood, ExploreProfile } from './data';

// Reusable Mood Card Component
const MoodCard = ({ item }: { item: Mood }) => (
  <TouchableOpacity style={styles.moodCard}>
    <ImageBackground
      source={{ uri: item.image }}
      style={styles.moodCardImage}
      imageStyle={{ borderRadius: 16 }}
    >
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.count}</Text>
        </View>
        <Text style={styles.moodCardTitle}>{item.title}</Text>
      </LinearGradient>
    </ImageBackground>
  </TouchableOpacity>
);

// Reusable Explore Profile Card Component
const ExploreProfileCard = ({ item }: { item: ExploreProfile }) => (
  <TouchableOpacity style={styles.profileCard}>
    <ImageBackground
      source={{ uri: item.image }}
      style={styles.profileCardImage}
      imageStyle={{ borderRadius: 16 }}
    >
        <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
        >
            <Text style={styles.profileCardName}>{item.name}, {item.age}</Text>
            <View style={styles.distanceContainer}>
                <Icon name="location-sharp" size={14} color="white" />
                <Text style={styles.profileCardDistance}>{item.distance}</Text>
            </View>
        </LinearGradient>
    </ImageBackground>
  </TouchableOpacity>
);

const MatchesScreen = () => {
  const exploreFilters = ['New', 'Online', 'Travel', 'Self care', 'Date night'];
  const [activeFilter, setActiveFilter] = useState('New');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity><Icon name="notifications-outline" size={24} color="#333" /></TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15 }}><Icon name="options-outline" size={24} color="#333" /></TouchableOpacity>
        </View>
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.subtitle}>
              Find new partners that match your mood, for free.
            </Text>

            {/* Moods Section */}
            <FlatList
              data={moods}
              renderItem={({ item }) => <MoodCard item={item} />}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.moodList}
            />

            {/* Explore Section */}
            <Text style={styles.sectionTitle}>Welcome to Explore</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
              {exploreFilters.map(filter => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.chip, activeFilter === filter && styles.activeChip]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text style={[styles.chipText, activeFilter === filter && styles.activeChipText]}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        }
        data={exploreProfiles}
        renderItem={({ item }) => <ExploreProfileCard item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.profileGrid}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 5 },
    headerTitle: { fontSize: 32, fontWeight: 'bold' },
    headerIcons: { flexDirection: 'row' },
    subtitle: { fontSize: 16, color: '#666', paddingHorizontal: 20, marginBottom: 20 },
    moodList: { paddingHorizontal: 20, paddingBottom: 20 },
    moodCard: { width: 120, height: 160, marginRight: 15 },
    moodCardImage: { flex: 1, justifyContent: 'flex-end' },
    gradient: { flex: 1, borderRadius: 16, justifyContent: 'flex-end', padding: 10 },
    badge: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255, 91, 121, 0.8)', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
    badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
    moodCardTitle: { color: 'white', fontSize: 14, fontWeight: 'bold' },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 15 },
    filterContainer: { paddingHorizontal: 20, marginBottom: 20 },
    chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#e0e0e0', marginRight: 10 },
    activeChip: { backgroundColor: '#FF5B79', borderWidth: 0 },
    chipText: { color: '#333', fontWeight: '600' },
    activeChipText: { color: 'white' },
    profileGrid: { justifyContent: 'space-between', paddingHorizontal: 20 },
    profileCard: { width: '48%', height: 220, marginBottom: 15 },
    profileCardImage: { flex: 1 },
    profileCardName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    distanceContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    profileCardDistance: { color: 'white', fontSize: 12, marginLeft: 5 },
});

export default MatchesScreen;
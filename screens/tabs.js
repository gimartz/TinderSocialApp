// src/components/SegmentedControl.js
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '../src/constants/colors';

const SegmentedControl = ({tabs, activeTab, onTabPress}) => {
  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tabButton,
            activeTab === tab.id && styles.activeTabButton,
          ]}
          onPress={() => onTabPress(tab.id)}>
          <Text
            style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText,
            ]}>
            {tab.title}
          </Text>
          {tab.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>New</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    flexDirection: 'row', // For "New" badge
  },
  activeTabButton: {
    backgroundColor: COLORS.success,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.white,
  },
  newBadge: {
    backgroundColor: COLORS.primaryYellow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 5,
  },
  newBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default SegmentedControl;

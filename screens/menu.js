import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const icons: { [key: string]: string } = {
    Home: 'home',
    Chats: 'people-outline', // Updated icon
    Likes: 'heart', // New "Likes" screen
    Profile: 'person-outline',
  };

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}
          >
            <View style={isFocused && label === 'Likes' ? styles.activeIconContainer : null}>
                <Icon
                  name={icons[label]}
                  size={label === 'Likes' ? 26 : 28}
                  color={isFocused && label === 'Likes' ? 'white' : isFocused ? '#FF6B6B' : '#aaa'}
                />
            </View>
            {isFocused && label === 'Likes' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
      backgroundColor: '#FF6B6B',
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5, // space for the indicator
  },
  activeIndicator: {
      width: 25,
      height: 4,
      backgroundColor: '#FF6B6B',
      borderRadius: 2,
      position: 'absolute',
      bottom: 10,
  }
});

export default CustomTabBar;
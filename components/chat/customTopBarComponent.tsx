// FILE: src/components/CustomTopTabBar.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {THEME} from '../../screens/theme';

interface CustomTopTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const CustomTopTabBar: React.FC<CustomTopTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.tabBarContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {state.routes.map((route: any, index: number) => {
          const {options} = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
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
              onPress={onPress}
              style={[styles.tabItem, isFocused && styles.tabItemFocused]}>
              <Text
                style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: THEME.CREAM_WHITE,
  },
  tabItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 4,
    backgroundColor: THEME.LIGHT_GRAY,
  },
  tabItemFocused: {
    backgroundColor: THEME.BOLD_YELLOW,
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.MEDIUM_GRAY,
  },
  tabLabelFocused: {
    color: THEME.DARK_CHARCOAL,
    fontWeight: 'bold',
  },
});

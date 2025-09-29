// FILE: src/screens/NotificationsScreen.js

import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Appbar, Card} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {THEME} from '../../../theme'; // Import your shared theme
import ToggleSwitch from '../../../../components/storeStatusToggler/toggle'; // Import our new component

// --- Mock Notification Data ---
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'new_order',
    title: 'New Order #12345',
    body: 'A new order for 3 items has been placed by Jane D.',
    timestamp: '5m ago',
    unread: true,
  },
  {
    id: '2',
    type: 'review',
    title: 'You have a new 5-star review!',
    body: '"The best burger I have ever had!" - John S.',
    timestamp: '1h ago',
    unread: true,
  },
  {
    id: '3',
    type: 'earnings',
    title: 'Weekly Payout Sent',
    body: 'Your payout of $1,250.75 has been initiated.',
    timestamp: '1d ago',
    unread: false,
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Low on stock: Buns',
    body: 'Your inventory for "Burger Buns" is running low.',
    timestamp: '2d ago',
    unread: false,
  },
  {
    id: '5',
    type: 'new_order',
    title: 'New Order #12344',
    body: 'A new order for 1 item has been placed by Mike R.',
    timestamp: '2d ago',
    unread: false,
  },
];

// Helper to get icon and color based on notification type
const getNotificationAppearance = type => {
  switch (type) {
    case 'new_order':
      return {icon: 'receipt-text-check-outline', color: THEME.INFO_BLUE};
    case 'review':
      return {icon: 'star-outline', color: THEME.BOLD_YELLOW};
    case 'earnings':
      return {icon: 'cash-multiple', color: THEME.SUCCESS_GREEN};
    case 'reminder':
      return {icon: 'alert-circle-outline', color: THEME.VIBRANT_RED};
    default:
      return {icon: 'bell-outline', color: THEME.MEDIUM_GRAY};
  }
};

const NotificationsScreen = ({navigation}) => {
  const [appAlertsEnabled, setAppAlertsEnabled] = useState(true);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleNotificationPress = item => {
    // Mark as read and navigate (or perform other action)
    const updatedNotifications = notifications.map(notif =>
      notif.id === item.id ? {...notif, unread: false} : notif,
    );
    setNotifications(updatedNotifications);
    // e.g., navigation.navigate('OrderDetails', { orderId: item.orderId });
  };

  const renderNotificationItem = ({item}) => {
    const {icon, color} = getNotificationAppearance(item.type);
    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
        style={[styles.notificationCard, item.unread && styles.unreadCard]}>
        <View style={[styles.iconContainer, {backgroundColor: `${color}20`}]}>
          <MaterialCommunityIcons name={icon} size={26} color={color} />
        </View>
        <View style={styles.notificationTextContainer}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationBody} numberOfLines={2}>
            {item.body}
          </Text>
        </View>
        <View style={styles.notificationMetaContainer}>
          <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
          {item.unread && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.sectionHeader}>Notification Settings</Text>
      <ToggleSwitch
        icon="star-outline"
        title="App Alerts"
        description="Receive push notifications for all activities."
        isEnabled={appAlertsEnabled}
        onToggle={() => setAppAlertsEnabled(prev => !prev)}
      />
      <Text style={styles.sectionHeader}>Recent Activity</Text>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <MaterialCommunityIcons
        name="bell-off-outline"
        size={60}
        color={THEME.MEDIUM_GRAY}
      />
      <Text style={styles.emptyStateTitle}>All Caught Up!</Text>
      <Text style={styles.emptyStateMessage}>
        You don't have any new notifications right now.
      </Text>
    </View>
  );

  return (
    <View style={styles.pageContainer}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={THEME.CREAM_WHITE}
        />
        <Appbar.Content title="Notifications" titleStyle={styles.appbarTitle} />
      </Appbar.Header>

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: THEME.CREAM_WHITE,
  },
  appbar: {
    backgroundColor: THEME.DARK_CHARCOAL,
    elevation: 0,
  },
  appbarTitle: {
    color: THEME.CREAM_WHITE,
    fontWeight: '800',
    fontSize: 22,
  },
  listContainer: {
    paddingBottom: 50,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
    marginBottom: 15,
    marginTop: 10,
  },

  // --- Notification Item ---
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.LIGHT_GRAY,
  },
  unreadCard: {
    backgroundColor: `${THEME.BOLD_YELLOW}1A`, // Very light yellow tint for unread items
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
  },
  notificationBody: {
    fontSize: 14,
    color: THEME.MEDIUM_GRAY,
    marginTop: 4,
    lineHeight: 20,
  },
  notificationMetaContainer: {
    alignItems: 'flex-end',
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  notificationTimestamp: {
    fontSize: 12,
    color: THEME.MEDIUM_GRAY,
    marginBottom: 8,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.VIBRANT_RED,
  },

  // --- Empty State ---
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
    marginTop: 20,
  },
  emptyStateMessage: {
    fontSize: 16,
    color: THEME.MEDIUM_GRAY,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 24,
  },
});

export default NotificationsScreen;

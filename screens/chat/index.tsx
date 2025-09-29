import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import { onlineUsers, recentChats, OnlineUser, RecentChat } from './data';
import Icon from 'react-native-vector-icons/Ionicons';
import {Appbar, Card, Button} from 'react-native-paper';

import {THEME} from '../theme';
const ChatsScreen = ({navigation}) => {
  const renderOnlineUser = ({ item }: { item: OnlineUser }) => (
    <TouchableOpacity style={styles.onlineUserContainer}>
      <View>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.onlineBadge} />
      </View>
      <Text style={styles.onlineUserName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRecentChat = ({ item }: { item: RecentChat }) => {
    const renderStatusIcon = () => {
        if (item.status === 'read') return <Icon name="checkmark-done-outline" size={16} color="#FF6B6B" />;
        if (item.status === 'delivered') return <Icon name="checkmark-outline" size={16} color="#999" />;
        if (item.status === 'image') return <Icon name="camera-outline" size={14} color="#999" />;
        return null;
    }
    
    return (
        <TouchableOpacity style={styles.chatItemContainer} onPress={navigation.navigate('chatItem')}>
            <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
            <View style={styles.chatTextContainer}>
                <Text style={styles.chatName}>{item.name}</Text>
                <View style={styles.lastMessageContainer}>
                    {renderStatusIcon()}
                    <Text style={[styles.lastMessage, item.isTyping && styles.typingText]}>
                        {item.lastMessage}
                    </Text>
                </View>
            </View>
            <View style={styles.chatMetaContainer}>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
                {item.unreadCount && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{item.unreadCount}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    )
  };

  return (
    <SafeAreaView style={styles.container}>
          <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Manage your Matches" titleStyle={styles.appbarTitle} />
      </Appbar.Header>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Online Now</Text>
        <FlatList
          data={onlineUsers}
          renderItem={renderOnlineUser}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20 }}
        />
      </View>

      <View style={[styles.section, { flex: 1 }]}>
        <Text style={[styles.sectionTitle, { marginLeft: 20 }]}>Recent</Text>
        <FlatList
          data={recentChats}
          renderItem={renderRecentChat}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  onlineUserContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  onlineBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    top: 0,
    right: 0,
    borderWidth: 2,
    borderColor: 'white',
  },
  onlineUserName: {
    marginTop: 5,
    color: '#555',
  },
  chatItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chatAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 15,
  },
  chatTextContainer: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
    appbar: {backgroundColor: '#BF007',elevation: 0},
  appbarTitle: {color: THEME.CREAM_WHITE, fontWeight: '800', fontSize: 22},
  lastMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#777',
    marginLeft: 5,
  },
  typingText: {
    color: '#FF6B6B',
    fontStyle: 'italic',
  },
  chatMetaContainer: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  unreadBadge: {
    backgroundColor: '#FF6B6B',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ChatsScreen;

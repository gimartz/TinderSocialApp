// src/components/ChatListItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { Colors } from './constants/colors';
import { Chat } from '../src/navigation/types';

interface ChatListItemProps {
  chat: Chat;
  onPress: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: chat.user.image }} style={styles.avatar} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{chat.user.name}</Text>
          <Text style={styles.timestamp}>{chat.timestamp}</Text>
        </View>
        
        <Text
          style={[styles.lastMessage, chat.unread && styles.unreadMessage]}
          numberOfLines={1}
        >
          {chat.lastMessage}
        </Text>
      </View>
      
      {chat.unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.gray,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.gray,
  },
  unreadMessage: {
    fontWeight: '600',
    color: Colors.text,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
});

export default ChatListItem;
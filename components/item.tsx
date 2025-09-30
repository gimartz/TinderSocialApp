// src/components/MessageBubble.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from './constants/colors';
import { Message } from '../src/navigation/types';
import { CURRENT_USER } from '../src/navigation/data';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isMyMessage = message.senderId === CURRENT_USER.id;

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <View
      style={[
        styles.container,
        isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMyMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text
          style={[
            styles.text,
            isMyMessage ? styles.myMessageText : styles.theirMessageText,
          ]}
        >
          {message.text}
        </Text>
      </View>
      <Text style={styles.timestamp}>{formatTime(message.createdAt)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
    maxWidth: '75%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  theirMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 4,
  },
  myMessage: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    backgroundColor: Colors.lightGray,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: Colors.white,
  },
  theirMessageText: {
    color: Colors.text,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.gray,
    marginHorizontal: 4,
  },
});

export default MessageBubble;
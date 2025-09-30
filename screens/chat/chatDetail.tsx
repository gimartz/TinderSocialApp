// src/screens/ChatDetailScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MessageBubble from '../../components/item';

import { Colors } from '../../components/constants/colors';
import { RootStackParamList } from '../../src/navigation/types';
import { MESSAGES } from './messgaData';

type ChatDetailRouteProp = RouteProp<RootStackParamList, 'ChatDetail'>;

const ChatDetailScreen = () => {
  const route = useRoute<ChatDetailRouteProp>();
  const navigation = useNavigation();
  const { chat } = route.params;

  const messages = MESSAGES[chat.id] || [];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="chevron-back" size={28} color={Colors.primary} />
          </TouchableOpacity>

          <Image source={{ uri: chat.user.image }} style={styles.avatar} />

          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{chat.user.name}</Text>
            <Text style={styles.headerStatus}>Active now</Text>
          </View>

          <TouchableOpacity style={styles.iconButton}>
            <Icon name="videocam" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="call" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messagesList}
          inverted={false}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="add-circle" size={32} color={Colors.primary} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={Colors.gray}
            multiline
          />

          <TouchableOpacity style={styles.sendButton}>
            <Icon name="send" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  backButton: {
    marginRight: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  headerStatus: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  iconButton: {
    marginLeft: 16,
  },
  messagesList: {
    paddingVertical: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  addButton: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default ChatDetailScreen;
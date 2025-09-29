import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { conversation, Message } from './messages';

// We'll receive navigation props to go back
const ChatDetailScreen = ({ navigation }: { navigation: any }) => {
  const [messages, setMessages] = useState(conversation.slice().reverse()); // reverse for inverted FlatList
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim().length > 0) {
      const newMessage: Message = {
        id: (messages.length + 1).toString(),
        text: inputText,
        senderId: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([newMessage, ...messages]);
      setInputText('');
    }
  };

  const renderMessage = ({ item, index }: { item: Message, index: number }) => {
    const isMyMessage = item.senderId === 'me';
    // Logic to show the "Today" chip only once
    const showDateChip = index === messages.length - 1;

    return (
      <>
        {showDateChip && (
            <View style={styles.dateChip}>
                <Text style={styles.dateChipText}>Today</Text>
            </View>
        )}
        <View style={[
          styles.messageRow,
          isMyMessage ? styles.myMessageRow : styles.theirMessageRow
        ]}>
          <View style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble
          ]}>
            <Text style={isMyMessage ? styles.myMessageText : styles.theirMessageText}>{item.text}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerUserInfo}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/women/1.jpg' }} style={styles.headerAvatar} />
           <View style={styles.onlineBadge} />
          <View>
            <Text style={styles.headerName}>Stella</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity><Icon name="call-outline" size={24} color="#333" /></TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 20 }}><Icon name="videocam-outline" size={24} color="#333" /></TouchableOpacity>
          <TouchableOpacity><Icon name="ellipsis-vertical" size={24} color="#333" /></TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -50} // Adjust as needed
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          inverted // Key for chat interfaces
          contentContainerStyle={styles.messageList}
        />
        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.inputButton}><Icon name="add-outline" size={28} color="#555" /></TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Your message..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.inputButton}><Icon name="mic-outline" size={26} color="#555" /></TouchableOpacity>
          <TouchableOpacity style={[styles.inputButton, {marginRight: 10}]} onPress={handleSend}>
             <Icon name="send" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerUserInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 15 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  onlineBadge: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: '#4CAF50',
    position: 'absolute', top: 30, left: 30, borderWidth: 1.5, borderColor: 'white',
  },
  headerName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  headerStatus: { fontSize: 12, color: '#4CAF50' },
  headerIcons: { flexDirection: 'row' },
  messageList: { paddingHorizontal: 10, paddingTop: 10 },
  messageRow: { marginVertical: 5 },
  myMessageRow: { alignItems: 'flex-end' },
  theirMessageRow: { alignItems: 'flex-start' },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    maxWidth: '75%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  myMessageBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomRightRadius: 5,
  },
  theirMessageBubble: {
    backgroundColor: '#FFF0F3',
    borderBottomLeftRadius: 5,
  },
  myMessageText: { color: '#333', fontSize: 15 },
  theirMessageText: { color: '#333', fontSize: 15 },
  timestamp: { fontSize: 10, color: '#999', marginLeft: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  inputButton: {
      padding: 5,
      marginLeft: 5,
  },
  dateChip: {
      alignSelf: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 12,
      paddingVertical: 5,
      paddingHorizontal: 12,
      marginVertical: 10,
  },
  dateChipText: {
      color: '#777',
      fontSize: 12,
      fontWeight: '600',
  }
});

export default ChatDetailScreen;
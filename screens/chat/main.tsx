// src/screens/ChatsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


import { Colors } from '../../components/constants/colors';
import { RootStackParamList } from '../../src/navigation/types';
import { CHATS } from './messgaData';
import ChatListItem from '../../components/ChatListItem';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ChatScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleChatPress = (chat: any) => {
    navigation.navigate('ChatDetail', { chat });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      <FlatList
        data={CHATS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatListItem
            chat={item}
            onPress={() => handleChatPress(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
  },
  listContent: {
    paddingBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginLeft: 88,
  },
});

export default ChatScreen;
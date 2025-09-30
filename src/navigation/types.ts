// src/types/index.ts

export interface User {
  id: string;
  name: string;
  age: number;
  image: string;
  bio?: string;
  distance?: string;
}

export interface Message {
  id: string;
  text: string;
  createdAt: Date;
  senderId: string;
  receiverId: string;
}

export interface Chat {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
}

export type RootStackParamList = {
  MainTabs: undefined;
  ChatDetail: { chat: Chat };
};

export type BottomTabParamList = {
  Home: undefined;
  Chats: undefined;
  Profile: undefined;
};
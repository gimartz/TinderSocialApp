// src/data/messages.ts

import { CURRENT_USER, USERS } from "../../src/navigation/data";
import { Chat, Message } from "../../src/navigation/types";

export const CHATS: Chat[] = [
  {
    id: '1',
    user: USERS[0],
    lastMessage: 'Hey! How are you doing? 😊',
    timestamp: '2m ago',
    unread: true,
  },
  {
    id: '2',
    user: USERS[1],
    lastMessage: 'That sounds great! When are you free?',
    timestamp: '1h ago',
    unread: false,
  },
  {
    id: '3',
    user: USERS[2],
    lastMessage: 'Thanks for the recommendation!',
    timestamp: '3h ago',
    unread: true,
  },
  {
    id: '4',
    user: USERS[3],
    lastMessage: 'See you tomorrow! 👋',
    timestamp: '1d ago',
    unread: false,
  },
  {
    id: '5',
    user: USERS[4],
    lastMessage: 'I love that place too!',
    timestamp: '2d ago',
    unread: false,
  },
];

export const MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      text: 'Hi there! 👋',
      createdAt: new Date(Date.now() - 3600000),
      senderId: USERS[0].id,
      receiverId: CURRENT_USER.id,
    },
    {
      id: '2',
      text: 'Hey! How are you doing?',
      createdAt: new Date(Date.now() - 3500000),
      senderId: CURRENT_USER.id,
      receiverId: USERS[0].id,
    },
    {
      id: '3',
      text: "I'm good! Just got back from a trip to Bali 🌴",
      createdAt: new Date(Date.now() - 3400000),
      senderId: USERS[0].id,
      receiverId: CURRENT_USER.id,
    },
    {
      id: '4',
      text: 'That sounds amazing! How was it?',
      createdAt: new Date(Date.now() - 3300000),
      senderId: CURRENT_USER.id,
      receiverId: USERS[0].id,
    },
    {
      id: '5',
      text: 'It was incredible! The beaches were stunning and the food was delicious 😋',
      createdAt: new Date(Date.now() - 3200000),
      senderId: USERS[0].id,
      receiverId: CURRENT_USER.id,
    },
    {
      id: '6',
      text: "I've always wanted to go there!",
      createdAt: new Date(Date.now() - 3100000),
      senderId: CURRENT_USER.id,
      receiverId: USERS[0].id,
    },
    {
      id: '7',
      text: 'You should definitely visit! I can give you some recommendations 😊',
      createdAt: new Date(Date.now() - 120000),
      senderId: USERS[0].id,
      receiverId: CURRENT_USER.id,
    },
  ],
  '2': [
    {
      id: '1',
      text: 'Hey! I saw you like coffee too ☕',
      createdAt: new Date(Date.now() - 7200000),
      senderId: USERS[1].id,
      receiverId: CURRENT_USER.id,
    },
    {
      id: '2',
      text: 'Yes! I love trying new coffee shops',
      createdAt: new Date(Date.now() - 7100000),
      senderId: CURRENT_USER.id,
      receiverId: USERS[1].id,
    },
    {
      id: '3',
      text: "There's this amazing place downtown. Want to check it out sometime?",
      createdAt: new Date(Date.now() - 7000000),
      senderId: USERS[1].id,
      receiverId: CURRENT_USER.id,
    },
    {
      id: '4',
      text: 'That sounds great! When are you free?',
      createdAt: new Date(Date.now() - 3600000),
      senderId: CURRENT_USER.id,
      receiverId: USERS[1].id,
    },
  ],
};
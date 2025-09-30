export interface OnlineUser {
  id: string;
  name: string;
  avatar: string;
}

export interface RecentChat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isTyping?: boolean;
  status?: 'sent' | 'delivered' | 'read' | 'image';
}

export const onlineUsers: OnlineUser[] = [
  { id: '1', name: 'Bimpe', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: '2', name: 'Nneka', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '3', name: 'Dera', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { id: '4', name: 'Janet', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: '5', name: 'Isabel', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
  { id: '6', name: 'Diana', avatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
];

export const recentChats: RecentChat[] = [
  { id: '1', name: 'Vicki Ellis', avatar: 'https://randomuser.me/api/portraits/women/10.jpg', lastMessage: 'is there any plan on thi...', timestamp: '11:30 PM', status: 'delivered'},
  { id: '2', name: 'Albert Flores', avatar: 'https://randomuser.me/api/portraits/men/11.jpg', lastMessage: 'This is nice, I love it ❤️', timestamp: '12:55 AM', unreadCount: 1 },
  { id: '3', name: 'Leona Fisher', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', lastMessage: 'What are you doing now ?', timestamp: 'Just Now', status: 'read' },
  { id: '4', name: 'Guy Hawkins', avatar: 'https://randomuser.me/api/portraits/men/12.jpg', lastMessage: 'Typing...', timestamp: 'Yesterday', isTyping: true },
  { id: '5', name: 'Mila Foster', avatar: 'https://randomuser.me/api/portraits/women/14.jpg', lastMessage: 'Sent you image', timestamp: '14/12/2022', unreadCount: 2, status: 'image' },
  { id: '6', name: 'Tracey Burns', avatar: 'https://randomuser.me/api/portraits/women/15.jpg', lastMessage: 'You: This is COOL', timestamp: '14/12/2022', status: 'read' },
];
export interface Message {
  id: string;
  text: string;
  senderId: 'me' | 'stella';
  timestamp: string;
}

export const conversation: Message[] = [
  { id: '1', text: 'Hello 👋', senderId: 'stella', timestamp: '8:00AM' },
  { id: '2', text: 'Hyy, Stella 👋\nGood Morning', senderId: 'me', timestamp: '8:01AM' },
  { id: '3', text: 'How are you?', senderId: 'stella', timestamp: '8:01AM' },
  { id: '4', text: 'I\'m fine. what about you?', senderId: 'me', timestamp: '8:02AM' },
  { id: '5', text: 'I\'m also fine.', senderId: 'stella', timestamp: '8:02AM' },
  { id: '6', text: 'I really liked your profile.\nYou love hiking too?🤗', senderId: 'stella', timestamp: '8:02AM' },
  { id: '7', text: 'Yes, Stella! I go almost every weekend.\nNature is my therapy.', senderId: 'me', timestamp: '8:02AM' },
  { id: '8', text: 'That\'s Awesome!\nEver been to Sajek Velly?', senderId: 'stella', timestamp: '8:02AM' },
  { id: '9', text: 'Not yet, but it\'s on my list!', senderId: 'me', timestamp: '8:02AM' },
];
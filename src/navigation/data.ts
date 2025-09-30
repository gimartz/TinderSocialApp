// src/data/users.ts
import { User } from './types';

export const USERS: User[] = [
  {
    id: '1',
    name: 'Jennifer Ashley',
    age: 23,
    image: require('../../assets/dayo.jpg'),
    bio: 'Love traveling and photography 📸',
    distance: '3 km away',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    age: 25,
    image:  'https://img.freepik.com/free-photo/medium-shot-woman-wearing-full-pink-outfit_23-2150138076.jpg',
    bio: 'Coffee enthusiast ☕ | Bookworm 📚',
    distance: '5 km away',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    age: 24,
    image: 'https://img.freepik.com/free-photo/pretty-black-woman-with-braids_633478-1380.jpg',
    bio: 'Fitness lover 💪 | Dog mom 🐕',
    distance: '2 km away',
  },
  {
    id: '4',
    name: 'Olivia Brown',
    age: 26,
    image: 'https://img.freepik.com/free-photo/medium-shot-woman-wearing-full-pink-outfit_23-2150138076.jpg',
    bio: 'Artist 🎨 | Music lover 🎵',
    distance: '7 km away',
  },
  {
    id: '5',
    name: 'Sophia Davis',
    age: 22,
    image:  'https://img.freepik.com/free-photo/woman-looking-up_246466-27.jpg',
    bio: 'Adventure seeker 🌍 | Foodie 🍕',
    distance: '4 km away',
  },
  {
    id: '6',
    name: 'Mia Martinez',
    age: 27,
    image:  'https://img.freepik.com/free-photo/attractive-american-young-woman-with-red-lips_171337-17102.jpg',
    bio: 'Yoga instructor 🧘‍♀️ | Vegan 🌱',
    distance: '6 km away',
  },
  {
    id: '7',
    name: 'Isabella Garcia',
    age: 23,
    image:  'https://img.freepik.com/free-photo/close-up-woman-wearing-earrings_23-2149220907.jpg',
    bio: 'Fashion blogger 👗 | Beach lover 🏖️',
    distance: '8 km away',
  },
  {
    id: '8',
    name: 'Charlotte Lopez',
    age: 25,
    image:  require('../../assets/bimpe.jpg'),
    bio: 'Chef 👩‍🍳 | Wine enthusiast 🍷',
    distance: '3 km away',
  },
];

export const CURRENT_USER: User = {
  id: 'current',
  name: 'You',
  age: 25,
  image: 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' ,
  bio: 'Just looking for something real',
  distance: '0 km away',
};
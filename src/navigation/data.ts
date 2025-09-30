// src/data/users.ts
import { User } from './types';

export const USERS: User[] = [
  {
    id: '1',
    name: 'Jennifer Ashley',
    age: 23,
    image: require('../../assets/bimpe.jpg'),
    bio: 'Love traveling and photography 📸',
    distance: '3 km away',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    age: 25,
    image:  require('../../assets/bimpe.jpg'),
    bio: 'Coffee enthusiast ☕ | Bookworm 📚',
    distance: '5 km away',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    age: 24,
    image: require('../../assets/bimpe.jpg'),
    bio: 'Fitness lover 💪 | Dog mom 🐕',
    distance: '2 km away',
  },
  {
    id: '4',
    name: 'Olivia Brown',
    age: 26,
    image: require('../../assets/bimpe.jpg'),
    bio: 'Artist 🎨 | Music lover 🎵',
    distance: '7 km away',
  },
  {
    id: '5',
    name: 'Sophia Davis',
    age: 22,
    image:  require('../../assets/bimpe.jpg'),
    bio: 'Adventure seeker 🌍 | Foodie 🍕',
    distance: '4 km away',
  },
  {
    id: '6',
    name: 'Mia Martinez',
    age: 27,
    image:  require('../../assets/bimpe.jpg'),
    bio: 'Yoga instructor 🧘‍♀️ | Vegan 🌱',
    distance: '6 km away',
  },
  {
    id: '7',
    name: 'Isabella Garcia',
    age: 23,
    image:  require('../../assets/bimpe.jpg'),
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
  image:  require('../../assets/bimpe.jpg'),
  bio: 'Just looking for something real',
  distance: '0 km away',
};
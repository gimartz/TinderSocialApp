export interface Mood {
  id: string;
  title: string;
  count: number;
  image: string;
}

export interface ExploreProfile {
  id: string;
  name: string;
  age: number;
  distance: string;
  image: string;
}

export const moods: Mood[] = [
  { id: '1', title: 'Looking for love', count: 30, image: 'https://images.pexels.com/photos/3775164/pexels-photo-3775164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: '2', title: 'Let\'s be friend', count: 14, image: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: '3', title: 'Nothing serious', count: 55, image: 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
];

export const exploreProfiles: ExploreProfile[] = [
  { id: '1', name: 'Jenifer Ashley', age: 23, distance: 'Near by', image: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg' },
  { id: '2', name: 'Jenifer Ashley', age: 23, distance: '1km Away', image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg' },
  { id: '3', name: 'Angela', age: 21, distance: '5km Away', image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' },
  { id: '4', name: 'Alina', age: 25, distance: '12km Away', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' },
];
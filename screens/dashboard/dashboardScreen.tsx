import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import {
  interpolate,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import TinderCard from '../../components/tinderCard/card';
import AnimatedStack from '../../components/tinderCard/swipe';

const dummuUsers = [
  {
    id: 1,
    image:
      'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/1.jpg',
    name: 'Dani',age:21
  },
  {
    id: 2,
    image:
      'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/2.jpg',
    name: 'Jon',age:22
  },
  {
    id: 3,
    image:
      'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/3.jpg',
    name: 'Dani', age:28
  },
  {
    id: 4,
    image:
      'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/4.jpeg',
    name: 'Alice',age:34
  },
  {
    id: 5,
    image:
      'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/5.jpg',
    name: 'Dani',age:32
  },
  {
    id: 6,
    image:
      'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/6.jpg',
    name: 'Kelsey',age:32
  },
];

const TinderScreen = () => {
  const [users, setUsers] = useState(dummuUsers);
  const activeIndex = useSharedValue(0);
  const [index, setIndex] = useState(0);

  useAnimatedReaction(
    () => activeIndex.value,
    (value, prevValue) => {
      if (Math.floor(value) !== index) {
        runOnJS(setIndex)(Math.floor(value));
      }
    }
  );
  const onSwipeLeft = (user:any) => {
    console.warn('swipe left', user.name);
  };

  const onSwipeRight = (user:any)=> {
    console.warn('swipe right: ', user.name);
  };
  useEffect(() => {
    if (index > users.length - 3) {
      console.warn('Last 2 cards remining. Fetch more!');
      setUsers((usrs) => [...usrs, ...dummuUsers.reverse()]);
    }
  }, [index]);

  const onResponse = (res: boolean) => {
    console.log('on Response: ', res);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  
      {/* {users.map((user, index) => (
        <TinderCard
          key={`${user.id}-${index}`}
          user={user}
          numOfCards={users.length}
          index={index}
          activeIndex={activeIndex}
          onResponse={onResponse}
        />
      ))} */}
         <AnimatedStack
        data={users}
        renderItem={({item}: {item: typeof dummuUsers[0]}) => <TinderCard user={item}  numOfCards={users.length}
          index={index}
          activeIndex={activeIndex}
          onResponse={onResponse} />}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      />
    </View>
  );
};

export default TinderScreen;
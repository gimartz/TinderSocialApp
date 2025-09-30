import React, { useImperativeHandle } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('screen').width;
export const tinderCardWidth = screenWidth * 0.9;

export type User = {
  id: string;
  image: string;
  name: string;
  age: number;
  location: string;
};

type TinderCardProps = {
  user: User;
  numOfCards: number;
  index: number;
  activeIndex: SharedValue<number>;
  onResponse: (a: boolean) => void;
};

// Expose swipe methods to the parent component
export type TinderCardRef = {
    swipeLeft: () => void;
    swipeRight: () => void;
}

const TinderCard = React.forwardRef<TinderCardRef, TinderCardProps>(
  ({ user, numOfCards, index, activeIndex, onResponse }, ref) => {
    const translationX = useSharedValue(0);

    const swipe = (direction: 'left' | 'right') => {
        const velocity = direction === 'right' ? 800 : -800;
        translationX.value = withSpring(Math.sign(velocity) * screenWidth, {
            velocity,
        });
        activeIndex.value = withSpring(index + 1);
        runOnJS(onResponse)(velocity > 0);
    }

    useImperativeHandle(ref, () => ({
        swipeLeft: () => swipe('left'),
        swipeRight: () => swipe('right'),
    }));

    const animatedCard = useAnimatedStyle(() => ({
      opacity: interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [1 - 1 / 5, 1, 1]
      ),
      transform: [
        {
          scale: interpolate(
            activeIndex.value,
            [index - 1, index, index + 1],
            [0.95, 1, 1]
          ),
        },
        {
          translateY: interpolate(
            activeIndex.value,
            [index - 1, index, index + 1],
            [-20, 0, 0]
          ),
        },
        { translateX: translationX.value },
        {
          rotateZ: `${interpolate(
            translationX.value,
            [-screenWidth / 2, 0, screenWidth / 2],
            [-15, 0, 15]
          )}deg`,
        },
      ],
    }));

    const gesture = Gesture.Pan()
      .onChange((event) => {
        translationX.value = event.translationX;
        activeIndex.value = interpolate(
          Math.abs(translationX.value),
          [0, screenWidth],
          [index, index + 0.8]
        );
      })
      .onEnd((event) => {
        if (Math.abs(event.velocityX) > 400) {
            swipe(event.velocityX > 0 ? 'right' : 'left');
        } else {
          translationX.value = withSpring(0);
        }
      });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, animatedCard, { zIndex: numOfCards - index }]}>
          <Image style={styles.image} source={{ uri: user.image }} />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.gradient} />
          <View style={styles.footer}>
            <View style={styles.badge}>
                <Icon name="location-sharp" size={14} color="white" />
                <Text style={styles.badgeText}>1 km</Text>
            </View>
            <Text style={styles.name}>{user.name}, {user.age}</Text>
            <Text style={styles.profession}>Professional Model</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
    card: {
        width: tinderCardWidth,
        aspectRatio: 1 / 1.6,
        borderRadius: 24,
        justifyContent: 'flex-end',
        position: 'absolute',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        overflow: 'hidden', // Ensures the gradient and image stay within the border radius
    },
    image: { ...StyleSheet.absoluteFillObject },
    gradient: { ...StyleSheet.absoluteFillObject, top: '40%' },
    footer: { padding: 20 },
    name: { fontSize: 28, color: 'white', fontWeight: 'bold' },
    profession: { fontSize: 16, color: '#eee', marginTop: 4 },
    badge: {
        position: 'absolute',
        top: -50,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    badgeText: { color: 'white', marginLeft: 5, fontWeight: '600' }
});

export default TinderCard;
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import React from 'react';
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

const screenWidth = Dimensions.get('screen').width;
export const tinderCardWidth = screenWidth * 0.85;

type TinderCard = {
  user: {
    image: string;
    name: string;
    age: number;
    bio?: string;
    distance?: string;
  };
  numOfCards: number;
  index: number;
  activeIndex: SharedValue<number>;
  onResponse: (isLike: boolean) => void;
};

const TinderCard = ({
  user,
  numOfCards,
  index,
  activeIndex,
  onResponse,
}: TinderCard) => {
  const translationX = useSharedValue(0);

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
          [-30, 0, 0]
        ),
      },
      {
        translateX: translationX.value,
      },
      {
        rotateZ: `${interpolate(
          translationX.value,
          [-screenWidth / 2, 0, screenWidth / 2],
          [-15, 0, 15]
        )}deg`,
      },
    ],
  }));

  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translationX.value,
      [0, screenWidth / 4],
      [0, 1]
    ),
  }));

  const nopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translationX.value,
      [-screenWidth / 4, 0],
      [1, 0]
    ),
  }));

  const gesture = Gesture.Pan()
    .onChange((event) => {
      translationX.value = event.translationX;

      activeIndex.value = interpolate(
        Math.abs(translationX.value),
        [0, 500],
        [index, index + 0.8]
      );
    })
    .onEnd((event) => {
      if (Math.abs(event.velocityX) > 400) {
        translationX.value = withSpring(Math.sign(event.velocityX) * 500, {
          velocity: event.velocityX,
        });
        activeIndex.value = withSpring(index + 1);

        runOnJS(onResponse)(event.velocityX > 0);
      } else {
        translationX.value = withSpring(0);
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.card,
          animatedCard,
          {
            zIndex: numOfCards - index,
          },
        ]}
      >
        <Image
          style={[StyleSheet.absoluteFillObject, styles.image]}
          source={user.image}
        />

        <Animated.View style={[styles.likeContainer, likeStyle]}>
          <View style={styles.likeBox}>
            <Text style={styles.likeText}>LIKE</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.nopeContainer, nopeStyle]}>
          <View style={styles.nopeBox}>
            <Text style={styles.nopeText}>NOPE</Text>
          </View>
        </Animated.View>

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={[StyleSheet.absoluteFillObject, styles.overlay]}
        />

        <View style={styles.footer}>
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.age}>, {user.age}</Text>
            </View>
            
            {user.bio && (
              <View style={styles.bioContainer}>
                <Text style={styles.bio} numberOfLines={2}>
                  {user.bio}
                </Text>
              </View>
            )}

            {user.distance && (
              <View style={styles.distanceContainer}>
                <View style={styles.dot} />
                <Text style={styles.distance}>{user.distance}</Text>
              </View>
            )}
          </View>

          <View style={styles.infoButton}>
            <Text style={styles.infoIcon}>ⓘ</Text>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    width: tinderCardWidth,
    aspectRatio: 1 / 1.5,
    borderRadius: 20,
    justifyContent: 'flex-end',
    position: 'absolute',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  image: {
    borderRadius: 20,
  },
  overlay: {
    top: '40%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  footer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  name: {
    fontSize: 32,
    color: 'white',
    fontWeight: '700',
  },
  age: {
    fontSize: 28,
    color: 'white',
    fontWeight: '400',
  },
  bioContainer: {
    marginTop: 4,
  },
  bio: {
    fontSize: 16,
    color: 'white',
    fontWeight: '400',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  distance: {
    fontSize: 14,
    color: 'white',
    fontWeight: '400',
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  infoIcon: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
  },
  likeContainer: {
    position: 'absolute',
    top: 50,
    left: 30,
    zIndex: 1,
  },
  likeBox: {
    borderWidth: 4,
    borderColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    transform: [{ rotate: '-20deg' }],
  },
  likeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4CAF50',
    letterSpacing: 2,
  },
  nopeContainer: {
    position: 'absolute',
    top: 50,
    right: 30,
    zIndex: 1,
  },
  nopeBox: {
    borderWidth: 4,
    borderColor: '#FF4458',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    transform: [{ rotate: '20deg' }],
  },
  nopeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF4458',
    letterSpacing: 2,
  },
});

export default TinderCard;
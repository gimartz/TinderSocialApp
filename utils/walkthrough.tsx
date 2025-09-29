import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { THEME } from '../screens/theme'; // Adjust this path to your theme file

// Define the structure for each step in our walkthrough
interface WalkthroughStep {
  icon: string;
  title: string;
  description: string;
}

// The content for our walkthrough slides
const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    icon: 'receipt',
    title: 'Accept & Manage Orders',
    description:
      "Instantly receive new orders and update their status from 'Preparing' to 'Ready for Pickup' to keep your customers informed.",
  },
  {
    icon: 'food-fork-drink',
    title: 'Craft Your Digital Menu',
    description:
      'Easily add new meals, create custom options like sizes and toppings, and set prices in just a few taps.',
  },
  {
    icon: 'chart-line',
    title: 'Track Your Performance',
    description:
      'Monitor your sales, see your most popular items, and gain valuable insights to help grow your business.',
  },
  {
    icon: 'store-cog-outline',
    title: 'Manage Your Restaurant',
    description:
      'Set your opening hours, update your location, and manage all your restaurant settings from one place.',
  },
];

interface RestaurantWalkthroughProps {
  visible: boolean;
  onFinish: () => void;
}

const RestaurantWalkthrough = ({
  visible,
  onFinish,
}: RestaurantWalkthroughProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === WALKTHROUGH_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onFinish();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = WALKTHROUGH_STEPS[currentStep];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onFinish}>
      <SafeAreaView style={styles.modalBackdrop}>
        <View style={styles.walkthroughContainer}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={currentStepData.icon}
              size={80}
              color={THEME.VIBRANT_RED}
            />
          </View>

          {/* Text Content */}
          <Text style={styles.title}>{currentStepData.title}</Text>
          <Text style={styles.description}>{currentStepData.description}</Text>

          {/* Progress Dots */}
          <View style={styles.dotsContainer}>
            {WALKTHROUGH_STEPS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentStep ? styles.activeDot : {},
                ]}
              />
            ))}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            {currentStep > 0 ? (
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flex: 1 }} /> // Spacer
            )}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {isLastStep ? "Get Started" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  walkthroughContainer: {
    backgroundColor: THEME.CREAM_WHITE,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  iconContainer: {
    backgroundColor: THEME.LIGHT_GRAY,
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: THEME.VIBRANT_RED,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: THEME.MEDIUM_GRAY,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.LIGHT_GRAY,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: THEME.VIBRANT_RED,
    width: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.MEDIUM_GRAY,
  },
  nextButton: {
    flex: 1,
    backgroundColor: THEME.VIBRANT_RED,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 10,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.CREAM_WHITE,
  },
});

export default RestaurantWalkthrough;
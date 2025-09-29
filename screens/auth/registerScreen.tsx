import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ProgressBar } from 'react-native-paper'; // 1. Import ProgressBar
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

// ... (interface and TOTAL_STEPS remain the same)
interface ProfileData {
  firstName: string;
  gender: 'Woman' | 'Man' | '';
  showGender: boolean;
  lookingFor: string;
  interests: string[];
  loveLanguages: string[];
  education: string[];
}

const TOTAL_STEPS = 4;


const ProfileSetupScreen = ({ navigation }: { navigation: any }) => {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    gender: '',
    showGender: false,
    lookingFor: '',
    interests: [],
    loveLanguages: [],
    education: [],
  });

  // ... (all handler functions like handleNext, handleBack, toggleSelection remain the same)
    const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      // Onboarding complete, navigate to the main app
      // Here you would typically save the profile data and log the user in
      navigation.navigate('MainApp'); 
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };
  
  const toggleSelection = (category: keyof ProfileData, value: string) => {
    setProfileData(prev => {
      const list = (prev[category] as string[]) || [];
      const index = list.indexOf(value);
      if (index === -1) {
        return { ...prev, [category]: [...list, value] };
      }
      return { ...prev, [category]: list.filter(item => item !== value) };
    });
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return profileData.firstName.trim() === '';
      case 2:
        return profileData.gender === '';
      case 3:
        return profileData.lookingFor === '';
      default:
        return false;
    }
  };


  // ... (all renderStep functions remain the same)
    const renderStep1 = () => (
    <>
      <Text style={styles.title}>What's your first name?</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#555"
        value={profileData.firstName}
        onChangeText={(text) => setProfileData({ ...profileData, firstName: text })}
      />
      <Text style={styles.subtitle}>
        This is how it'll appear on your profile. Can't change it later.
      </Text>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.title}>What's your gender?</Text>
      <TouchableOpacity
        style={[styles.optionButton, profileData.gender === 'Woman' && styles.optionButtonSelected]}
        onPress={() => setProfileData({ ...profileData, gender: 'Woman' })}
      >
        <Text style={styles.optionButtonText}>Woman</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.optionButton, profileData.gender === 'Man' && styles.optionButtonSelected]}
        onPress={() => setProfileData({ ...profileData, gender: 'Man' })}
      >
        <Text style={styles.optionButtonText}>Man</Text>
      </TouchableOpacity>
      <BouncyCheckbox
        style={{ marginTop: 30, alignSelf: 'flex-start' }}
        text="Show my gender on my profile"
        isChecked={profileData.showGender}
        onPress={(isChecked: boolean) => setProfileData({ ...profileData, showGender: isChecked })}
        fillColor="#FF6B6B"
        //unfillColor="#1F1F1F"
        textStyle={styles.checkboxText}
        iconStyle={{ borderColor: '#555' }}
        innerIconStyle={{ borderWidth: 2 }}
      />
    </>
  );

  const renderStep3 = () => {
    const options = [
      { emoji: '😍', text: 'Long-term partner' },
      { emoji: '🥰', text: 'Long-term, open to short' },
      { emoji: '🥂', text: 'Short-term, open to long' },
      { emoji: '🎉', text: 'Short-term fun' },
      { emoji: '👋', text: 'New friends' },
      { emoji: '🤔', text: 'Still figuring it out' },
    ];
    return (
      <>
        <Text style={styles.title}>What are you looking for?</Text>
        <Text style={styles.subtitle}>All good if it changes. There's something for everyone.</Text>
        <View style={styles.gridContainer}>
          {options.map(option => (
            <TouchableOpacity
              key={option.text}
              style={[
                styles.gridItem,
                profileData.lookingFor === option.text && styles.gridItemSelected
              ]}
              onPress={() => setProfileData({ ...profileData, lookingFor: option.text })}
            >
              <Text style={styles.gridEmoji}>{option.emoji}</Text>
              <Text style={styles.gridText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  };

  const renderStep4 = () => {
    const interests = ['Big time texter', 'Phone caller', 'Video chatter', 'Bad texter', 'Better in person'];
    const loveLanguages = ['Thoughtful gestures', 'Presents', 'Touch', 'Compliments', 'Time together'];
    const education = ['Bachelors', 'In College', 'High School', 'PhD', 'In Grad School', 'Masters', 'Trade School'];
    return (
      // Using a ScrollView here is a key part of making the layout responsive for smaller screens
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What else makes you-you?</Text>
        <Text style={styles.subtitle}>Don't hold back. Authenticity attracts authenticity.</Text>
        
        <Text style={styles.sectionTitle}>How do you text?</Text>
        <View style={styles.tagContainer}>
            {interests.map(item => (
                <TouchableOpacity key={item} style={[styles.tag, profileData.interests.includes(item) && styles.tagSelected]} onPress={() => toggleSelection('interests', item)}>
                    <Text style={styles.tagText}>{item}</Text>
                </TouchableOpacity>
            ))}
        </View>

        <Text style={styles.sectionTitle}>How do you receive love?</Text>
            <View style={styles.tagContainer}>
            {loveLanguages.map(item => (
                <TouchableOpacity key={item} style={[styles.tag, profileData.loveLanguages.includes(item) && styles.tagSelected]} onPress={() => toggleSelection('loveLanguages', item)}>
                    <Text style={styles.tagText}>{item}</Text>
                </TouchableOpacity>
            ))}
        </View>

        <Text style={styles.sectionTitle}>What is your education level?</Text>
            <View style={styles.tagContainer}>
            {education.map(item => (
                <TouchableOpacity key={item} style={[styles.tag, profileData.education.includes(item) && styles.tagSelected]} onPress={() => toggleSelection('education', item)}>
                    <Text style={styles.tagText}>{item}</Text>
                </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    );
  };

  const renderContent = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 2. Add the ProgressBar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back" size={28} color="#121212" />
        </TouchableOpacity>
        {step === 4 && <TouchableOpacity><Text style={styles.skipText}>Skip</Text></TouchableOpacity>}
      </View>
      
      <ProgressBar 
        progress={step / TOTAL_STEPS} 
        color="#FF6B6B" 
        style={styles.progressBar}
      />
      
      {/* 3. Wrap content in KeyboardAvoidingView for responsiveness */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.contentContainer}
      >
        <View style={styles.content}>
          {renderContent()}
        </View>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleNext} disabled={isNextDisabled()}>
          <LinearGradient
            colors={isNextDisabled() ? ['#555', '#333'] : ['#FF7A8A', '#FF556B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>
                {step === TOTAL_STEPS ? 'Finish' : step > 2 ? `Next ${step - 1}/${TOTAL_STEPS - 1}`: 'Next'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 45,
  },
  progressBar: {
    marginHorizontal: 20,
    marginTop: 15,
    height: 6,
    borderRadius: 3,
  },
  // 4. Use flex properties for adaptive layout
  contentContainer: {
    flex: 1, 
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  // ... (all other styles remain the same)
  skipText: {
      color: '#aaa',
      fontSize: 16,
      fontWeight: '600'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 30,
  },
  input: {
    color: '#121212',
    fontSize: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    paddingVertical: 10,
    marginBottom: 10,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 30,
    padding: 18,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionButtonSelected: {
    borderColor: '#121212',
    borderWidth: 2,
  },
  optionButtonText: {
    color: '#121212',
    fontSize: 18,
    fontWeight: '600',
  },
  checkboxText: {
      color: '#121212',
      textDecorationLine: 'none',
  },
  gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
  },
  gridItem: {
      width: '48%',
      aspectRatio: 1,
      backgroundColor: '#1F1F1F',
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
      padding: 10,
  },
  gridItemSelected: {
      borderWidth: 2,
      borderColor: '#121212',
  },
  gridEmoji: {
      fontSize: 30,
  },
  gridText: {
      color: '#121212',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
      marginTop: 10,
  },
  sectionTitle: {
      color: '#121212',
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 15,
  },
  tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
  },
  tag: {
      borderColor: '#555',
      borderWidth: 1,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 15,
      marginRight: 10,
      marginBottom: 10,
  },
  tagSelected: {
      backgroundColor: '#FF6B6B',
      borderColor: '#FF6B6B',
  },
  tagText: {
      color: '#121212',
      fontSize: 14,
  },
  nextButton: {
    width: 250,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#121212',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileSetupScreen;
// FILE: src/screens/ContactSupportScreen.js

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Appbar} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {THEME} from '../../theme';
import {useCustomAlert} from '../../../components/customAlert';

const ContactSupportScreen = ({navigation}) => {
  const [topic, setTopic] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {showAlert} = useCustomAlert();

  const handleChooseFile = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Could not select image.');
        return;
      }
      if (response.assets && response.assets[0]) {
        setAttachment(response.assets[0]);
      }
    });
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      showAlert('error', 'Message is empty!', 'Please describe your issue.');
      return;
    }

    setIsLoading(true);
    // --- MOCK API CALL ---
    // In a real app, you would dispatch an action here that sends the
    // topic, message, and attachment to your support backend/email service.
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);

    showAlert(
      'success',
      'Message Sent!',
      'Our team will get back to you shortly.',
    );
    navigation.goBack();
  };

  return (
    <View style={styles.pageContainer}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={THEME.CREAM_WHITE}
        />
        <Appbar.Content
          title="Contact Support"
          titleStyle={styles.appbarTitle}
        />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formHeader}>
          <MaterialCommunityIcons
            name="email-fast-outline"
            size={48}
            color={THEME.VIBRANT_RED}
          />
          <Text style={styles.formTitle}>Get in Touch</Text>
          <Text style={styles.formSubtitle}>
            Fill out the form below and our team will assist you as soon as
            possible
          </Text>
        </View>

        {/* This would ideally be a custom modal picker like in other screens */}
        <Text style={styles.inputLabel}>Topic</Text>
        <TextInput value={topic} style={styles.input} editable={false} />

        <Text style={styles.inputLabel}>How can we help?</Text>
        <TextInput
          placeholder="Describe your issue in detail..."
          placeholderTextColor={THEME.MEDIUM_GRAY}
          value={message}
          onChangeText={setMessage}
          style={[styles.input, {height: 150, textAlignVertical: 'top'}]}
          multiline
        />

        <Text style={styles.inputLabel}>Attachment (Optional)</Text>
        <TouchableOpacity
          style={styles.attachmentButton}
          onPress={handleChooseFile}>
          <MaterialCommunityIcons
            name="paperclip"
            size={22}
            color={THEME.DARK_CHARCOAL}
          />
          <Text style={styles.attachmentButtonText}>
            {attachment ? attachment.fileName : 'Attach a screenshot'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={THEME.DARK_CHARCOAL} />
          ) : (
            <Text style={styles.submitButtonText}>Send Message</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
// A combined stylesheet for reference. Place relevant parts in each file.
const styles = StyleSheet.create({
  // --- Global & Page Structure ---
  pageContainer: {flex: 1, backgroundColor: THEME.CREAM_WHITE},
  appbar: {backgroundColor: THEME.DARK_CHARCOAL, elevation: 0},
  appbarTitle: {color: THEME.CREAM_WHITE, fontWeight: '800', fontSize: 20},
  scrollContainer: {padding: 24, paddingBottom: 50},
  formHeader: {alignItems: 'center', marginBottom: 30},
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
    marginTop: 15,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 16,
    color: THEME.MEDIUM_GRAY,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },

  // --- Help Center (FAQ) Styles ---
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.LIGHT_GRAY,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {marginRight: 10},
  searchInput: {flex: 1, height: 50, fontSize: 16, color: THEME.DARK_CHARCOAL},
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
    marginTop: 20,
    marginBottom: 10,
  },
  faqItemContainer: {
    backgroundColor: THEME.CARD_BACKGROUND,
    borderRadius: 16,
    marginBottom: 10,
    padding: 16,
    overflow: 'hidden',
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: THEME.DARK_CHARCOAL,
    marginRight: 10,
  },
  faqAnswerContainer: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: THEME.LIGHT_GRAY,
    marginTop: 15,
  },
  faqAnswerText: {fontSize: 15, color: THEME.MEDIUM_GRAY, lineHeight: 22},
  ctaCard: {
    backgroundColor: THEME.VIBRANT_RED,
    borderRadius: 20,
    marginTop: 30,
    elevation: 6,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.CREAM_WHITE,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 15,
    color: `${THEME.CREAM_WHITE}99`,
    textAlign: 'center',
    marginTop: 5,
  },
  ctaButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    alignSelf: 'center',
    paddingHorizontal: 30,
    marginTop: 15,
  },
  ctaButtonText: {color: THEME.CREAM_WHITE, fontWeight: 'bold', fontSize: 16},

  // --- Contact Support Styles ---
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.DARK_CHARCOAL,
    marginBottom: 8,
  },
  input: {
    backgroundColor: THEME.LIGHT_GRAY,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: THEME.DARK_CHARCOAL,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.LIGHT_GRAY,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  attachmentButtonText: {
    color: THEME.DARK_CHARCOAL,
    marginLeft: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: THEME.BOLD_YELLOW,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
  },
});

export default ContactSupportScreen;

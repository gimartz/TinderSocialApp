// FILE: src/screens/HelpCenterScreen.js

import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {Appbar, Card} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {THEME} from '../../theme';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Mock FAQ Data ---
const FAQS = [
  {
    category: 'General',
    questions: [
      {
        id: 'g1',
        question: 'How do I update my restaurant profile?',
        answer:
          'You can update your profile, including name, description, and logo, from the main Settings screen under "Restaurant Information".',
      },
      {
        id: 'g2',
        question: 'How can I change my store hours?',
        answer:
          'Store operating hours can be adjusted in the "Restaurant Information" section within the Settings menu.',
      },
    ],
  },
  {
    category: 'Payments & Earnings',
    questions: [
      {
        id: 'p1',
        question: 'When do I get paid?',
        answer:
          'Payouts are processed weekly every Monday. You can view your balance and transaction history in the "Earnings" screen.',
      },
      {
        id: 'p2',
        question: 'How do I update my bank information?',
        answer:
          'Your payout information can be managed from the "Payout & Wallet" section in the Settings screen.',
      },
    ],
  },
];

// --- Reusable FAQ Item Component ---
const FaqItem = ({question, answer, isExpanded, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.faqItemContainer}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.faqQuestionRow}>
        <Text style={styles.faqQuestionText}>{question}</Text>
        <MaterialCommunityIcons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={THEME.VIBRANT_RED}
        />
      </View>
      {isExpanded && (
        <View style={styles.faqAnswerContainer}>
          <Text style={styles.faqAnswerText}>{answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const HelpCenterScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQS;

    const lowercasedQuery = searchQuery.toLowerCase();
    return FAQS.map(section => ({
      ...section,
      questions: section.questions.filter(
        item =>
          item.question.toLowerCase().includes(lowercasedQuery) ||
          item.answer.toLowerCase().includes(lowercasedQuery),
      ),
    })).filter(section => section.questions.length > 0);
  }, [searchQuery]);

  const toggleExpand = id => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.pageContainer}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={THEME.CREAM_WHITE}
        />
        <Appbar.Content title="Help Center" titleStyle={styles.appbarTitle} />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formHeader}>
          <MaterialCommunityIcons
            name="help-circle-outline"
            size={48}
            color={THEME.VIBRANT_RED}
          />
          <Text style={styles.formTitle}>How can we help?</Text>
        </View>

        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color={THEME.MEDIUM_GRAY}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search for answers..."
            placeholderTextColor={THEME.MEDIUM_GRAY}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {filteredFaqs.map(section => (
          <View key={section.category}>
            <Text style={styles.sectionHeader}>{section.category}</Text>
            {section.questions.map(item => (
              <FaqItem
                key={item.id}
                question={item.question}
                answer={item.answer}
                isExpanded={expandedId === item.id}
                onPress={() => toggleExpand(item.id)}
              />
            ))}
          </View>
        ))}

        <Card style={styles.ctaCard}>
          <Card.Content>
            <Text style={styles.ctaTitle}>Can't find an answer?</Text>
            <Text style={styles.ctaSubtitle}>
              Our support team is here to help you.
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('support')}>
              <Text style={styles.ctaButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
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
export default HelpCenterScreen;

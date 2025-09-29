import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Changed to MaterialIcons
import {useNavigation} from '@react-navigation/native';

// Restaurant-themed colors
const RESTAURANT_THEME = {
  primary: '#FF6B35', // Warm orange - common in food/restaurant branding
  secondary: '#2EC4B6', // Teal accent
  success: '#4BB543', // Green for success
  background: '#FFF8F0', // Warm off-white background
  card: '#FFFFFF',
  text: '#2D2D2D',
  textLight: '#666666',
  accent: '#FF9F1C', // Golden yellow accent
};

const WithdrawalSuccessScreen = ({route}: any) => {
  const navigation: any = useNavigation();
  const {amount, accountName, bankName} = route.params;

  const handleGoHome = () => {
    navigation.replace('MainApp', {screen: 'Dashboard'});
  };

  const formatAmount = (value: string | number) => {
    return typeof value === 'string'
      ? parseFloat(value).toLocaleString('en-NG', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : value.toLocaleString('en-NG', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <Icon
            name="check-circle"
            size={80}
            color={RESTAURANT_THEME.success}
          />
        </View>

        {/* Success Message */}
        <Text style={styles.successTitle}>Withdrawal Successful!</Text>
        <Text style={styles.successSubtitle}>
          Your funds are on the way to your bank account
        </Text>

        {/* Transaction Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon
                name="attach-money"
                size={18}
                color={RESTAURANT_THEME.primary}
              />
            </View>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>₦{formatAmount(amount)}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon name="person" size={18} color={RESTAURANT_THEME.primary} />
            </View>
            <Text style={styles.detailLabel}>Account Name:</Text>
            <Text style={styles.detailValue}>{accountName}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon
                name="account-balance"
                size={18}
                color={RESTAURANT_THEME.primary}
              />
            </View>
            <Text style={styles.detailLabel}>Bank:</Text>
            <Text style={styles.detailValue}>{bankName}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon
                name="verified"
                size={18}
                color={RESTAURANT_THEME.success}
              />
            </View>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, styles.statusSuccessful]}>
              Successful
            </Text>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.noteContainer}>
          <Icon
            name="access-time"
            size={16}
            color={RESTAURANT_THEME.textLight}
          />
          <Text style={styles.note}>
            Funds will reflect in your account within minutes
          </Text>
        </View>

        {/* Done Button */}
        <TouchableOpacity style={styles.doneButton} onPress={handleGoHome}>
          <Icon
            name="home"
            size={20}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
          <Text style={styles.doneButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RESTAURANT_THEME.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: RESTAURANT_THEME.primary,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'System', // Consider using a custom font like 'Poppins-Bold'
  },
  successSubtitle: {
    fontSize: 16,
    color: RESTAURANT_THEME.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  detailsCard: {
    backgroundColor: RESTAURANT_THEME.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  detailIconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: RESTAURANT_THEME.textLight,
    flex: 1,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: RESTAURANT_THEME.text,
    flex: 1,
    textAlign: 'right',
  },
  statusSuccessful: {
    color: RESTAURANT_THEME.success,
    fontWeight: 'bold',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    padding: 12,
    backgroundColor: 'rgba(46, 196, 182, 0.1)', // Light teal background
    borderRadius: 8,
  },
  note: {
    color: RESTAURANT_THEME.textLight,
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  doneButton: {
    backgroundColor: RESTAURANT_THEME.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WithdrawalSuccessScreen;

// src/screens/AddBankAccountScreen.tsx
import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  Button,
  TextInput,
  Text,
  ActivityIndicator,
  Card,
  Title,
  Paragraph,
  Appbar,
  Modal,
  Portal,
  Searchbar,
  TouchableRipple,
  Divider,
} from 'react-native-paper';
import {
  fetchBankList,
  verifyBankAccount,
  clearPaymentsErrors,
  clearVerificationResult,
} from '../../../../../src/store/features/banks';
import {goBack, navigate} from '../../../../../ref';
import {useCustomAlert} from '../../../../../components/customAlert';
import {AppDispatch, RootState} from '../../../../../src/store';

// Define your restaurant theme colors
const RESTAURANT_THEME = {
  PRIMARY: '#FF6B35', // Vibrant orange/red - common restaurant color
  SECONDARY: '#2E7D32', // Success green
  BACKGROUND: '#FFFDF7', // Warm cream white
  CARD_BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#2C2C2C', // Dark charcoal
  TEXT_SECONDARY: '#6E6E73', // Medium gray
  BORDER: '#E0E0E0',
  SUCCESS: '#4CAF50',
  ERROR: '#F44336',
  WARNING: '#FF9800',
};

type BankDetails = {
  name: string;
  code: string;
};

const AddBankAccountScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {showAlert} = useCustomAlert();

  // --- Redux State ---
  const {loadingBanks, isVerifying, errorVerification} = useSelector(
    (state: RootState) => state.banks,
  );

  // --- Local Component State ---
  const [bankList, setBankList] = useState([]);
  const [verificationResult, setverificationResult] = useState<null | {
    account_name: string;
  }>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState<null | BankDetails>(null);
  const [verified, setverified] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Fetch bank list on mount ---
  useEffect(() => {
    dispatch(clearPaymentsErrors());
    dispatch(clearVerificationResult());

    const fetchAndSetBanks = async () => {
      const resultAction = await dispatch(fetchBankList());
      if (fetchBankList.fulfilled.match(resultAction)) {
        // console.log(resultAction.payload);
        const fetchedBanks = resultAction.payload || [];
        setBankList(fetchedBanks);
      } else {
        showAlert('error', 'Error', 'Could not fetch bank list.');
      }
    };

    fetchAndSetBanks();

    return () => {
      dispatch(clearVerificationResult());
    };
  }, [dispatch, showAlert]);

  // --- Handle verification errors ---
  useEffect(() => {
    if (errorVerification) {
      showAlert('error', 'Verification Failed', errorVerification);
    }
  }, [errorVerification, showAlert]);

  // --- Memoized search results for performance ---
  const filteredBankList: BankDetails[] = useMemo(
    () =>
      bankList?.filter((bank: BankDetails) =>
        bank?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()),
      ),
    [bankList, searchQuery],
  );

  // --- User Actions ---
  const handleVerifyAccount = async () => {
    if (!selectedBank || !accountNumber.trim()) {
      showAlert(
        'error',
        'Missing Information',
        'Please select a bank and enter an account number.',
      );
      return;
    }
    const resultAction = await dispatch(
      verifyBankAccount({
        accountNumber,
        bankCode: selectedBank?.code,
        entityType: 'restaurant',
      }),
    );
    if (verifyBankAccount.fulfilled.match(resultAction)) {
      const verifyData = resultAction.payload.data;
      setverified(true);
      setverificationResult(verifyData.data);
    }
  };

  const handleProceed = () => {
    navigate('WithdrawalRequests', {
      banks: verificationResult,
      name: selectedBank?.name,
      code: selectedBank?.code,
    });
  };

  const handleSelectBank = (bank: BankDetails) => {
    setSelectedBank(bank);
    setIsPickerVisible(false);
    setSearchQuery('');
    if (verificationResult) {
      dispatch(clearVerificationResult());
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={RESTAURANT_THEME.BACKGROUND}
      />
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction
          onPress={() => goBack()}
          color={RESTAURANT_THEME.TEXT_PRIMARY}
        />
        <Appbar.Content
          title="Add Bank Account"
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Verify Bank Account</Title>

            {/* --- Custom Bank Picker Input --- */}
            <Paragraph style={styles.label}>Bank</Paragraph>
            <TouchableRipple
              onPress={() => setIsPickerVisible(true)}
              style={styles.pickerInput}
              rippleColor={RESTAURANT_THEME.PRIMARY + '20'}>
              <Text
                style={
                  selectedBank ? styles.pickerText : styles.pickerPlaceholder
                }>
                {selectedBank ? selectedBank.name : 'Select a bank'}
              </Text>
            </TouchableRipple>

            {/* --- Account Number Input --- */}
            <TextInput
              label="Account Number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              disabled={verified}
              outlineColor={RESTAURANT_THEME.BORDER}
              activeOutlineColor={RESTAURANT_THEME.PRIMARY}
              theme={{
                colors: {
                  primary: RESTAURANT_THEME.PRIMARY,
                  placeholder: RESTAURANT_THEME.TEXT_SECONDARY,
                  text: RESTAURANT_THEME.TEXT_PRIMARY, // This ensures dark text
                  onSurface: RESTAURANT_THEME.TEXT_PRIMARY, // Important for text color
                },
              }}
            />

            {/* --- Verified Account Name Display --- */}
            {verified && (
              <Card style={styles.verifiedCard} elevation={2}>
                <Card.Title
                  title={verificationResult?.account_name}
                  subtitle="Account Name Verified"
                  titleStyle={styles.verifiedTitle}
                  subtitleStyle={styles.verifiedSubtitle}
                  left={props => (
                    <Appbar.Action
                      {...props}
                      icon="check-circle"
                      color={RESTAURANT_THEME.SUCCESS}
                    />
                  )}
                />
              </Card>
            )}

            {/* --- Dynamic Action Button --- */}
            <Button
              mode="contained"
              onPress={verified ? handleProceed : handleVerifyAccount}
              style={styles.button}
              loading={isVerifying}
              disabled={isVerifying}
              icon={verified ? 'arrow-right-circle' : 'shield-check'}
              theme={{
                colors: {
                  primary: RESTAURANT_THEME.PRIMARY,
                },
              }}>
              {isVerifying
                ? 'Verifying...'
                : verified
                ? 'Continue'
                : 'Verify Account'}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* --- Bank Picker Modal --- */}
      <Portal>
        <Modal
          visible={isPickerVisible}
          onDismiss={() => setIsPickerVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          <Searchbar
            placeholder="Search for a bank..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            iconColor={RESTAURANT_THEME.PRIMARY}
            theme={{
              colors: {
                primary: RESTAURANT_THEME.PRIMARY,
                text: RESTAURANT_THEME.TEXT_PRIMARY,
                placeholder: RESTAURANT_THEME.TEXT_SECONDARY,
              },
            }}
          />
          {loadingBanks ? (
            <ActivityIndicator
              style={styles.modalLoader}
              color={RESTAURANT_THEME.PRIMARY}
            />
          ) : (
            <FlatList
              data={filteredBankList}
              keyExtractor={item => item.code}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => handleSelectBank(item)}
                  style={styles.bankItemContainer}>
                  <Text style={styles.bankItem}>{item.name}</Text>
                  <Divider style={styles.divider} />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyListText}>No banks found.</Text>
              }
            />
          )}
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RESTAURANT_THEME.BACKGROUND,
  },
  header: {
    backgroundColor: RESTAURANT_THEME.BACKGROUND,
    elevation: 0,
  },
  headerTitle: {
    color: RESTAURANT_THEME.TEXT_PRIMARY,
    fontWeight: 'bold',
    fontSize: 18,
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: RESTAURANT_THEME.CARD_BACKGROUND,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    color: RESTAURANT_THEME.TEXT_PRIMARY,
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: RESTAURANT_THEME.TEXT_SECONDARY,
    fontWeight: '500',
  },
  input: {
    marginTop: 16,
    backgroundColor: RESTAURANT_THEME.CARD_BACKGROUND,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pickerInput: {
    borderWidth: 1,
    borderColor: RESTAURANT_THEME.BORDER,
    borderRadius: 8,
    padding: 16,
    backgroundColor: RESTAURANT_THEME.CARD_BACKGROUND,
  },
  pickerText: {
    fontSize: 16,
    color: RESTAURANT_THEME.TEXT_PRIMARY,
  },
  pickerPlaceholder: {
    fontSize: 16,
    color: RESTAURANT_THEME.TEXT_SECONDARY,
  },
  verifiedCard: {
    backgroundColor: '#E8F5E9',
    marginTop: 20,
    borderRadius: 8,
  },
  verifiedTitle: {
    color: RESTAURANT_THEME.SUCCESS,
    fontWeight: 'bold',
    fontSize: 16,
  },
  verifiedSubtitle: {
    color: RESTAURANT_THEME.TEXT_SECONDARY,
    fontSize: 14,
  },
  // Modal Styles
  modalContainer: {
    backgroundColor: RESTAURANT_THEME.CARD_BACKGROUND,
    margin: 20,
    borderRadius: 12,
    padding: 16,
    height: '80%',
  },
  searchbar: {
    marginBottom: 16,
    backgroundColor: RESTAURANT_THEME.BACKGROUND,
    borderRadius: 8,
  },
  modalLoader: {
    marginVertical: 20,
  },
  bankItemContainer: {
    paddingVertical: 12,
  },
  bankItem: {
    fontSize: 16,
    color: RESTAURANT_THEME.TEXT_PRIMARY,
    paddingHorizontal: 8,
  },
  divider: {
    backgroundColor: RESTAURANT_THEME.BORDER,
    marginTop: 8,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    color: RESTAURANT_THEME.TEXT_SECONDARY,
  },
});

export default AddBankAccountScreen;

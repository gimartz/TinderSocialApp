import React, {useEffect, useCallback, useState, useLayoutEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchWithdrawalRequests,
  createWithdrawalRequest,
} from '../../../../../src/store/features/banks';
import {
  Card,
  TextInput,
  Button,
  Title,
  Paragraph,
  ActivityIndicator,
  Text,
  HelperText,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppDispatch, RootState} from '../../../../../src/store';
import {useCustomAlert} from '../../../../../components/customAlert';
import {TransactionsResponse} from '../../../../../src/store/features/wallet';
import {useNavigation} from '@react-navigation/native';

// Types
interface WithdrawalRequest {
  id: string;
  amount: number;
  currency?: string;
  status: string;
  account_name: string;
  account_number: string;
  createdAt?: string;
  date?: string;
}

interface WithdrawalRequestsScreenProps {
  route: {
    params?: {
      banks?: any;
      name?: string;
      code?: string;
    };
  };
}

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- A more professional and pleasing color palette ---
const COLORS = {
  primary: '#FFC107',
  background: '#F0F2F5',
  card: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#6E6E73',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  border: '#E0E0E0',
};

// Sub-components for better separation of concerns
const StatusBadge: React.FC<{status: string}> = ({status}) => {
  const statusLower = status.toLowerCase();
  let backgroundColor = COLORS.textSecondary;

  if (statusLower === 'completed' || statusLower === 'successful')
    backgroundColor = COLORS.success;
  if (statusLower === 'pending') backgroundColor = COLORS.warning;
  if (statusLower === 'failed' || statusLower === 'cancelled')
    backgroundColor = COLORS.error;

  return (
    <View style={[styles.statusBadge, {backgroundColor}]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

const WithdrawalItem: React.FC<{item: WithdrawalRequest}> = ({item}) => (
  <Card style={styles.itemCard}>
    <Card.Content>
      <View style={styles.itemHeader}>
        <Title style={styles.itemAmount}>
          {item?.currency || 'N'}
          {Number(item?.amount).toFixed(2)}
        </Title>
        <StatusBadge status={item?.status} />
      </View>
      <Paragraph style={styles.itemMeta}>
        <MaterialCommunityIcons
          name="calendar-month"
          size={14}
          color={COLORS.textSecondary}
        />{' '}
        {new Date(
          item?.createdAt || item?.date || Date.now(),
        ).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Paragraph>
    </Card.Content>
  </Card>
);

const WithdrawalForm: React.FC<{
  selectedAccount: any;
  amount: string;
  amountError: string;
  isCreatingWithdrawal: boolean;
  onAmountChange: (text: string) => void;
  onCreateWithdrawal: () => void;
}> = ({
  selectedAccount,
  amount,
  amountError,
  isCreatingWithdrawal,
  onAmountChange,
  onCreateWithdrawal,
}) => (
  <Card style={styles.formCard}>
    <Card.Title
      title="New Withdrawal"
      titleStyle={styles.cardTitle}
      left={props => (
        <MaterialCommunityIcons
          {...props}
          name="cash-plus"
          size={24}
          color={COLORS.primary}
        />
      )}
    />
    <Card.Content>
      {selectedAccount ? (
        <>
          <Paragraph style={styles.bankInfoText}>
            To: {selectedAccount?.account_name}
          </Paragraph>
          <Paragraph style={styles.bankInfoText}>
            Account: ****{selectedAccount?.account_number?.slice(-4)}
          </Paragraph>
        </>
      ) : (
        <Paragraph style={styles.bankInfoText}>
          No bank account configured.
        </Paragraph>
      )}

      <TextInput
        style={styles.input}
        label="Amount"
        value={amount}
        onChangeText={onAmountChange}
        keyboardType="numeric"
        mode="outlined"
        activeOutlineColor={COLORS.primary}
        error={!!amountError}
        left={<TextInput.Icon icon="currency-ngn" />}
      />
      <HelperText type="error" visible={!!amountError}>
        {amountError}
      </HelperText>

      <Button
        mode="contained"
        onPress={onCreateWithdrawal}
        loading={isCreatingWithdrawal}
        disabled={isCreatingWithdrawal || !selectedAccount}
        icon="send"
        style={styles.button}
        labelStyle={styles.buttonLabel}>
        {isCreatingWithdrawal ? 'Processing...' : 'Request Withdrawal'}
      </Button>
    </Card.Content>
  </Card>
);

const EmptyState: React.FC<{loading: boolean}> = ({loading}) => {
  if (loading) return null;

  return (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="history"
        size={48}
        color={COLORS.textSecondary}
      />
      <Text style={styles.emptyText}>No withdrawal requests yet.</Text>
    </View>
  );
};

const WithdrawalRequestsScreen: React.FC<WithdrawalRequestsScreenProps> = ({
  route,
}) => {
  // Use a more descriptive name for the bank account from params
  const {banks, name, code} = route.params || {};
  // console.log('WithdrawalRequestsScreen params:', banks, name, code);
  const selectedAccount = banks || null;

  const dispatch = useDispatch<AppDispatch>();
  const navigate: any = useNavigation();
  const {showAlert} = useCustomAlert();

  // State from Redux
  const {
    withdrawalRequests,
    loadingWithdrawalRequests,
    errorWithdrawalRequests,
    createdWithdrawal,
    errorCreatingWithdrawal,
  } = useSelector((state: RootState) => state.banks);

  const [isCreatingWithdrawal, setIsCreatingWithdrawal] = useState(false);
  // Local component state
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const restaurant = useSelector((state: RootState) => state.auth?.userInfo);

  // console.log('Restaurant Info:', restaurant);
  // console.log('Withdrawal Requests:', withdrawalRequests);

  // --- Data Loading ---
  const loadRequests = useCallback(
    (isRefresh = false) => {
      dispatch(fetchWithdrawalRequests());
      if (isRefresh) {
        setIsRefreshing(false);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // --- Side Effects & User Feedback using Toasts ---
  // useEffect(() => {
  //   // Non-disruptive feedback for API calls
  //   if (createdWithdrawal) {
  //     var myHeaders = new Headers();
  //     myHeaders.append('Authorization', 'Bearer restaurant_jwt_token_here');
  //     myHeaders.append('Content-Type', 'application/json');

  //     var raw = JSON.stringify({
  //       isActive: true,
  //     });

  //     var requestOptions = {
  //       method: 'PUT',
  //       headers: myHeaders,
  //       body: raw,
  //       redirect: 'follow',
  //     };

  //     fetch(
  //       'https://speedit-server.onrender.com/v1/api/restaurants/status',
  //       requestOptions,
  //     )
  //       .then(response => response.text())
  //       .then(result => console.log(result))
  //       .catch(error => console.log('error', error));
  //     setAmount(''); // Clear input on success
  //     loadRequests(); // Refresh list
  //   }
  //   if (errorCreatingWithdrawal) {
  //     showAlert(
  //       'error',
  //       'Failed',
  //       errorCreatingWithdrawal || 'An error occurred',
  //     );
  //   }
  //   if (errorWithdrawalRequests) {
  //     showAlert(
  //       'error',
  //       'Loading Failed',
  //       errorWithdrawalRequests || 'Failed to load withdrawal requests',
  //     );
  //   }
  // }, [
  //   createdWithdrawal,
  //   errorCreatingWithdrawal,
  //   errorWithdrawalRequests,
  //   loadRequests,
  //   showAlert,
  // ]);

  // Animate list changes
  useLayoutEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [withdrawalRequests]);

  // --- User Actions ---
  const handleCreateWithdrawal = async () => {
    const numericAmount = parseFloat(amount);
    if (!amount.trim() || isNaN(numericAmount) || numericAmount <= 0) {
      setAmountError('Please enter a valid amount.');
      return;
    }
    if (!selectedAccount?.bank_id) {
      showAlert('error', 'Error', 'No bank account selected.');
      return;
    }

    setIsCreatingWithdrawal(true);
    try {
      const resultAction = await dispatch(
        createWithdrawalRequest({
          amount: numericAmount,
          bankCode: code ? code : '',
          accountNumber: selectedAccount.account_number,
          entityId: restaurant ? restaurant?.id : '',
        }),
      );

      if (createWithdrawalRequest.fulfilled.match(resultAction)) {
        // console.log('Withdrawal request created:', resultAction.payload);
        // console.log('Selceted Account:', selectedAccount);
        navigate.navigate('Settings', {
          screen: 'WithdrawalSuccess',
          params: {
            amount,
            accountName: selectedAccount.account_name,
            bankName: name,
          },
        });
        // Handle successful withdrawal creation
      } else {
        console.log('Withdrawal request failed:', resultAction);
        showAlert(
          'error',
          'Failed',
          errorCreatingWithdrawal || 'Failed to create withdrawal request',
        );
      }
    } catch (error) {
      console.log('Withdrawal request error:', error);
      showAlert('error', 'Failed', 'An unexpected error occurred');
    } finally {
      setIsCreatingWithdrawal(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadRequests(true);
  };

  const handleAmountChange = (text: string) => {
    setAmount(text);
    if (amountError) {
      setAmountError(''); // Clear error when user starts typing
    }
  };

  // Ensure we have an array of withdrawal requests
  const withdrawalRequestsData =
    // Array.isArray(withdrawalRequests)
    //   ? withdrawalRequests
    //   :
    (withdrawalRequests as TransactionsResponse)?.transactions || [];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={withdrawalRequestsData}
        renderItem={({item}) => <WithdrawalItem item={item} />}
        keyExtractor={item => item?.id?.toString()}
        ListHeaderComponent={
          <>
            <WithdrawalForm
              selectedAccount={selectedAccount}
              amount={amount}
              amountError={amountError}
              isCreatingWithdrawal={isCreatingWithdrawal}
              onAmountChange={handleAmountChange}
              onCreateWithdrawal={handleCreateWithdrawal}
            />

            {/* --- History Section --- */}
            <Title style={styles.historyTitle}>Withdrawal History</Title>
          </>
        }
        ListEmptyComponent={<EmptyState loading={loadingWithdrawalRequests} />}
        contentContainerStyle={styles.listContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={
              isRefreshing ||
              (loadingWithdrawalRequests && withdrawalRequestsData.length === 0)
            }
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContentContainer: {
    padding: 16,
  },
  // Form Styles
  formCard: {
    marginBottom: 24,
    backgroundColor: COLORS.card,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  bankInfoText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.card,
    marginTop: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.primary,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  // List Item Styles
  itemCard: {
    marginVertical: 8,
    backgroundColor: COLORS.card,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  itemMeta: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default WithdrawalRequestsScreen;

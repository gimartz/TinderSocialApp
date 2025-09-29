import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
  SafeAreaView,
  StatusBar,
  // Image, // Uncomment if you have actual image assets
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Using MaterialIcons
import {useDispatch, useSelector} from 'react-redux';
// Ensure these actions exist and are correctly imported
import {
  fetchRestaurantWallet,
  fetchWalletTransactions,
  clearWalletErrors,
  WalletState,
  TransactionItem,
} from '../../../../../src/store/features/wallet';
import {TEXT_COLOR_PRIMARY} from '../../../../../src/constants/colorsConstant';
import {goBack} from '../../../../../ref';
import {AppDispatch, RootState} from '../../../../../src/store';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Define types for the component props
interface WalletDetailsScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const WalletDetailsScreen: React.FC<WalletDetailsScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Get wallet state from Redux with proper typing
  const {
    walletDetails,
    transactions,
    currentPage,
    totalPages,
    loadingWallet,
    errorWallet,
    loadingTransactions,
    errorTransactions,
  } = useSelector((state: RootState) => {
    const walletState = state.wallet as WalletState | undefined;
    return {
      walletDetails: walletState?.walletDetails || {
        data: {balance: 0, currency: '₦'},
      },
      transactions: walletState?.transactions || [],
      currentPage: walletState?.currentPage || 1,
      totalPages: walletState?.totalPages || 1,
      loadingWallet: walletState?.loadingWallet || false,
      errorWallet: walletState?.errorWallet || null,
      loadingTransactions: walletState?.loadingTransactions || false,
      errorTransactions: walletState?.errorTransactions || null,
    };
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadWalletData = useCallback(
    (isRefresh = false) => {
      dispatch(clearWalletErrors());
      dispatch(fetchRestaurantWallet());
      dispatch(fetchWalletTransactions({page: 1, limit: 10}));
      if (isRefresh) setIsRefreshing(false);
    },
    [dispatch],
  );

  useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  useEffect(() => {
    if (errorWallet) Alert.alert('Wallet Error', errorWallet);
    if (errorTransactions) Alert.alert('Transaction Error', errorTransactions);
  }, [errorWallet, errorTransactions]);

  // Function to handle loading more transactions
  const handleLoadMore = () => {
    if (
      !loadingTransactions &&
      currentPage &&
      totalPages &&
      currentPage < totalPages
    ) {
      dispatch(fetchWalletTransactions({page: currentPage + 1, limit: 10}));
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadWalletData(true);
  };

  const renderTransactionItem = ({item}: {item: TransactionItem}) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionTextPrimary}>
        Type: {item.type || 'N/A'}
      </Text>
      <Text style={styles.transactionTextSecondary}>
        Amount: {item.currency || '₦'}
        {item.amount}
      </Text>
      <Text style={styles.transactionTextSecondary}>
        Date:{' '}
        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
      </Text>
      <Text style={styles.transactionTextSecondary}>
        Status: {item.status || 'N/A'}
      </Text>
    </View>
  );

  const transactionData = transactions || []; // Ensure we have an array

  // Initial loading state for the whole screen content
  if (loadingWallet && !isRefreshing && !walletDetails?.data) {
    return (
      <SafeAreaView style={styles.fullScreenLoaderContainer}>
        <ActivityIndicator size="large" color="#00695C" />
      </SafeAreaView>
    );
  }

  const balanceValue =
    walletDetails?.balance || walletDetails?.data?.balance || 0;
  const currencySymbol = '₦';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f2f5" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={26} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={styles.powerButton} />
      </View>
      <View style={styles.walletBalanceCard}>
        <View>
          <Text style={styles.walletBalanceLabel}>Wallet Balance</Text>
          <Text style={styles.walletBalanceAmount}>
            {currencySymbol}
            {Number(balanceValue)?.toFixed(2) || '0.00'}
          </Text>
        </View>
        {/* Placeholder for money icons from image */}
        <View style={styles.moneyIconsArt}>
          <View style={[styles.moneyArt, styles.moneyArt1]} />
          <View style={[styles.moneyArt, styles.moneyArt2]} />
          <View style={[styles.moneyArt, styles.moneyArt3]} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.withdrawButton}
        onPress={() => navigation.navigate('bankDetails')}>
        <Text style={styles.withdrawButtonText}>Withdraw Money</Text>
      </TouchableOpacity>

      <View style={styles.transactionHistoryHeader}>
        <Text style={styles.transactionHistoryTitle}>Transaction History</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => Alert.alert('Filter Clicked')}>
          <Text style={styles.filterIcon}>☰</Text>
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {loadingTransactions && transactionData.length === 0 && !isRefreshing && (
        <ActivityIndicator color="#00695C" style={{marginTop: 20}} />
      )}
      {errorTransactions && transactionData.length === 0 && (
        <Text style={styles.errorText}>Error: {errorTransactions}</Text>
      )}

      <FlatList
        data={transactionData}
        renderItem={renderTransactionItem}
        keyExtractor={(item, index) => item.id || item._id || `trans-${index}`}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingTransactions && transactionData.length > 0 ? (
            <ActivityIndicator color="#00695C" style={{marginVertical: 10}} />
          ) : null
        }
        ListEmptyComponent={
          !loadingTransactions && transactionData.length === 0 ? (
            <View style={styles.noTransactionsContainer}>
              <View style={styles.noTransactionsIconArt}>
                <View
                  style={[
                    styles.moneyArt,
                    styles.moneyArt1,
                    styles.noTransMoneyArt,
                  ]}
                />
                <View
                  style={[
                    styles.moneyArt,
                    styles.moneyArt2,
                    styles.noTransMoneyArt,
                  ]}
                />
                <View
                  style={[
                    styles.moneyArt,
                    styles.moneyArt3,
                    styles.noTransMoneyArt,
                  ]}
                />
              </View>
              <Text style={styles.noTransactionsText}>No transactions yet</Text>
              <Text style={styles.noTransactionsSubText}>
                Your transactions will appear here
              </Text>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#00695C']}
            tintColor={'#00695C'}
          />
        }
        contentContainerStyle={
          transactionData.length === 0 ? styles.emptyListContentContainer : {}
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    paddingTop:30,
  },
  fullScreenLoaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  addMoneyHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 5,
  },
  addMoneyIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    marginRight: 8,
  },
  addMoneyHeaderText: {
    color: '#00695C',
    fontSize: 14,
    fontWeight: '500',
  },
  powerButton: {},
  walletBalanceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  walletBalanceLabel: {
    color: '#555',
    fontSize: 14,
    marginBottom: 4,
  },
  walletBalanceAmount: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
  },
  moneyIconsArt: {
    width: 60,
    height: 60,
    position: 'relative',
    marginTop: 5,
  },
  moneyArt: {
    backgroundColor: '#2E7D32',
    borderRadius: 3,
    position: 'absolute',
    width: 40,
    height: 15,
    opacity: 0.8,
  },
  moneyArt1: {
    transform: [{rotate: '-15deg'}],
    top: 0,
    right: 0,
  },
  moneyArt2: {
    transform: [{rotate: '10deg'}],
    top: 18,
    right: 10,
  },
  moneyArt3: {
    transform: [{rotate: '25deg'}],
    top: 36,
    right: 5,
  },
  withdrawButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  withdrawButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 30,
    marginBottom: 12,
  },
  transactionHistoryTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  filterIcon: {
    fontSize: 18,
    color: '#333',
    marginRight: 6,
  },
  filterButtonText: {
    color: '#333',
    fontSize: 15,
  },
  transactionItem: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginHorizontal: 16,
    borderRadius: 6,
    marginBottom: 8,
  },
  transactionTextPrimary: {
    fontSize: 15,
    color: 'black',
    fontWeight: '500',
  },
  transactionTextSecondary: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  noTransactionsContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f0f2f5',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT_COLOR_PRIMARY,
    textAlign: 'left',
  },
  noTransactionsIconArt: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    position: 'relative',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  noTransMoneyArt: {
    width: 50,
    height: 20,
  },
  noTransactionsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  noTransactionsSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  emptyListContentContainer: {
    flexGrow: 1,
  },
});

export default WalletDetailsScreen;

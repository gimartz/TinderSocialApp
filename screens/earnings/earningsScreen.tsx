// FILE: src/screens/EarningsScreen.js
// Add these imports at the top
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from 'date-fns';

import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {Appbar, Card} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {LineChart, BarChart} from 'react-native-chart-kit';
import {useDispatch, useSelector} from 'react-redux';

// Assuming a shared theme file exists at this path
import {THEME} from '../theme';

// Import your actual Redux actions and types
import {
  fetchRestaurantWallet,
  fetchWalletTransactions,
  TransactionItem,
  WalletDetails,
} from '../../src/store/features/wallet';

// Import new thunks for earnings and orders data
import {
  fetchTodaysSales,
  fetchTodaysOrders,
} from '../../src/store/features/orderSlice';

import {navigate} from '../../ref';
import {RootState, AppDispatch} from '../../src/store';
import apiClient from '../../src/store/service';
import {useCustomAlert} from '../../components/customAlert';

const screenWidth = Dimensions.get('window').width;

// --- Helper function to process transaction data for charts ---
const aggregateDataForChart = (
  transactions: TransactionItem[],
  timeRange: string,
) => {
  // Return empty state for the chart if no data
  if (!transactions || transactions.length === 0) {
    return {labels: [], datasets: [{data: []}]};
  }

  const dailyTotals = new Map();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter transactions to only include CREDITS (income) within the last 7 days
  const creditTransactions = transactions.filter(tx => {
    if (!tx.createdAt) return false;

    try {
      const txDate = new Date(tx.createdAt);
      txDate.setHours(0, 0, 0, 0);
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);

      // Only include CREDIT transactions (income)
      return tx.type?.toLowerCase() === 'credit' && txDate >= sevenDaysAgo;
    } catch (error) {
      console.error('Error parsing transaction date:', error);
      return false;
    }
  });

  // Initialize totals for the last 7 days to 0
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayKey = d.toISOString().split('T')[0];
    dailyTotals.set(dayKey, 0);
  }

  // Sum up CREDIT amounts for each day
  creditTransactions.forEach(tx => {
    if (!tx.createdAt) return;

    try {
      const txDate = new Date(tx.createdAt);
      const dayKey = txDate.toISOString().split('T')[0];
      if (dailyTotals.has(dayKey)) {
        // Convert amount string to number and add to daily total
        const amount =
          typeof tx.amount === 'string'
            ? parseFloat(tx.amount)
            : Number(tx.amount);

        if (!isNaN(amount)) {
          dailyTotals.set(dayKey, dailyTotals.get(dayKey) + amount);
        }
      }
    } catch (error) {
      console.error('Error processing transaction date:', error);
    }
  });

  // Format for chart kit - ensure all values are numbers
  const labels = Array.from(dailyTotals.keys())
    .map(dateString => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {weekday: 'short'});
      } catch (error) {
        return '';
      }
    })
    .filter(label => label !== '');

  const data = Array.from(dailyTotals.values()).map(value =>
    typeof value === 'number' ? value : 0,
  );

  // Debug log to see what data we're sending to the chart
  // console.log('Credit transactions for chart:', creditTransactions);
  // console.log('Chart data:', {labels, data});

  return {labels, datasets: [{data}]};
};

interface EarningsScreenProps {
  navigation: any;
}

// Function to calculate percentage change
const calculatePercentageChange = (
  current: number,
  previous: number,
): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

const EarningsScreen: React.FC<EarningsScreenProps> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [timeRange, setTimeRange] = useState('week');
  const [chartType, setChartType] = useState('bar');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [yesterdaySales, setYesterdaySales] = useState(0);
  const [yesterdayOrders, setYesterdayOrders] = useState(0);
  const [loadingComparison, setLoadingComparison] = useState(false);

  // Add these state variables
  const [thisWeekEarnings, setThisWeekEarnings] = useState(0);
  const [thisWeekOrders, setThisWeekOrders] = useState(0);
  const [loadingWeekData, setLoadingWeekData] = useState(false);

  const [lastWeekEarnings, setLastWeekEarnings] = useState(0);
  const [lastWeekOrders, setLastWeekOrders] = useState(0);
  const [loadingLastWeek, setLoadingLastWeek] = useState(false);

  const {showAlert} = useCustomAlert();

  // Add this function to fetch last week's data
  // const fetchLastWeekData = useCallback(async () => {
  //   try {
  //     setLoadingLastWeek(true);

  //     // Calculate date range for last week
  //     const now = new Date();
  //     const startOfLastWeek = startOfWeek(subDays(now, 7));
  //     const endOfLastWeek = endOfWeek(subDays(now, 7));

  //     const days = eachDayOfInterval({
  //       start: startOfLastWeek,
  //       end: endOfLastWeek,
  //     });

  //     let totalEarnings = 0;
  //     let totalOrders = 0;

  //     // Fetch data for each day of last week
  //     for (const day of days) {
  //       const dateStr = format(day, 'yyyy-MM-dd');
  //       try {
  //         const response = await apiClient.get(`/sales?date=${dateStr}`);
  //         if (response.data.success) {
  //           totalEarnings += response.data.data.totalSales || 0;
  //           totalOrders += response.data.data.totalOrders || 0;
  //         }
  //       } catch (error) {
  //         console.error(`Error fetching data for ${dateStr}:`, error);
  //       }
  //     }

  //     setLastWeekEarnings(totalEarnings);
  //     setLastWeekOrders(totalOrders);
  //   } catch (error) {
  //     console.error('Error fetching last week data:', error);
  //   } finally {
  //     setLoadingLastWeek(false);
  //   }
  // }, []);

  // Add this function to fetch week data
  const fetchWeekData = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      // Use your existing API endpoint for each day in the range
      // (We'll need to enhance the backend later for better performance)
      const days = eachDayOfInterval({
        start: new Date(startDate),
        end: new Date(endDate),
      });

      let totalEarnings = 0;
      let totalOrders = 0;

      for (const day of days) {
        const dateStr = format(day, 'yyyy-MM-dd');
        try {
          const response = await apiClient.get(`/sales?date=${dateStr}`);
          if (response.data.success) {
            totalEarnings += response.data.data.totalSales || 0;
            totalOrders += response.data.data.totalOrders || 0;
          }
        } catch (error) {
          console.error(`Error fetching data for ${dateStr}:`, error);
        }
      }

      return {totalEarnings, totalOrders};
    } catch (error) {
      console.error('Error fetching week data:', error);
      return {totalEarnings: 0, totalOrders: 0};
    }
  }, []);

  // Add this function to fetch both this week and last week data
  // const fetchWeeklyComparisonData = useCallback(async () => {
  //   try {
  //     setLoadingWeekData(true);

  //     const now = new Date();

  //     // This week (Monday to Sunday of current week)
  //     const startOfThisWeek = startOfWeek(now);
  //     const endOfThisWeek = endOfWeek(now);

  //     // Last week (Monday to Sunday of previous week)
  //     const startOfLastWeek = startOfWeek(subDays(now, 7));
  //     const endOfLastWeek = endOfWeek(subDays(now, 7));

  //     // Fetch data for both weeks
  //     const [thisWeekData, lastWeekData] = await Promise.all([
  //       fetchWeekData(startOfThisWeek, endOfThisWeek),
  //       fetchWeekData(startOfLastWeek, endOfLastWeek),
  //     ]);

  //     setThisWeekEarnings(thisWeekData.totalEarnings);
  //     setThisWeekOrders(thisWeekData.totalOrders);
  //     setLastWeekEarnings(lastWeekData.totalEarnings);
  //     setLastWeekOrders(lastWeekData.totalOrders);
  //   } catch (error) {
  //     console.error('Error fetching weekly comparison data:', error);
  //   } finally {
  //     setLoadingWeekData(false);
  //   }
  // }, [fetchWeekData]);

  // Add this function to fetch both this week and last week data
  const fetchWeeklyComparisonData = useCallback(async () => {
    try {
      setLoadingWeekData(true);

      const now = new Date();

      // This week (Monday to Sunday of current week)
      const startOfThisWeek = startOfWeek(now);
      const endOfThisWeek = endOfWeek(now);

      // Last week (Monday to Sunday of previous week)
      const startOfLastWeek = startOfWeek(subDays(now, 7));
      const endOfLastWeek = endOfWeek(subDays(now, 7));

      // Fetch data for both weeks
      const [thisWeekData, lastWeekData] = await Promise.all([
        fetchWeekData(startOfThisWeek, endOfThisWeek),
        fetchWeekData(startOfLastWeek, endOfLastWeek),
      ]);

      setThisWeekEarnings(thisWeekData.totalEarnings);
      setThisWeekOrders(thisWeekData.totalOrders);
      setLastWeekEarnings(lastWeekData.totalEarnings);
      setLastWeekOrders(lastWeekData.totalOrders);
    } catch (error) {
      console.error('Error fetching weekly comparison data:', error);
    } finally {
      setLoadingWeekData(false);
    }
  }, [fetchWeekData]);

  // --- Connecting to Redux Store ---
  const {
    walletDetails,
    transactions,
    loadingWallet,
    loadingTransactions,
    errorWallet,
    errorTransactions,
  } = useSelector((state: RootState) => state.wallet);

  // Get today's sales and orders from the orders slice
  const {amount: todaysSales, status: salesStatus} = useSelector(
    (state: RootState) => state.orders.todaysSales,
  );
  const {items: todaysOrders, status: ordersStatus} = useSelector(
    (state: RootState) => state.orders.todaysOrders,
  );

  // Calculate comparison percentages
  const earningsChange = useMemo(() => {
    return calculatePercentageChange(todaysSales || 0, yesterdaySales);
  }, [todaysSales, yesterdaySales]);

  const ordersChange = useMemo(() => {
    return calculatePercentageChange(
      todaysOrders?.length || 0,
      yesterdayOrders,
    );
  }, [todaysOrders, yesterdayOrders]);

  // --- Data Fetching and Feedback ---
  const fetchYesterdayData = useCallback(async () => {
    try {
      setLoadingComparison(true);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayFormatted = yesterday.toISOString().split('T')[0];

      // You'll need to create this API call in your service
      const response = await apiClient.get(`/sales?date=${yesterdayFormatted}`);

      if (response.data.success) {
        // console.log("I got response from yester's sale:", response.data);
        setYesterdaySales(response.data.data.totalSales || 0);
        setYesterdayOrders(response.data.data.totalOrders || 0);
      }
    } catch (error) {
      console.error('Error fetching yesterday data:', error);
    } finally {
      setLoadingComparison(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    Promise.all([
      dispatch(fetchRestaurantWallet()),
      dispatch(fetchWalletTransactions({limit: 15, page: 1})),
      dispatch(fetchTodaysSales()),
      dispatch(fetchTodaysOrders()),
      fetchYesterdayData(), // fetch yesterday's data
      fetchWeeklyComparisonData(), //
    ]).finally(() => setIsRefreshing(false));
  }, [dispatch, fetchYesterdayData, fetchWeeklyComparisonData]);

  useEffect(() => {
    dispatch(fetchRestaurantWallet());
    dispatch(fetchWalletTransactions({limit: 15, page: 1}));
    dispatch(fetchTodaysSales());
    dispatch(fetchTodaysOrders());
    fetchYesterdayData();
    fetchWeeklyComparisonData(); //
    // fetchLastWeekData(); // Fetch last week data
  }, [dispatch, fetchYesterdayData, fetchWeeklyComparisonData]);

  useEffect(() => {
    if (errorWallet) showAlert('error', 'Wallet Error', errorWallet);
    if (errorTransactions)
      showAlert('error', 'Transaction Error', errorTransactions);
  }, [errorWallet, errorTransactions]);

  // --- Data Processing for UI ---
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    // Add your time-based filtering logic here if needed
    return transactions;
  }, [transactions, timeRange]);

  // Use live data from API instead of calculating from transactions
  const {totalEarnings, totalOrders} = useMemo(() => {
    return {
      totalEarnings: todaysSales || 0,
      totalOrders: todaysOrders?.length || 0,
    };
  }, [todaysSales, todaysOrders]);

  const chartData = useMemo(
    () => aggregateDataForChart(filteredTransactions, timeRange),
    [filteredTransactions, timeRange],
  );

  const chartConfig = {
    backgroundGradientFrom: THEME.CARD_BACKGROUND,
    backgroundGradientTo: THEME.CARD_BACKGROUND,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 69, 0, ${opacity})`, // Use VIBRANT_RED
    labelColor: (opacity = 1) => `rgba(44, 44, 44, ${opacity})`,
    barPercentage: 0.7,
    yAxisSuffix: '', // Added this to fix the TypeScript error
    propsForDots: {r: '5', strokeWidth: '2', stroke: THEME.VIBRANT_RED},
    propsForBackgroundLines: {
      strokeDasharray: '', // solid lines
      stroke: THEME.LIGHT_GRAY,
    },
  };

  if (loadingWallet && !walletDetails && !isRefreshing) {
    return (
      <View style={styles.centeredLoader}>
        <ActivityIndicator size="large" color={THEME.VIBRANT_RED} />
      </View>
    );
  }

  // Safe chart rendering - only render if we have valid data
  const shouldRenderChart =
    chartData.labels.length > 0 &&
    chartData.datasets[0].data.length > 0 &&
    chartData.datasets[0].data.every(
      value => typeof value === 'number' && !isNaN(value),
    );

  return (
    <View style={styles.pageContainer}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content
          title="Earnings & Analytics"
          titleStyle={styles.appbarTitle}
        />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[THEME.VIBRANT_RED]}
          />
        }>
        <View style={styles.walletContainer}>
          <Card style={styles.walletCard}>
            <Card.Content>
              <View style={styles.walletHeader}>
                <MaterialCommunityIcons
                  name="wallet-outline"
                  size={24}
                  color={THEME.DARK_CHARCOAL}
                />
                <Text style={styles.walletTitle}>Wallet Balance</Text>
              </View>

              <View style={styles.balanceContainer}>
                <Text style={styles.totalBalanceText}>Total Available</Text>
                <Text style={styles.totalBalanceAmount}>
                  ₦{Number(walletDetails?.balance || 0).toFixed(2)}
                </Text>
              </View>

              <View style={styles.pendingContainer}>
                <View style={styles.pendingInfo}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={16}
                    color={THEME.MEDIUM_GRAY}
                  />
                  <Text style={styles.pendingText}>Pending clearance</Text>
                </View>
                <Text style={styles.pendingAmount}>
                  ₦{Number(walletDetails?.pendingBalance || 0).toFixed(2)}
                </Text>
              </View>

              <View style={styles.walletFooter}>
                <TouchableOpacity
                  style={styles.withdrawButton}
                  onPress={() => navigate('Settings', {screen: 'bankDetails'})}>
                  <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={16}
                    color={THEME.CREAM_WHITE}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.historyButton}
                  onPress={() => {
                    /* Navigate to transaction history */
                    navigate('Settings', {screen: 'walletScreen'});
                  }}>
                  <Text style={styles.historyButtonText}>View History</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>

          {/* Quick Stats Cards - Fixed labels */}
          <View style={styles.quickStatsRow}>
            <Card style={styles.quickStatCard}>
              <Card.Content style={styles.quickStatContent}>
                <MaterialCommunityIcons
                  name="cash"
                  size={20}
                  color={THEME.SUCCESS_GREEN}
                />
                <Text style={styles.quickStatLabel}>This Week</Text>
                <Text style={styles.quickStatValue}>
                  {loadingWeekData ? (
                    <ActivityIndicator size="small" color={THEME.MEDIUM_GRAY} />
                  ) : (
                    `₦${Number(thisWeekEarnings).toFixed(2)}`
                  )}
                </Text>
                {!loadingWeekData && lastWeekEarnings > 0 && (
                  <Text
                    style={[
                      styles.comparisonText,
                      thisWeekEarnings >= lastWeekEarnings
                        ? styles.comparisonPositive
                        : styles.comparisonNegative,
                    ]}>
                    {thisWeekEarnings >= lastWeekEarnings ? '↑' : '↓'}
                    {Math.abs(
                      ((thisWeekEarnings - lastWeekEarnings) /
                        lastWeekEarnings) *
                        100,
                    ).toFixed(1)}
                    % from last week
                  </Text>
                )}
              </Card.Content>
            </Card>

            <Card style={styles.quickStatCard}>
              <Card.Content style={styles.quickStatContent}>
                <MaterialCommunityIcons
                  name="shopping"
                  size={20}
                  color={THEME.VIBRANT_RED}
                />
                <Text style={styles.quickStatLabel}>Orders</Text>
                <Text style={styles.quickStatValue}>
                  {loadingWeekData ? (
                    <ActivityIndicator size="small" color={THEME.MEDIUM_GRAY} />
                  ) : (
                    thisWeekOrders
                  )}
                </Text>
                {!loadingWeekData && lastWeekOrders > 0 && (
                  <Text
                    style={[
                      styles.comparisonText,
                      thisWeekOrders >= lastWeekOrders
                        ? styles.comparisonPositive
                        : styles.comparisonNegative,
                    ]}>
                    {thisWeekOrders >= lastWeekOrders ? '↑' : '↓'}
                    {Math.abs(
                      ((thisWeekOrders - lastWeekOrders) / lastWeekOrders) *
                        100,
                    ).toFixed(1)}
                    % from last week
                  </Text>
                )}
              </Card.Content>
            </Card>
          </View>
        </View>

        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.statItem}>
              <View>
                <Text style={styles.statLabel}>Total Earnings (Today)</Text>
                <Text style={styles.statValue}>
                  ₦{Number(totalEarnings).toFixed(2)}
                </Text>
              </View>
              {loadingComparison ? (
                <ActivityIndicator size="small" color={THEME.MEDIUM_GRAY} />
              ) : (
                <Text
                  style={[
                    styles.statComparison,
                    earningsChange >= 0
                      ? styles.statComparisonGood
                      : styles.statComparisonBad,
                  ]}>
                  {earningsChange >= 0 ? '+' : ''}
                  {earningsChange.toFixed(1)}%
                </Text>
              )}
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <View>
                <Text style={styles.statLabel}>Total Orders (Today)</Text>
                <Text style={styles.statValue}>{totalOrders}</Text>
              </View>
              {loadingComparison ? (
                <ActivityIndicator size="small" color={THEME.MEDIUM_GRAY} />
              ) : (
                <Text
                  style={[
                    styles.statComparison,
                    ordersChange >= 0
                      ? styles.statComparisonGood
                      : styles.statComparisonBad,
                  ]}>
                  {ordersChange >= 0 ? '+' : ''}
                  {ordersChange.toFixed(1)}%
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.chartHeader}>
              <Text style={styles.cardTitle}>Weekly Performance</Text>
              <View style={styles.chartToggleContainer}>
                <TouchableOpacity
                  onPress={() => setChartType('bar')}
                  style={[
                    styles.chartToggleButton,
                    chartType === 'bar' && styles.chartToggleButtonActive,
                  ]}>
                  <MaterialCommunityIcons
                    name="chart-bar"
                    size={20}
                    color={
                      chartType === 'bar'
                        ? THEME.DARK_CHARCOAL
                        : THEME.MEDIUM_GRAY
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setChartType('line')}
                  style={[
                    styles.chartToggleButton,
                    chartType === 'line' && styles.chartToggleButtonActive,
                  ]}>
                  <MaterialCommunityIcons
                    name="chart-line"
                    size={20}
                    color={
                      chartType === 'line'
                        ? THEME.DARK_CHARCOAL
                        : THEME.MEDIUM_GRAY
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
            {shouldRenderChart ? (
              chartType === 'bar' ? (
                <BarChart
                  data={chartData}
                  width={screenWidth - 88}
                  height={220}
                  chartConfig={chartConfig}
                  yAxisLabel="₦"
                  yAxisSuffix="" // Added this to fix the TypeScript error
                  fromZero
                  style={styles.chart}
                  showBarTops={false}
                />
              ) : (
                <LineChart
                  data={chartData}
                  width={screenWidth - 88}
                  height={220}
                  chartConfig={chartConfig}
                  yAxisLabel="₦"
                  yAxisSuffix="" // Added this to fix the TypeScript error
                  fromZero
                  bezier
                  style={styles.chart}
                />
              )
            ) : (
              <Text style={styles.emptyText}>
                Not enough data to draw a chart for this period.
              </Text>
            )}
          </Card.Content>
        </Card>

        <Text style={styles.sectionHeader}>Recent Transactions</Text>
        {loadingTransactions && !isRefreshing && (
          <ActivityIndicator
            style={{marginVertical: 20}}
            color={THEME.VIBRANT_RED}
          />
        )}
        {filteredTransactions && filteredTransactions.length > 0 ? (
          filteredTransactions.map(tx => {
            const isCredit = tx.type?.toLowerCase() === 'credit';
            const isDebit = tx.type?.toLowerCase() === 'debit';
            const isNeutral = !isCredit && !isDebit;

            // Convert amount to number if it's a string
            const amount =
              typeof tx.amount === 'string'
                ? parseFloat(tx.amount)
                : Number(tx.amount);

            return (
              <Card
                key={tx.id || tx._id}
                style={[
                  styles.transactionCard,
                  isCredit && styles.creditCard,
                  isDebit && styles.debitCard,
                ]}>
                <View style={styles.transactionInner}>
                  <View
                    style={[
                      styles.transactionIconContainer,
                      isCredit && styles.creditIcon,
                      isDebit && styles.debitIcon,
                      isNeutral && styles.neutralIcon,
                    ]}>
                    <MaterialCommunityIcons
                      name={
                        isCredit
                          ? 'arrow-bottom-left-thick' // Money coming in
                          : isDebit
                          ? 'arrow-top-right-thick' // Money going out
                          : 'swap-horizontal' // Neutral/transfer
                      }
                      size={24}
                      color={
                        isCredit
                          ? THEME.SUCCESS_GREEN
                          : isDebit
                          ? THEME.VIBRANT_RED
                          : THEME.MEDIUM_GRAY
                      }
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.txTitle}>
                      {tx.type ||
                        (isCredit
                          ? 'Credit'
                          : isDebit
                          ? 'Debit'
                          : 'Transaction')}
                    </Text>
                    <Text style={styles.txDate}>
                      {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleString()
                        : 'Date not available'}
                    </Text>
                    {tx.status && (
                      <Text
                        style={[
                          styles.txStatus,
                          tx.status === 'completed' && styles.statusCompleted,
                          tx.status === 'pending' && styles.statusPending,
                          tx.status === 'failed' && styles.statusFailed,
                        ]}>
                        {tx.status}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.txAmount,
                      isCredit && styles.creditAmount,
                      isDebit && styles.debitAmount,
                      isNeutral && styles.neutralAmount,
                    ]}>
                    {isCredit ? '+' : isDebit ? '-' : ''}₦
                    {!isNaN(amount) ? Math.abs(amount).toFixed(2) : '0.00'}
                  </Text>
                </View>
              </Card>
            );
          })
        ) : (
          <View style={styles.emptyStateCard}>
            <MaterialCommunityIcons
              name="cash-remove"
              size={48}
              color={THEME.MEDIUM_GRAY}
            />
            <Text style={styles.emptyStateTitle}>No Transactions Found</Text>
            <Text style={styles.emptyStateMessage}>
              There are no earnings or payouts recorded for this period.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {flex: 1, backgroundColor: THEME.CREAM_WHITE},
  centeredLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.CREAM_WHITE,
  },
  appbar: {backgroundColor: THEME.DARK_CHARCOAL, elevation: 0},
  appbarTitle: {color: THEME.CREAM_WHITE, fontWeight: '800', fontSize: 22},
  scrollContainer: {padding: 20, paddingBottom: 50},
  heroHeaderCard: {
    backgroundColor: THEME.VIBRANT_RED,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 8,
    shadowColor: THEME.VIBRANT_RED,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 5},
  },
  heroHeaderText: {
    color: `${THEME.CREAM_WHITE}99`,
    fontSize: 16,
    textAlign: 'center',
  },
  heroHeaderBalance: {
    color: THEME.CREAM_WHITE,
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  comparisonText: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
  comparisonPositive: {
    color: THEME.SUCCESS_GREEN,
  },
  comparisonNegative: {
    color: THEME.VIBRANT_RED,
  },
  walletContainer: {
    marginBottom: 20,
  },
  walletCard: {
    backgroundColor: THEME.CARD_BACKGROUND, // Light background
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 5},
    marginBottom: 15,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  walletTitle: {
    color: THEME.DARK_CHARCOAL, // Dark text
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  balanceContainer: {
    marginBottom: 15,
  },
  totalBalanceText: {
    color: THEME.MEDIUM_GRAY, // Medium gray text
    fontSize: 14,
    marginBottom: 5,
  },
  totalBalanceAmount: {
    color: THEME.DARK_CHARCOAL, // Dark text
    fontSize: 32,
    fontWeight: 'bold',
  },
  pendingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: `${THEME.LIGHT_GRAY}30`, // Very light gray background
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  pendingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingText: {
    color: THEME.MEDIUM_GRAY, // Medium gray text
    fontSize: 14,
    marginLeft: 6,
  },
  pendingAmount: {
    color: THEME.MEDIUM_GRAY, // Medium gray text
    fontSize: 16,
    fontWeight: '600',
  },
  walletFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  withdrawButton: {
    backgroundColor: THEME.VIBRANT_RED,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  withdrawButtonText: {
    color: THEME.CREAM_WHITE,
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 8,
  },
  historyButton: {
    borderWidth: 1,
    borderColor: THEME.LIGHT_GRAY,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  historyButtonText: {
    color: THEME.DARK_CHARCOAL, // Dark text
    fontSize: 14,
    fontWeight: '500',
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStatCard: {
    backgroundColor: THEME.CARD_BACKGROUND, // Light background
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  quickStatContent: {
    padding: 16,
    alignItems: 'center',
  },
  quickStatLabel: {
    color: THEME.MEDIUM_GRAY,
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickStatValue: {
    color: THEME.DARK_CHARCOAL, // Dark text
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: THEME.CARD_BACKGROUND,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#B0B0B0',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },
  cardTitle: {fontSize: 18, fontWeight: 'bold', color: THEME.DARK_CHARCOAL},
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
    marginBottom: 15,
    marginTop: 10,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  statLabel: {fontSize: 15, color: THEME.MEDIUM_GRAY, marginBottom: 4},
  statValue: {fontSize: 24, fontWeight: 'bold', color: THEME.DARK_CHARCOAL},
  statComparison: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statComparisonGood: {
    color: THEME.SUCCESS_GREEN,
  },
  statComparisonBad: {
    color: THEME.VIBRANT_RED,
  },
  divider: {height: 1, backgroundColor: THEME.LIGHT_GRAY, marginVertical: 5},
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartToggleContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.LIGHT_GRAY,
    borderRadius: 10,
  },
  chartToggleButton: {padding: 8, borderRadius: 8},
  chartToggleButtonActive: {
    backgroundColor: THEME.CARD_BACKGROUND,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chart: {marginVertical: 8, borderRadius: 16},
  transactionCard: {
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: THEME.CARD_BACKGROUND,
    shadowColor: '#E0E0E0',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionInner: {flexDirection: 'row', alignItems: 'center', padding: 15},
  transactionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionDetails: {flex: 1},
  // Transaction card variants
  creditCard: {
    borderLeftWidth: 4,
    borderLeftColor: THEME.SUCCESS_GREEN,
  },
  debitCard: {
    borderLeftWidth: 4,
    borderLeftColor: THEME.VIBRANT_RED,
  },

  // Icon background variants
  creditIcon: {
    backgroundColor: `${THEME.SUCCESS_GREEN}20`,
  },
  debitIcon: {
    backgroundColor: `${THEME.VIBRANT_RED}20`,
  },
  neutralIcon: {
    backgroundColor: `${THEME.MEDIUM_GRAY}20`,
  },

  // Amount text variants
  creditAmount: {
    color: THEME.SUCCESS_GREEN,
    fontWeight: 'bold',
  },
  debitAmount: {
    color: THEME.VIBRANT_RED,
    fontWeight: 'bold',
  },
  neutralAmount: {
    color: THEME.MEDIUM_GRAY,
    fontWeight: 'bold',
  },

  // Status styles
  txStatus: {
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusCompleted: {
    backgroundColor: `${THEME.SUCCESS_GREEN}20`,
    color: THEME.SUCCESS_GREEN,
  },
  statusPending: {
    backgroundColor: `${THEME.WARNING_ORANGE}20`,
    color: THEME.WARNING_ORANGE,
  },
  statusFailed: {
    backgroundColor: `${THEME.VIBRANT_RED}20`,
    color: THEME.VIBRANT_RED,
  },
  txTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.DARK_CHARCOAL,
    textTransform: 'capitalize',
  },
  txDate: {fontSize: 13, color: THEME.MEDIUM_GRAY},
  txAmount: {fontSize: 16, fontWeight: 'bold'},
  emptyStateCard: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: THEME.CARD_BACKGROUND,
    borderRadius: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
    marginTop: 15,
  },
  emptyStateMessage: {
    fontSize: 15,
    color: THEME.MEDIUM_GRAY,
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: THEME.MEDIUM_GRAY,
    padding: 20,
    fontStyle: 'italic',
  },
});

export default EarningsScreen;

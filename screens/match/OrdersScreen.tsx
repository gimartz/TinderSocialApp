// OrdersScreen.tsx
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import {Appbar, Card, Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {format} from 'date-fns';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {THEME} from '../theme';
import {
  fetchOrdersByStatus,
  fetchAllOrders, // Add this import
  updateOrderStatus,
  cancelOrder,
  selectOrdersByStatus,
  selectAllOrders, // Add this import
  selectCurrentlyUpdatingOrderId,
  clearUpdateStatus,
  selectOrdersUpdateStatus,
  selectOrdersUpdateError,
  setOrder,
} from '../../src/store/features/orderSlice';
import {AppDispatch, RootState} from '../../src/store';
import {useCustomAlert} from '../../components/customAlert';
import {colors} from '../../theme/colors';

// --- Types ---
interface OrderItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

interface Customer {
  firstName?: string;
  lastName?: string;
  phone?: string;
  addresses?: Array<{
    address: string;
  }>;
}

interface Order {
  id: string;
  status: string;
  lastRestaurantStatus: string;
  lastRiderStatus?: string;
  orderCancellation: {
    cancelledAt: string;
    cancelledBy: 'restaurant' | 'rider';
    id: string; //restaurantid
    reason: 'The item is out of stock';
    refundStatus: string | null;
  };
  customer?: Customer;
  items: OrderItem[];
  totalAmount: number;
  subTotal: number;
  deliveryFee: number;
  createdAt: string;
  specialInstructions?: string;
}

interface CancelModalState {
  visible: boolean;
  orderId: string | null;
  reason: string;
  isLoading: boolean;
}

interface OrderState {
  items: Order[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface RiderStatusConfig {
  [key: string]: {
    icon: string;
    label: string;
    color: string;
  };
}

const statusTransitions: Record<string, string> = {
  pending: 'accepted_by_restaurant',
  accepted_by_restaurant: 'preparing',
  preparing: 'ready',
};

// Add 'all' to order statuses
const orderStatuses = [
  'pending',
  'accepted_by_restaurant',
  'preparing',
  'ready',
  'completed',
  'cancelled',
  'all', // New tab for all orders
];

// Rider status display configuration
const riderStatusConfig: RiderStatusConfig = {
  pending: {
    icon: 'information',
    label: '...Searching for a rider',
    color: THEME.MEDIUM_GRAY,
  },
  accepted_by_rider: {
    icon: 'check-circle',
    label: 'Rider Accepted',
    color: THEME.INFO_BLUE,
  },
  heading_to_restaurant: {
    icon: 'bike',
    label: 'Heading to Restaurant',
    color: THEME.WARNING_ORANGE,
  },
  arrived_at_restaurant: {
    icon: 'store-marker',
    label: 'Arrived at Restaurant',
    color: THEME.SUCCESS_GREEN,
  },
  picked_up: {
    icon: 'package-variant',
    label: 'Order Picked Up',
    color: THEME.SUCCESS_GREEN,
  },
  in_transit: {
    icon: 'truck-delivery',
    label: 'In Transit',
    color: THEME.INFO_BLUE,
  },
  arrived: {
    icon: 'map-marker',
    label: 'Arrived at Destination',
    color: THEME.WARNING_ORANGE,
  },
  delivered: {
    icon: 'check-all',
    label: 'Delivered',
    color: THEME.SUCCESS_GREEN,
  },
  failed: {
    icon: 'alert-circle',
    label: 'Delivery Failed',
    color: THEME.VIBRANT_RED,
  },
  cancelled: {
    icon: 'cancel',
    label: 'Cancelled',
    color: THEME.VIBRANT_RED,
  },
};

const OrdersScreen = ({navigation}: any) => {
  const [selectedStatus, setSelectedStatus] = useState('pending'); // Default to 'pending'
  const [cancelModal, setCancelModal] = useState<CancelModalState>({
    visible: false,
    orderId: null,
    reason: '',
    isLoading: false,
  });
  const dispatch = useDispatch<AppDispatch>();
  const {showAlert} = useCustomAlert();

  const {userInfo} = useSelector((store: RootState) => store.auth);

  // Select orders based on current tab
  const ordersState = useSelector((state: RootState) => {
    if (selectedStatus === 'all') {
      return selectAllOrders(state) as OrderState;
    } else {
      return selectOrdersByStatus(selectedStatus)(state) as OrderState;
    }
  });

  const isUpdatingOrder = useSelector(selectOrdersUpdateStatus);
  const updateStatus = useSelector(selectOrdersUpdateStatus);
  const updateError = useSelector(selectOrdersUpdateError);
  const updatingOrderId = useSelector(selectCurrentlyUpdatingOrderId);

  const orders = ordersState?.items || [];
  const isLoading = ordersState?.status === 'loading';
  const hasError = ordersState?.status === 'failed';

  const handleCancelOrder = (orderId: string) => {
    setCancelModal({
      visible: true,
      orderId,
      reason: '',
      isLoading: false,
    });
  };

  const confirmCancelOrder = async () => {
    if (!cancelModal.orderId || !cancelModal.reason.trim()) {
      showAlert('error', 'Error', 'Please provide a cancellation reason');
      return;
    }

    setCancelModal(prev => ({...prev, isLoading: true}));

    try {
      const result = await dispatch(
        cancelOrder({
          orderId: cancelModal.orderId,
          reason: cancelModal.reason.trim(),
        }),
      ).unwrap();
      console.log(result);

      showAlert('success', 'Success', 'Order cancelled successfully');
      setCancelModal({
        visible: false,
        orderId: null,
        reason: '',
        isLoading: false,
      });

      // Refresh current tab
      if (selectedStatus === 'all') {
        dispatch(fetchAllOrders({}));
      } else {
        dispatch(fetchOrdersByStatus(selectedStatus));
      }
    } catch (error: any) {
      console.log(error);
      showAlert('error', 'Error', error || 'Failed to cancel order');
      setCancelModal(prev => ({...prev, isLoading: false}));
    }
  };

  const closeCancelModal = () => {
    setCancelModal({
      visible: false,
      orderId: null,
      reason: '',
      isLoading: false,
    });
  };

  // Fetch orders when tab changes
  useEffect(() => {
    if (selectedStatus === 'all') {
      dispatch(fetchAllOrders({}));
    } else {
      dispatch(fetchOrdersByStatus(selectedStatus));
    }
  }, [selectedStatus, dispatch]);

  useEffect(() => {
    if (updateStatus === 'succeeded') {
      showAlert('success', 'Success', 'Status Updated');
      dispatch(clearUpdateStatus());
      // Refresh current tab
      if (selectedStatus === 'all') {
        dispatch(fetchAllOrders({}));
      } else {
        dispatch(fetchOrdersByStatus(selectedStatus));
      }
    } else if (updateStatus === 'failed') {
      showAlert('error', 'Error', updateError || 'Update failed');
      dispatch(clearUpdateStatus());
    }
  }, [updateStatus, updateError, dispatch, selectedStatus, showAlert]);

  const handleTabPress = (status: string) => {
    setSelectedStatus(status);
  };

  const handleUpdateStatus = (orderId: string, currentStatus: string) => {
    const nextStatus = statusTransitions[currentStatus.toLowerCase()];
    if (nextStatus) {
      dispatch(updateOrderStatus({orderId, newStatus: nextStatus}));
    }
  };

  const handleRefresh = async () => {
    if (selectedStatus === 'all') {
      await dispatch(fetchAllOrders({}));
    } else {
      const result = await dispatch(fetchOrdersByStatus(selectedStatus));
      console.log(result.payload);
    }
  };

  const getStatusChipStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {bg: THEME.INFO_BLUE, text: THEME.CREAM_WHITE};
      case 'accepted_by_restaurant':
        return {bg: THEME.INFO_BLUE, text: THEME.CREAM_WHITE};
      case 'preparing':
        return {bg: THEME.WARNING_ORANGE, text: THEME.CREAM_WHITE};
      case 'ready':
        return {bg: THEME.SUCCESS_GREEN, text: THEME.CREAM_WHITE};
      case 'completed':
        return {bg: THEME.MEDIUM_GRAY, text: THEME.CREAM_WHITE};
      case 'cancelled':
        return {bg: THEME.VIBRANT_RED, text: THEME.CREAM_WHITE};
      default:
        return {bg: THEME.LIGHT_GRAY, text: THEME.DARK_CHARCOAL};
    }
  };

  const getRiderStatusInfo = (riderStatus?: string) => {
    if (!riderStatus) return null;

    const statusKey = riderStatus.toLowerCase();
    return (
      riderStatusConfig[statusKey] || {
        icon: 'information',
        label: riderStatus.replace(/_/g, ' '),
        color: THEME.MEDIUM_GRAY,
      }
    );
  };

  const OrderCard = ({item}: {item: Order}) => {
    const isUpdating = updatingOrderId === item.id;
    const {bg, text} = getStatusChipStyle(
      item.lastRestaurantStatus || item.status,
    );
    const customerName = `${item.customer?.firstName || ''} ${
      item.customer?.lastName || ''
    }`.trim();
    const nextAction =
      statusTransitions[
        item?.lastRestaurantStatus?.toLowerCase() || item?.status?.toLowerCase()
      ];

    const riderStatusInfo = getRiderStatusInfo(item.lastRiderStatus);

    const isCancelled = item?.orderCancellation;
    // Check if order can be cancelled (only certain statuses)
    const canCancel = [
      'pending',
      'accepted_by_restaurant',
      'preparing',
    ].includes(
      item?.lastRestaurantStatus?.toLowerCase() || item?.status?.toLowerCase(),
    );

    return (
      <Card style={styles.orderCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.orderId}>Id #{item.id.substring(0, 3)}...</Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.grey_light,
                padding: 3,
                paddingHorizontal: 10,
                borderRadius: 10,
              }}
              onPress={() => {
                dispatch(setOrder(item));
                navigation.navigate('OrderDetails', {
                  orderId: item.id,
                  order: item,
                });
              }}>
              <Text style={{color: 'grey'}}>View Details</Text>
            </TouchableOpacity>
            <View style={[styles.statusChip, {backgroundColor: bg}]}>
              <Text style={[styles.statusChipText, {color: text}]}>
                {selectedStatus === 'completed' ||
                selectedStatus === 'cancelled' ||
                selectedStatus === 'ready'
                  ? item?.status.replace(/_/g, ' ')
                  : item?.lastRestaurantStatus?.replace(/_/g, ' ')}
              </Text>
            </View>
          </View>

          {/* Rider Status Display */}
          {riderStatusInfo && item.status !== 'cancelled' && (
            <View
              style={[
                styles.riderStatusContainer,
                {backgroundColor: `${riderStatusInfo.color}20`},
              ]}>
              <MaterialCommunityIcons
                name={riderStatusInfo.icon}
                size={16}
                color={riderStatusInfo.color}
              />
              <Text
                style={[
                  styles.riderStatusText,
                  {color: riderStatusInfo.color},
                ]}>
                {riderStatusInfo.label}
              </Text>
            </View>
          )}

          {/* Order Cancellation */}
          {isCancelled && (
            <View>
              <View
                style={[
                  styles.riderStatusContainer,
                  {backgroundColor: `${colors.grey_light}`},
                ]}>
                <MaterialCommunityIcons
                  name="minus-circle"
                  size={20}
                  color={colors.notification}
                />
                <Text
                  style={[styles.riderStatusText, {color: THEME.VIBRANT_RED}]}>
                  Cancelled by:{' '}
                  {isCancelled.cancelledBy === 'restaurant'
                    ? 'You'
                    : isCancelled.cancelledBy}
                </Text>
              </View>
              <View
                style={[
                  styles.riderStatusContainer,
                  {backgroundColor: `${colors.grey_light}`},
                ]}>
                <MaterialCommunityIcons
                  name="information"
                  size={20}
                  color={colors.accent}
                />
                <Text
                  style={[styles.riderStatusText, {color: THEME.VIBRANT_RED}]}>
                  Reason: {isCancelled.reason}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.cardRow}>
            <MaterialCommunityIcons
              name="account-outline"
              size={18}
              color={THEME.MEDIUM_GRAY}
            />
            <Text style={styles.cardRowText}>{customerName || 'N/A'}</Text>
          </View>

          <View style={styles.cardRow}>
            <MaterialCommunityIcons
              name="calendar-outline"
              size={18}
              color={THEME.MEDIUM_GRAY}
            />
            <Text style={styles.cardRowText}>
              {format(new Date(item.createdAt), 'MMM d, yyyy - h:mm a')}
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.itemCount}>
              {item.items?.length || 0} item(s)
            </Text>
            <Text style={styles.totalPrice}>
              ₦{parseFloat(String(item.totalAmount) || '0').toFixed(2)}
            </Text>
          </View>

          {/* Only show action buttons for non-completed/non-cancelled orders */}
          {item.status !== 'completed' && item.status !== 'cancelled' && (
            <View style={styles.actionButtonsContainer}>
              {/* Update status button */}
              {nextAction && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.updateButton]}
                  onPress={() =>
                    handleUpdateStatus(
                      item.id,
                      item.lastRestaurantStatus || item.status,
                    )
                  }
                  disabled={isUpdating}>
                  {isUpdating ? (
                    <ActivityIndicator color={THEME.DARK_CHARCOAL} />
                  ) : (
                    <Text style={styles.actionButtonText}>
                      {nextAction === 'accepted_by_restaurant'
                        ? 'Accept Order'
                        : `Mark as ${nextAction?.replace(/_/g, ' ')}`}
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              {/* Cancel button */}
              {canCancel && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => handleCancelOrder(item.id)}
                  disabled={isUpdating}>
                  <Text
                    style={[styles.actionButtonText, styles.cancelButtonText]}>
                    Cancel Order
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyStateCard}>
      <MaterialCommunityIcons
        name="clipboard-text-outline"
        size={48}
        color={THEME.MEDIUM_GRAY}
      />
      <Text style={styles.emptyStateTitle}>
        {selectedStatus === 'all' ? 'No Orders' : 'No Orders Here'}
      </Text>
      <Text style={styles.emptyStateMessage}>
        {hasError
          ? `Failed to load ${
              selectedStatus === 'all' ? 'orders' : selectedStatus + ' orders'
            }. Pull to refresh.`
          : selectedStatus === 'all'
          ? "You haven't received any orders yet."
          : `There are currently no "${selectedStatus}" orders.`}
      </Text>
    </View>
  );

  const LoadingState = () => (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color={THEME.VIBRANT_RED} />
      <Text style={styles.loadingText}>
        Loading{' '}
        {selectedStatus === 'all' ? 'all orders' : selectedStatus + ' orders'}
        ...
      </Text>
    </View>
  );

  return (
    <View style={styles.pageContainer}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Manage Orders" titleStyle={styles.appbarTitle} />
      </Appbar.Header>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}>
          {orderStatuses.map(status => {
            const statusCount = useSelector((state: RootState) => {
              if (status === 'all') {
                return (
                  (selectAllOrders(state) as OrderState)?.items?.length || 0
                );
              } else {
                return (
                  (selectOrdersByStatus(status)(state) as OrderState)?.items
                    ?.length || 0
                );
              }
            });

            return (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterPill,
                  selectedStatus === status && styles.filterPillActive,
                ]}
                onPress={() => handleTabPress(status)}>
                <Text
                  style={[
                    styles.filterPillText,
                    selectedStatus === status && styles.filterPillTextActive,
                  ]}>
                  {status == 'all' ? 'Full history' : status.replace(/_/g, ' ')}
                </Text>
                {statusCount > 0 && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{statusCount}</Text>
                  </View>
                )}
                {isLoading && selectedStatus === status && (
                  <ActivityIndicator
                    size="small"
                    color={THEME.VIBRANT_RED}
                    style={styles.pillLoader}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Cancel Order Modal */}
      <Modal
        visible={cancelModal.visible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeCancelModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Order</Text>
            <Text style={styles.modalSubtitle}>
              Please provide a reason for cancellation
            </Text>

            <TextInput
              style={styles.reasonInput}
              placeholder="Enter cancellation reason..."
              placeholderTextColor={THEME.MEDIUM_GRAY}
              value={cancelModal.reason}
              onChangeText={text =>
                setCancelModal(prev => ({...prev, reason: text}))
              }
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={closeCancelModal}
                style={styles.modalButton}
                disabled={cancelModal.isLoading}>
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={confirmCancelOrder}
                style={[styles.modalButton, styles.confirmButton]}
                loading={cancelModal.isLoading}
                disabled={cancelModal.isLoading || !cancelModal.reason.trim()}>
                Confirm Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {isLoading && orders.length === 0 ? (
        <LoadingState />
      ) : (
        <FlatList
          data={orders}
          renderItem={OrderCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          onRefresh={handleRefresh}
          refreshing={isLoading}
          ListEmptyComponent={EmptyState}
        />
      )}
    </View>
  );
};

// ... keep the existing stylesheet exactly as it is ...

// --- STYLESHEET ---
const styles = StyleSheet.create({
  pageContainer: {flex: 1, backgroundColor: THEME.CREAM_WHITE},
  appbar: {backgroundColor: THEME.DARK_CHARCOAL, elevation: 0},
  appbarTitle: {color: THEME.CREAM_WHITE, fontWeight: '800', fontSize: 22},
  filterContainer: {paddingHorizontal: 15, paddingVertical: 12},
  filterPill: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 5,
    backgroundColor: THEME.LIGHT_GRAY,
    position: 'relative',
  },
  countBadge: {
    backgroundColor: THEME.VIBRANT_RED,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  countText: {
    color: THEME.CREAM_WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  pillLoader: {
    position: 'absolute',
    right: 9,
    top: 15,
    width: 5,
    height: 5,
  },
  filterPillActive: {backgroundColor: THEME.BOLD_YELLOW},
  filterPillText: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.MEDIUM_GRAY,
    textTransform: 'capitalize',
  },
  filterPillTextActive: {color: THEME.DARK_CHARCOAL},
  listContainer: {paddingHorizontal: 20, paddingTop: 10, paddingBottom: 50},
  orderCard: {
    backgroundColor: THEME.CARD_BACKGROUND,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#B0B0B0',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 1},
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  orderId: {fontSize: 14, fontWeight: '600', color: THEME.MEDIUM_GRAY},
  statusChip: {paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12},
  statusChipText: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  riderStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  riderStatusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  cardRowText: {fontSize: 15, color: THEME.DARK_CHARCOAL, marginLeft: 10},
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: THEME.LIGHT_GRAY,
    paddingTop: 12,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  itemCount: {fontSize: 15, color: THEME.MEDIUM_GRAY, fontWeight: '500'},
  totalPrice: {fontSize: 20, fontWeight: 'bold', color: THEME.DARK_CHARCOAL},
  // updateButton: {
  //   backgroundColor: THEME.BOLD_YELLOW,
  //   borderRadius: 12,
  //   paddingVertical: 14,
  //   alignItems: 'center',
  //   margin: 16,
  //   marginTop: 5,
  // },
  updateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
    textTransform: 'capitalize',
  },
  emptyStateCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
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
    lineHeight: 22,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: THEME.MEDIUM_GRAY,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
    marginHorizontal: 16,
  },

  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  updateButton: {
    backgroundColor: THEME.BOLD_YELLOW,
  },

  cancelButton: {
    backgroundColor: THEME.LIGHT_GRAY,
    borderWidth: 1,
    borderColor: THEME.VIBRANT_RED,
  },

  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
  },

  cancelButtonText: {
    color: THEME.VIBRANT_RED,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: THEME.CREAM_WHITE,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
    marginBottom: 8,
    textAlign: 'center',
  },

  modalSubtitle: {
    fontSize: 16,
    color: THEME.MEDIUM_GRAY,
    marginBottom: 20,
    textAlign: 'center',
  },

  reasonInput: {
    borderWidth: 1,
    borderColor: THEME.LIGHT_GRAY,
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
    fontSize: 16,
    color: THEME.DARK_CHARCOAL, // Add this for text color
    backgroundColor: THEME.CREAM_WHITE, // Ensure background color
  },

  modalButton: {
    flex: 1,
    borderColor: THEME.MEDIUM_GRAY, // Add border color for outline button
  },

  confirmButton: {
    backgroundColor: THEME.WARNING_ORANGE,
  },

  // Add styles for button text
  modalButtonText: {
    color: THEME.DARK_CHARCOAL,
  },

  confirmButtonText: {
    color: THEME.CREAM_WHITE, // White text on red button
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});

export default OrdersScreen;

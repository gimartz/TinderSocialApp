// src/screens/OrderDetailsScreen.tsx
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  List,
  Divider,
  Button,
  Text,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {format} from 'date-fns';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import {colors} from '../../theme/colors';
import {THEME} from '../theme';
import {
  updateOrderStatus,
  cancelOrder,
  clearUpdateStatus,
  selectOrdersUpdateStatus,
  selectOrdersUpdateError,
} from '../../src/store/features/orderSlice';
import {AppDispatch, RootState} from '../../src/store';
import {useCustomAlert} from '../../components/customAlert';

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

interface OrderCancellation {
  cancelledAt: string;
  cancelledBy: 'restaurant' | 'rider';
  id: string;
  reason: string;
  refundStatus: string | null;
}

interface Order {
  id: string;
  status: string;
  lastRestaurantStatus: string;
  lastRiderStatus?: string;
  orderCancellation?: OrderCancellation;
  customer?: Customer;
  items: OrderItem[];
  totalAmount: number;
  subTotal: number;
  deliveryFee: number;
  createdAt: string;
  specialInstructions?: string;
}

type RootStackParamList = {
  OrderDetails: {orderId: string; order: Order};
};

type OrderDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'OrderDetails'
>;

type OrderDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'OrderDetails'
>;

interface OrderDetailsScreenProps {
  navigation: OrderDetailsScreenNavigationProp;
  route: OrderDetailsScreenRouteProp;
}

interface StatusChipStyle {
  bg: string;
  text: string;
}

interface RiderStatusInfo {
  icon: string;
  label: string;
  color: string;
}

interface CancelModalState {
  visible: boolean;
  reason: string;
  isLoading: boolean;
}

const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {order} = route.params;
  const {showAlert} = useCustomAlert();

  const [cancelModal, setCancelModal] = useState<CancelModalState>({
    visible: false,
    reason: '',
    isLoading: false,
  });

  const updateStatus = useSelector(selectOrdersUpdateStatus);
  const updateError = useSelector(selectOrdersUpdateError);
  const isUpdating = useSelector(
    (state: RootState) => state.orders.currentlyUpdatingOrderId === order.id,
  );

  useEffect(() => {
    if (updateStatus === 'succeeded') {
      showAlert('success', 'Success', 'Status Updated');
      dispatch(clearUpdateStatus());
    } else if (updateStatus === 'failed') {
      showAlert('error', 'Error', updateError || 'Update failed');
      dispatch(clearUpdateStatus());
    }
  }, [updateStatus, updateError, dispatch, showAlert]);

  
  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await dispatch(
        updateOrderStatus({orderId: order.id, newStatus}),
      ).unwrap();
      navigation.goBack()
    } catch (err) {
      console.log('Error updating status:', err);
    }
  };

  const handleCancelOrder = () => {
    setCancelModal({
      visible: true,
      reason: '',
      isLoading: false,
    });
  };

  const confirmCancelOrder = async () => {
    if (!cancelModal.reason.trim()) {
      showAlert('error', 'Error', 'Please provide a cancellation reason');
      return;
    }

    setCancelModal(prev => ({...prev, isLoading: true}));

    try {
      await dispatch(
        cancelOrder({
          orderId: order.id,
          reason: cancelModal.reason.trim(),
        }),
      ).unwrap();

      showAlert('success', 'Success', 'Order cancelled successfully');
      setCancelModal({
        visible: false,
        reason: '',
        isLoading: false,
      });
      navigation.goBack();
    } catch (error: any) {
      showAlert('error', 'Error', error || 'Failed to cancel order');
      setCancelModal(prev => ({...prev, isLoading: false}));
    }
  };

  const closeCancelModal = () => {
    setCancelModal({
      visible: false,
      reason: '',
      isLoading: false,
    });
  };

  const getStatusChipStyle = (status?: string): StatusChipStyle => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
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

  const getRiderStatusInfo = (riderStatus?: string): RiderStatusInfo | null => {
    const riderStatusConfig: Record<string, RiderStatusInfo> = {
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

  const statusTransitions: Record<string, string> = {
    pending: 'accepted_by_restaurant',
    accepted_by_restaurant: 'preparing',
    preparing: 'ready',
  };

  const currentStatus = order.lastRestaurantStatus || order.status;
  const nextAction = statusTransitions[currentStatus?.toLowerCase()];
  const canCancel = ['pending', 'accepted_by_restaurant', 'preparing'].includes(
    currentStatus?.toLowerCase(),
  );
  const isCancelled = order?.orderCancellation;
  const riderStatusInfo = getRiderStatusInfo(order.lastRiderStatus);
  const {bg, text} = getStatusChipStyle(currentStatus);
  const customerName = `${order.customer?.firstName || ''} ${
    order.customer?.lastName || ''
  }`.trim();

  const renderActionButtons = () => {
    if (isCancelled || currentStatus === 'completed') return null;

    return (
      <View style={styles.buttonContainer}>
        {nextAction && (
          <Button
            mode="contained"
            onPress={() => handleUpdateStatus(nextAction)}
            loading={isUpdating}
            disabled={isUpdating}
            style={[styles.button, styles.updateButton]}
            labelStyle={styles.updateButtonText}>
            {nextAction === 'accepted_by_restaurant'
              ? 'Accept Order'
              : `Mark as ${nextAction.replace(/_/g, ' ')}`}
          </Button>
        )}

        {canCancel && (
          <Button
            mode="outlined"
            onPress={handleCancelOrder}
            disabled={isUpdating}
            style={[styles.button, styles.cancelButton]}
            labelStyle={styles.cancelButtonText}>
            Cancel Order
          </Button>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: colors.background}}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={colors.text}
        />
        <Appbar.Content
          title={`Order #${order.id.substring(0, 15)}...`}
          titleStyle={{color: colors.text, fontWeight: 'bold'}}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Order Status Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.statusHeader}>
              <Title style={[styles.bold, {color: colors.text}]}>
                Order Status
              </Title>
              <View style={[styles.statusChip, {backgroundColor: bg}]}>
                <Text style={[styles.statusChipText, {color: text}]}>
                  {currentStatus.replace(/_/g, ' ')}
                </Text>
              </View>
            </View>

            {/* Rider Status Display */}
            {riderStatusInfo && !isCancelled && (
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

            {/* Order Cancellation Info */}
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
                  <Text style={styles.cancellationText}>
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
                  <Text style={styles.cancellationText}>
                    Reason: {isCancelled.reason}
                  </Text>
                </View>
                {isCancelled.cancelledAt && (
                  <Text style={styles.timestamp}>
                    Cancelled on:{' '}
                    {format(
                      new Date(isCancelled.cancelledAt),
                      'MMM d, yyyy - h:mm a',
                    )}
                  </Text>
                )}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Customer Details Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={[styles.bold, {color: colors.text}]}>
              Customer Details
            </Title>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="account-outline"
                size={18}
                color={THEME.MEDIUM_GRAY}
              />
              <Text style={styles.detailText}>{customerName || 'N/A'}</Text>
            </View>

            {order?.customer?.phone && (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="phone"
                  size={18}
                  color={THEME.MEDIUM_GRAY}
                />
                <Text style={styles.detailText}>{order.customer.phone}</Text>
              </View>
            )}

            {order?.customer?.addresses?.[0]?.address && (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={18}
                  color={THEME.MEDIUM_GRAY}
                />
                <Text style={styles.detailText}>
                  {order.customer.addresses[0].address}
                </Text>
              </View>
            )}

            <Text style={styles.timestamp}>
              Ordered on:{' '}
              {format(new Date(order.createdAt), 'MMM d, yyyy - h:mm a')}
            </Text>
          </Card.Content>
        </Card>

        {/* Special Instructions */}
        {order?.specialInstructions && (
          <Card style={[styles.card, styles.notesCard]}>
            <Card.Content>
              <List.Item
                title="Special Instructions"
                titleStyle={styles.notesTitle}
                description={order.specialInstructions}
                descriptionStyle={styles.notesText}
                descriptionNumberOfLines={5}
                left={props => (
                  <List.Icon
                    {...props}
                    icon="alert-circle-outline"
                    color={colors.primary}
                  />
                )}
              />
            </Card.Content>
          </Card>
        )}

        {/* Order Items */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={{color: colors.text}}>Order Items</Title>
            {order?.items?.map((item, index) => (
              <View key={item.id || index}>
                <List.Item
                  title={`${item.quantity}x ${item.name}`}
                  description={item.description || ''}
                  descriptionNumberOfLines={2}
                  right={() => (
                    <Text style={styles.itemPrice}>
                      ₦{(Number(item.quantity) * Number(item.price)).toFixed(2)}
                    </Text>
                  )}
                  titleStyle={styles.itemName}
                  descriptionStyle={styles.itemDescription}
                />
                {index < order.items.length - 1 && <Divider />}
              </View>
            ))}
            <Divider style={styles.totalDivider} />

            <List.Item
              title="Subtotal"
              right={() => (
                <Text style={styles.totalText}>
                  ₦{Number(order.subTotal).toFixed(2)}
                </Text>
              )}
              titleStyle={styles.totalLabel}
            />

            {order.deliveryFee > 0 && (
              <List.Item
                title="Delivery Fee"
                right={() => (
                  <Text style={styles.totalText}>
                    ₦{Number(order.deliveryFee).toFixed(2)}
                  </Text>
                )}
                titleStyle={styles.totalLabel}
              />
            )}

            <List.Item
              title="Total"
              right={() => (
                <Text style={[styles.totalText, styles.bold]}>
                  ₦{Number(order.totalAmount).toFixed(2)}
                </Text>
              )}
              titleStyle={[styles.totalLabel, styles.bold]}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Action Buttons */}
      {renderActionButtons() && (
        <View style={styles.footer}>{renderActionButtons()}</View>
      )}

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey_light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: THEME.MEDIUM_GRAY,
  },
  scrollContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 15,
    backgroundColor: colors.surface,
    borderRadius: 8,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
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
    marginBottom: 8,
  },
  riderStatusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  cancellationText: {
    fontSize: 14,
    marginLeft: 8,
    color: colors.text,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 10,
  },
  notesCard: {
    backgroundColor: colors.primary + '1A',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  notesTitle: {
    fontWeight: 'bold',
    color: colors.text,
  },
  notesText: {
    color: colors.grey_dark,
    fontSize: 14,
  },
  bold: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: colors.grey_medium,
    marginTop: 10,
    textAlign: 'right',
  },
  itemName: {
    fontSize: 16,
    color: colors.text,
  },
  itemDescription: {
    fontSize: 14,
    color: colors.grey_dark,
  },
  itemPrice: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  totalDivider: {
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.grey_dark,
  },
  totalText: {
    fontSize: 16,
    color: colors.grey_dark,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.disabled,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 8,
  },
  updateButton: {
    backgroundColor: THEME.BOLD_YELLOW,
  },
  updateButtonText: {
    color: THEME.DARK_CHARCOAL,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: THEME.LIGHT_GRAY,
    borderWidth: 1,
    borderColor: THEME.VIBRANT_RED,
  },
  cancelButtonText: {
    color: THEME.VIBRANT_RED,
    fontWeight: 'bold',
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
    color: THEME.DARK_CHARCOAL,
    backgroundColor: THEME.CREAM_WHITE,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderColor: THEME.MEDIUM_GRAY,
  },
  confirmButton: {
    backgroundColor: THEME.WARNING_ORANGE,
  },
});

export default OrderDetailsScreen;

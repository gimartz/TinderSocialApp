// FILE: src/components/EditModal.tsx
import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {EditModalProps} from '../../types/menu';
import {THEME} from '../../screens/theme';

export const EditModal: React.FC<EditModalProps> = ({
  visible,
  item,
  onSave,
  onClose,
  isCategory = false,
  isLoading = false, // Add loading prop
  isSuccess = false, // Add success prop
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [icon, setIcon] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setDescription(item.description || '');
      if ('price' in item) {
        setPrice(item.price?.toString() || '');
      }
      setIcon((item as any).icon || '');
    }
  }, [item]);

  // Close modal automatically on success
  useEffect(() => {
    if (isSuccess && visible) {
      // Small delay to show success state before closing
      const timer = setTimeout(() => {
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, visible, onClose]);

  const handleSave = () => {
    const updatedData = isCategory
      ? {name, description, icon}
      : {name, description, price: parseFloat(price) || 0};
    onSave(item!.id, updatedData);
  };

  if (!item) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Edit {isCategory ? 'Category' : 'Meal'}
          </Text>

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={THEME.VIBRANT_RED} />
              <Text style={styles.loadingText}>Saving changes...</Text>
            </View>
          )}

          {isSuccess && (
            <View style={styles.successOverlay}>
              <Text style={styles.successText}>✓ Changes saved!</Text>
            </View>
          )}

          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.modalInput}
            placeholderTextColor={THEME.MEDIUM_GRAY}
            editable={!isLoading}
          />

          {isCategory && (
            <TextInput
              placeholder="Icon (e.g., 🍔)"
              value={icon}
              onChangeText={setIcon}
              style={styles.modalInput}
              placeholderTextColor={THEME.MEDIUM_GRAY}
              editable={!isLoading}
            />
          )}

          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            style={[styles.modalInput, {height: 80, textAlignVertical: 'top'}]}
            placeholderTextColor={THEME.MEDIUM_GRAY}
            editable={!isLoading}
          />

          {!isCategory && (
            <TextInput
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.modalInput}
              placeholderTextColor={THEME.MEDIUM_GRAY}
              editable={!isLoading}
            />
          )}

          <View style={styles.modalButtonRow}>
            <TouchableOpacity
              style={[styles.modalButtonCancel, isLoading && styles.buttonDisabled]}
              onPress={onClose}
              disabled={isLoading}>
              <Text style={styles.modalButtonCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButtonSave, isLoading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color={THEME.DARK_CHARCOAL} size="small" />
              ) : (
                <Text style={styles.modalButtonSaveText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: THEME.CARD_BACKGROUND,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: THEME.LIGHT_GRAY,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: THEME.DARK_CHARCOAL,
    marginBottom: 12,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButtonCancel: {
    paddingVertical: 16,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: THEME.LIGHT_GRAY,
  },
  modalButtonCancelText: {
    color: THEME.MEDIUM_GRAY,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalButtonSave: {
    backgroundColor: THEME.BOLD_YELLOW,
    paddingVertical: 16,
    borderRadius: 12,
    flex: 2,
    alignItems: 'center',
    marginLeft: 8,
  },
  modalButtonSaveText: {
    color: THEME.DARK_CHARCOAL,
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 24,
  },
  loadingText: {
    marginTop: 10,
    color: THEME.DARK_CHARCOAL,
    fontSize: 16,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(46, 125, 50, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 24,
  },
  successText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
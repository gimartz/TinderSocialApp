//FILE: src/screens/CreateCategoryScreen.js

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityIndicator, Appbar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {THEME} from '../theme';
import {
  createCategory,
  resetCategoryState,
} from '../../src/store/features/menu/category';
import {goBack} from '../../ref';
import {AppDispatch, RootState} from '../../src/store';

// --- Reusable Modal Picker Component ---
const IconPickerModal = ({
  visible,
  options,
  onSelect,
  onClose,
}: {
  visible: boolean;
  options: {label: string; value: string}[];
  onSelect: React.Dispatch<React.SetStateAction<string>>;
  // onClose: (value: React.SetStateAction<boolean>) => void;
  onClose: () => void;
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}>
    <View style={styles.modalBackdrop}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Select an Icon</Text>
        <FlatList
          data={options}
          keyExtractor={item => item.value}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                onSelect(item.value);
                onClose();
              }}>
              <Text style={styles.modalOptionText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  </Modal>
);

const CreateCategoryScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {loading, error, success} = useSelector(
    (state: RootState) => state.category,
  );

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false);

  const iconOptions = [
    {label: '🍛 Local Foods', value: '🍛'},
    {label: '🍕 Fast Food', value: '🍕'},
    {label: '🥗 Healthy', value: '🥗'},
    {label: '🍣 Sushi', value: '🍣'},
    {label: '🍰 Desserts', value: '🍰'},
    {label: '🍔 Burgers', value: '🍔'},
    {label: '🌮 Tacos', value: '🌮'},
    {label: '🍜 Noodles', value: '🍜'},
    {label: '🥙 Wraps', value: '🥙'},
    {label: '🍝 Pasta', value: '🍝'},
    {label: '🍖 Grilled Meats', value: '🍖'},
    {label: '🥩 Steaks', value: '🥩'},
    {label: '🌯 Burritos', value: '🌯'},
    {label: '🍨 Ice Cream', value: '🍨'},
    {label: '🍳 Breakfast', value: '🍳'},
    {label: '🥧 Pies', value: '🥧'},
    {label: '🍤 Seafood', value: '🍤'},
    {label: '🥬 Salads', value: '🥬'},
    {label: '🍚 Rice Dishes', value: '🍚'},
    {label: '🍹 Beverages', value: '🍹'},
    {label: '🍕 Pizza', value: '🍕'},
    {label: '🍢 Skewers', value: '🍢'},
    {label: '🍣 Sashimi', value: '🍣'},
    {label: '🍇 Fruits', value: '🍇'},
    {label: '🥒 Vegetables', value: '🥒'},
    // Add more...
  ];

  useEffect(() => {
    if (success) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Category created successfully!',
      });
      dispatch(resetCategoryState());
      goBack(); // Navigate back after success
    }
    if (error) {
      Toast.show({type: 'error', text1: 'Error', text2: error});
      dispatch(resetCategoryState());
    }
  }, [success, error, dispatch]);

  const handleSubmit = () => {
    if (!name.trim() || !icon || !description.trim()) {
      Alert.alert('Validation Error', 'Please fill all fields.');
      return;
    }
    const categoryData = {name, icon, description};
    dispatch(createCategory({categoryData}));
  };

  return (
    <View style={styles.pageContainer}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={goBack} color={THEME.CREAM_WHITE} />
        <Appbar.Content
          title="Create New Category"
          titleStyle={styles.appbarTitle}
        />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.inputLabel}>Category Name</Text>
        <TextInput
          placeholder="e.g., Appetizers, Main Courses"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor={THEME.MEDIUM_GRAY}
        />

        <Text style={styles.inputLabel}>Icon</Text>
        <TouchableOpacity
          style={styles.pickerInput}
          onPress={() => setPickerVisible(true)}>
          <Text
            style={[
              styles.pickerInputText,
              !icon && {color: THEME.MEDIUM_GRAY},
            ]}>
            {icon || 'Select an icon...'}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color={THEME.DARK_CHARCOAL}
          />
        </TouchableOpacity>

        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          placeholder="A short description of the category"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, {height: 100, textAlignVertical: 'top'}]}
          multiline
          placeholderTextColor={THEME.MEDIUM_GRAY}
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color={THEME.DARK_CHARCOAL} />
          ) : (
            <Text style={styles.submitButtonText}>Create Category</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <IconPickerModal
        visible={isPickerVisible}
        options={iconOptions}
        onSelect={setIcon}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
};
// A combined stylesheet for reference. Place relevant parts in each file.
const styles = StyleSheet.create({
  // --- Global & Page Structure ---
  pageContainer: {flex: 1, backgroundColor: THEME.CREAM_WHITE},
  appbar: {backgroundColor: THEME.DARK_CHARCOAL, elevation: 0},
  appbarTitle: {color: THEME.CREAM_WHITE, fontWeight: '800', fontSize: 22},

  // --- Form & Input Styles (For Create Screens) ---
  formContainer: {padding: 20, paddingBottom: 50},
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
  pickerInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.LIGHT_GRAY,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pickerInputText: {fontSize: 16, color: THEME.DARK_CHARCOAL},
  submitButton: {
    backgroundColor: THEME.BOLD_YELLOW,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
  },

  // --- Modal Picker Styles (For Create Screens) ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 30,
  },
  modalContainer: {
    backgroundColor: THEME.CARD_BACKGROUND,
    borderRadius: 20,
    maxHeight: '70%',
    padding: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 15,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: THEME.LIGHT_GRAY,
  },
  modalOption: {paddingVertical: 15, paddingHorizontal: 20},
  modalOptionText: {fontSize: 18, color: THEME.DARK_CHARCOAL},

  // --- Orders Screen Styles ---
  filterContainer: {paddingHorizontal: 15, paddingVertical: 12},
  filterPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 5,
    backgroundColor: THEME.LIGHT_GRAY,
  },
  filterPillActive: {backgroundColor: THEME.BOLD_YELLOW},
  filterPillText: {fontSize: 15, fontWeight: '600', color: THEME.MEDIUM_GRAY},
  filterPillTextActive: {color: THEME.DARK_CHARCOAL},
  listContainer: {paddingHorizontal: 20, paddingTop: 10, paddingBottom: 50},
  orderCard: {
    backgroundColor: THEME.CARD_BACKGROUND,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#B0B0B0',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {fontSize: 18, fontWeight: 'bold', color: THEME.DARK_CHARCOAL},
  statusChip: {paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12},
  statusChipText: {fontSize: 13, fontWeight: 'bold'},
  customerName: {fontSize: 16, color: THEME.DARK_CHARCOAL, marginBottom: 15},
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: THEME.LIGHT_GRAY,
    paddingTop: 12,
    marginTop: 8,
  },
  itemCount: {fontSize: 14, color: THEME.MEDIUM_GRAY},
  totalPrice: {fontSize: 18, fontWeight: 'bold', color: THEME.DARK_CHARCOAL},
  updateButton: {
    backgroundColor: THEME.BOLD_YELLOW,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 15,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
  },

  // --- Empty State Card ---
  emptyStateCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
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
});
export default CreateCategoryScreen;

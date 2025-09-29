import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Appbar, Button} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {THEME} from '../theme';
import {
  createMenuItem,
  resetMenuState,
} from '../../src/store/features/menu/menuSlice';
import {fetchCategories} from '../../src/store/features/menu/category';
import {goBack} from '../../ref';
import {COLORS} from '../../src/constants/colors';
import {useCustomAlert} from '../../components/customAlert';
import {AppDispatch, RootState} from '../../src/store';
import {Category} from '../../types/menu';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// --- Type Definitions ---
interface CreateNewMenuScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

interface CategoryPickerModalProps {
  visible: boolean;
  options: Category[];
  onSelect: (category: Category) => void;
  onClose: () => void;
}

// More descriptive types for options
interface Choice {
  name: string;
  price: number;
  maxQuantity: number;
}
interface OptionGroup {
  name: string;
  choices: Choice[];
}

// --- Reusable Modal Picker Component ---
const CategoryPickerModal: React.FC<CategoryPickerModalProps> = ({
  visible,
  options,
  onSelect,
  onClose,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}>
    <View style={styles.modalBackdrop}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Select a Category</Text>
        <FlatList
          data={options}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                onSelect(item);
                onClose();
              }}>
              <Text style={styles.modalOptionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  </Modal>
);

const CreateNewMenuScreen: React.FC<CreateNewMenuScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {loading, error, success} = useSelector(
    (state: RootState) => state.menu,
  );
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const {categories} = useSelector((state: RootState) => state.category);

  const {showAlert} = useCustomAlert();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [prepTime, setPrepTime] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [options, setOptions] = useState<OptionGroup[]>([]); // Use the detailed OptionGroup type

  useEffect(() => {
    if (userInfo?.id) {
      dispatch(fetchCategories({restaurantId: userInfo.id}));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (success) {
      showAlert('success', 'Success', 'Menu item created successfully!');
      dispatch(resetMenuState());
      goBack();
    }
    if (error) {
      showAlert('error', 'Error', error || 'An error occurred');
      dispatch(resetMenuState());
    }
  }, [success, error, dispatch, showAlert]);

  const handleSubmit = () => {
    if (!name || !price || !selectedCategory) {
      Alert.alert(
        'Validation Error',
        'Name, Price, and Category are required.',
      );
      return;
    }

    const numericPrice = parseFloat(price);
    const numericPrepTime = parseInt(prepTime) || 0;

    if (isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price.');
      return;
    }

    const menuItemData = {
      name,
      description,
      price: numericPrice,
      categoryId: selectedCategory.id,
      estimatedPreparationTime: numericPrepTime,
      options,
    };

    dispatch(createMenuItem({menuItemData}));
  };

  return (
    <View style={styles.pageContainer}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={goBack} color={THEME.CREAM_WHITE} />
        <Appbar.Content
          title="Create New Meal"
          titleStyle={styles.appbarTitle}
        />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.inputLabel}>Meal Name</Text>
        <TextInput
          placeholder="e.g., Gourmet Burger"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <Text style={styles.helperText}>This is the name customers will see on the menu.</Text>

        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          placeholder="A short, enticing description for the meal"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, {height: 100, textAlignVertical: 'top'}]}
          multiline
        />
        <Text style={styles.helperText}>Describe the meal to make it sound appealing.</Text>

        <Text style={styles.inputLabel}>Price (₦)</Text>
        <TextInput
          placeholder="e.g., 1500"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
          keyboardType="numeric"
        />
        <Text style={styles.helperText}>Enter the base price for this meal. Options can add to this.</Text>


        <Text style={styles.inputLabel}>Category</Text>
        <TouchableOpacity
          style={styles.pickerInput}
          onPress={() => setPickerVisible(true)}>
          <Text
            style={[
              styles.pickerInputText,
              !selectedCategory && {color: THEME.MEDIUM_GRAY},
            ]}>
            {selectedCategory ? selectedCategory.name : 'Select a category...'}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color={THEME.DARK_CHARCOAL}
          />
        </TouchableOpacity>
        <Text style={styles.helperText}>Group this meal under the right menu category (e.g., "Main Dishes").</Text>


        <Text style={styles.inputLabel}>Preparation Time (minutes)</Text>
        <TextInput
          placeholder="e.g., 20"
          value={prepTime}
          onChangeText={setPrepTime}
          style={styles.input}
          keyboardType="numeric"
        />
        <Text style={styles.helperText}>Helps you and your customer estimate wait times.</Text>
        
        {/* --- Options Section --- */}
        <Text style={styles.inputLabel}>Meal Options</Text>
        <View style={styles.optionsContainer}>
            {options.map((opt, index) => (
                <View key={index} style={styles.optionTag}>
                    <Text style={styles.optionTagText}>{opt.name}</Text>
                </View>
            ))}
            {options.length === 0 && (
                <Text style={styles.emptyOptionText}>No customizations (e.g., size, toppings) added yet.</Text>
            )}
        </View>

        <TouchableOpacity
          style={styles.addOptionButton}
          onPress={() => navigation.navigate('MenuItemOptions', {setOptions})}
        >
            <Text style={styles.addOptionButtonText}>Add/Edit Customizations</Text>
        </TouchableOpacity>

        {/* --- Final Submit Button --- */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color={THEME.DARK_CHARCOAL} />
          ) : (
            <Text style={styles.submitButtonText}>Create Meal</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <CategoryPickerModal
        visible={isPickerVisible}
        options={categories || []}
        onSelect={setSelectedCategory}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {flex: 1, backgroundColor: THEME.CREAM_WHITE},
  appbar: {backgroundColor: THEME.DARK_CHARCOAL, elevation: 0},
  appbarTitle: {color: THEME.CREAM_WHITE, fontWeight: '800', fontSize: 22},

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
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
   helperText: {
    fontSize: 13,
    color: THEME.MEDIUM_GRAY,
    marginBottom: 20,
    marginTop: 4,
    paddingLeft: 4,
  },
  pickerInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.LIGHT_GRAY,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pickerInputText: {fontSize: 16, color: THEME.DARK_CHARCOAL},

  // --- Options Display ---
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: THEME.LIGHT_GRAY,
    borderRadius: 12,
    padding: 10,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTag: {
    backgroundColor: THEME.BOLD_YELLOW,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
  },
  optionTagText: {
    color: THEME.DARK_CHARCOAL,
    fontWeight: '500',
  },
  emptyOptionText: {
    fontSize: 14,
    color: THEME.MEDIUM_GRAY,
    fontStyle: 'italic',
  },
  addOptionButton: {
    backgroundColor: '#E9E9E9', // A slightly different neutral color
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D5D5D5'
  },
  addOptionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
  },

  // --- Submit Buttons ---
  submitButton: {
    backgroundColor: THEME.BOLD_YELLOW,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: THEME.LIGHT_GRAY,
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
  },

  // --- Modal Picker Styles ---
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
});

export default CreateNewMenuScreen;
import React, {useState, useRef, forwardRef, useImperativeHandle} from 'react';
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ListRenderItem,
  Animated,
  Easing,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import axios from 'axios';
import {apiKey} from '../../src/constants/colors';
import {colors} from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Suggestion {
  description: string;
  place_id: string;
}

interface AutocompleteSearchProps {
  onSelect: (description: string, placeId: string) => void;
  editedAddress?: string;
  seteditedAdd?: (address: string) => void;
  textInputProps?: any;
  styles?: any;
  hasSelectedAddress?: boolean;
  setHasSelectedAddress?: (selected: boolean) => void;
}

export interface AutocompleteSearchRef {
  shake: () => void;
}

const AutocompleteSearch = forwardRef<AutocompleteSearchRef, AutocompleteSearchProps>(({
  onSelect,
  editedAddress,
  seteditedAdd,
  textInputProps,
  styles: customStyles,
  hasSelectedAddress,
  setHasSelectedAddress,
}, ref) => {
  const [searchText, setSearchText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isShowingResults, setIsShowingResults] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // Expose the shake method via ref
  useImperativeHandle(ref, () => ({
    shake: startShake,
  }));

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const searchLocation = async (text: string): Promise<void> => {
    if (editedAddress !== undefined && seteditedAdd) {
      seteditedAdd(text);
      if (setHasSelectedAddress) {
        setHasSelectedAddress(false);
      }
    } else {
      setSearchText(text);
    }

    if (text.length < 3) {
      setSuggestions([]);
      setIsShowingResults(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${apiKey}`,
        {
          params: {
            components: 'country:ng',
            region: 'ng',
          },
        },
      );

      if (response.data.predictions) {
        setSuggestions(response.data.predictions);
        setIsShowingResults(true);
      }
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
    }
  };

  const handleSelectSuggestion = (description: string, placeId: string): void => {
    if (editedAddress !== undefined && seteditedAdd) {
      seteditedAdd(description);
    } else {
      setSearchText(description);
    }
    setSuggestions([]);
    setIsShowingResults(false);
    setIsFocused(false);
    
    if (setHasSelectedAddress) {
      setHasSelectedAddress(true);
    }
    
    onSelect(description, placeId);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (editedAddress && setHasSelectedAddress) {
      setHasSelectedAddress(false);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const renderSuggestion: ListRenderItem<Suggestion> = ({item}) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectSuggestion(item.description, item.place_id)}>
      <Icon name="location-on" size={20} color={colors.primary} style={styles.suggestionIcon} />
      <Text style={[styles.suggestionText, {color: colors.text}]}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View 
      style={[
        styles.container, 
        {zIndex: 999},
        {transform: [{translateX: shakeAnimation}]}
      ]}
    >
      <View style={[
        styles.inputContainer, 
        {borderBottomColor: hasSelectedAddress ? colors.success : isFocused ? colors.primary : colors.border},
        hasSelectedAddress && styles.selectedInputContainer
      ]}>
        <TextInput
          label="Your Store's Address"
          value={editedAddress !== undefined ? editedAddress : searchText}
          onChangeText={searchLocation}
          onFocus={handleFocus}
          onBlur={handleBlur}
          mode="flat"
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              paddingHorizontal: 0,
              color: colors.text,
            },
            textInputProps?.style,
          ]}
          activeUnderlineColor={colors.primary}
          underlineColor="transparent"
          right={
            hasSelectedAddress ? (
              <TextInput.Icon 
                icon="check-circle" 
                color={colors.success}
                size={20}
              />
            ) : isFocused ? (
              <TextInput.Icon 
                icon="arrow-down-drop-circle" 
                color={colors.primary}
                size={20}
              />
            ) : null
          }
          theme={{
            colors: {
              placeholder: colors.placeholder,
              text: colors.text,
              primary: colors.primary,
              background: colors.surface,
              error: colors.accent,
              surface: colors.surface,
              onSurface: colors.text,
            },
            dark: false,
          }}
          {...textInputProps}
        />
      </View>

      {!hasSelectedAddress && isFocused && editedAddress && editedAddress.length >= 3 && (
        <View style={styles.instructionBubble}>
          <Icon name="info" size={16} color={colors.surface} />
          <Text style={styles.instructionText}>
            Please select an address from the dropdown to get accurate location data
          </Text>
        </View>
      )}

      {isShowingResults && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <View style={styles.suggestionHeader}>
            <Text style={styles.suggestionHeaderText}>
              Select an address from the list:
            </Text>
          </View>
          <FlatList
            style={[
              styles.suggestionList,
              {
                backgroundColor: colors.surface,
                borderColor: colors.success,
                shadowColor: colors.text,
              },
              customStyles?.listView,
            ]}
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item) => item.place_id}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled={true}
          />
        </View>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
  },
  inputContainer: {
    borderBottomWidth: 2,
    marginBottom: 10,
    borderRadius: 4,
  },
  selectedInputContainer: {
    borderBottomWidth: 3,
  },
  input: {
    backgroundColor: 'transparent',
    height: 50,
  },
  suggestionsContainer: {
    position: 'relative',
  },
  suggestionHeader: {
    backgroundColor: colors.primary,
    padding: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  suggestionHeaderText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  suggestionList: {
    maxHeight: 200,
    borderWidth: 1,
    borderRadius: 4,
    zIndex: 1000,
    elevation: 4,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionIcon: {
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
    flex: 1,
  },
  instructionBubble: {
    position: 'absolute',
    top: -30,
    left: 0,
    right: 0,
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1001,
  },
  instructionText: {
    color: colors.surface,
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
});

export default AutocompleteSearch;
// FILE: src/screens/NewLocationScreen.tsx

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import {Appbar, Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {THEME} from '../../../../theme';
import AutocompleteSearch from '../../../../../components/settings/AutoComplete';
import {updateLocation, resetLocationState} from '../../../../../src/store/features/location';
import {apiKey} from '../../../../../src/constants/colors';
import {useCustomAlert} from '../../../../../components/customAlert';
import {RootState} from '../../../../../src/store';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';

// Define navigation types
type RootStackParamList = {
  NewLocationScreen: undefined;
  // Add other screens as needed
};

type NewLocationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NewLocationScreen'
>;

type NewLocationScreenRouteProp = RouteProp<
  RootStackParamList,
  'NewLocationScreen'
>;

interface NewLocationScreenProps {
  navigation: NewLocationScreenNavigationProp;
  route: NewLocationScreenRouteProp;
}

interface LocationDetails {
  address: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string;
  country: string;
}

interface LocationData {
  address: string;
  latitude: string;
  longitude: string;
}

const NewLocationScreen: React.FC<NewLocationScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {loading, error, success} = useSelector(
    (state: RootState) => state.location,
  );
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [locationDetails, setLocationDetails] = useState<
    Partial<LocationDetails>
  >({});

  const {showAlert} = useCustomAlert();

  useEffect(() => {
    if (success) {
      Alert.alert('Success', 'Location updated successfully!');
      showAlert('success', 'Location Updated!', '');
      dispatch(resetLocationState());
      navigation.goBack();
    }
    if (error) {
      showAlert('error', 'Update Failed', error);
      dispatch(resetLocationState());
    }
  }, [success, error, dispatch, navigation, showAlert]);

  const handleLocationSelect = (description: string): void => {
    setSelectedPlace(description);
    fetchLocationDetails(description);
  };

  const fetchLocationDetails = async (description: string): Promise<void> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          description,
        )}&key=${apiKey}`,
      );
      const data = await response.json();
      if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        const addressComponents = data.results[0].address_components;
        const currentLatitude = location.lat.toString();
        const currentLong = location.lng.toString();

        console.log(currentLatitude, currentLong, '=====');
        let city = '';
        let state = '';
        let country = '';

        addressComponents.forEach((component: any) => {
          if (component.types.includes('locality')) {
            city = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1')) {
            state = component.long_name;
          }
          if (component.types.includes('country')) {
            country = component.long_name;
          }
        });

        setLocationDetails({
          address: description,
          latitude: currentLatitude,
          longitude: currentLong,
          city: city,
          state: state,
          country: country,
        });
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  };

  const handleSaveLocation = (): void => {
    if (selectedPlace === null) {
      showAlert(
        'error',
        'No Location Selected',
        'Please search for and select an address.',
      );

      Alert.alert('Error', 'Please select a location before saving.');
      console.log('No location selected');
      return;
    }

    if (!locationDetails.latitude || !locationDetails.longitude) {
      showAlert(
        'error',
        'Incomplete Location Data',
        'Please wait for location details to load or select another address.',
      );
      return;
    }

    const locationData: LocationData = {
      address: selectedPlace,
      latitude: locationDetails.latitude,
      longitude: locationDetails.longitude,
    };

    console.log('Location Data to Save:', locationData);
    setIsLoading(true);
    dispatch(updateLocation(locationData) as any)
      .unwrap()
      .then(() => {
        setIsLoading(false);
        Toast.show({type: 'success', text1: 'Location Updated Successfully!'});
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.pageContainer}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={THEME.CREAM_WHITE}
        />
        <Appbar.Content
          title="Update Location"
          titleStyle={styles.appbarTitle}
        />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.formHeader}>
          <MaterialCommunityIcons
            name="map-marker-radius-outline"
            size={48}
            color={THEME.VIBRANT_RED}
          />
          <Text style={styles.formTitle}>Set Your Store's Location</Text>
          <Text style={styles.formSubtitle}>
            Start typing your address below and select from the suggestions.
          </Text>
        </View>

        <AutocompleteSearch
          onSelect={handleLocationSelect}
          textInputProps={{
            style: styles.input,
            placeholderTextColor: THEME.MEDIUM_GRAY,
          }}
          styles={{
            container: {flex: 0},
            listView: {
              backgroundColor: THEME.CARD_BACKGROUND,
              borderRadius: 12,
              marginTop: 5,
            },
          }}
        />

        <Button
          style={styles.primaryButton}
          contentStyle={styles.primaryButtonContent}
          labelStyle={styles.primaryButtonText}
          onPress={handleSaveLocation}
          icon="content-save"
          mode="contained-tonal">
          {isLoading ? (
            <ActivityIndicator color={THEME.DARK_CHARCOAL} />
          ) : (
            'Save Location'
          )}
        </Button>
      </ScrollView>
    </View>
  );
};

// A combined stylesheet for reference. Place relevant parts in each file.
const styles = StyleSheet.create({
  // --- Global & Page Structure ---
  pageContainer: {
    flex: 1,
    backgroundColor: THEME.CREAM_WHITE,
  },
  appbar: {
    backgroundColor: THEME.DARK_CHARCOAL,
    elevation: 0,
  },
  appbarTitle: {
    color: THEME.CREAM_WHITE,
    fontWeight: '800',
    fontSize: 22,
  },
  primaryButton: {
    backgroundColor: THEME.BOLD_YELLOW,
    borderRadius: 16,
    elevation: 4, // for Android shadow
    shadowColor: '#A88C00', // A darker yellow for a realistic shadow
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  primaryButtonContent: {
    // Controls the padding inside the button
    paddingVertical: 10,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
  },
  // --- Form & Input Styles ---
  formContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 50,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
    marginTop: 15,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 16,
    color: THEME.MEDIUM_GRAY,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  input: {
    backgroundColor: THEME.LIGHT_GRAY,
    borderRadius: 12,
    fontSize: 16,
    color: THEME.DARK_CHARCOAL,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    // For react-native-paper TextInput with `flat` mode
    // The library handles padding internally.
  },
  // Specifically for AutocompleteSearch wrapper if needed
  autocompleteContainer: {
    backgroundColor: THEME.LIGHT_GRAY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 0, // Adjust for Android
    marginBottom: 20,
  },

  // --- Primary CTA Button ---
  submitButton: {
    backgroundColor: THEME.BOLD_YELLOW,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#B0B0B0',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
  },
});

export default NewLocationScreen;

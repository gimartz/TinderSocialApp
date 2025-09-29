import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AutocompleteSearch from '../../components/settings/AutoComplete'; // Adjust

const Example = () => {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [editedAddress, setEditedAddress] = useState('');

  const handleSelect = (address) => {
    setSelectedAddress(address);
  };

  return (
    <View style={styles.container}>
      <AutocompleteSearch
        onSelect={handleSelect}
        editedAddress={editedAddress}
        seteditedAdd={setEditedAddress}
      />
      <Text style={styles.selectedAddressLabel}>Selected Address:</Text>
      <Text style={styles.selectedAddress}>{selectedAddress}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
  },
  selectedAddressLabel: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedAddress: {
    fontSize: 16,
    marginTop: 8,
  },
});

export default Example;

// FILE: src/components/OtpInput.js

import React, {useRef, useState, useEffect} from 'react';
import {View, TextInput, StyleSheet, Pressable} from 'react-native';
import {THEME} from '../../src/constants/theme';

const OtpInput = ({codeLength = 6, value, onChange}) => {
  const inputRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleTextChange = (text, index) => {
    const newCode = [...value];
    newCode[index] = text;
    onChange(newCode.join(''));

    // Move to next input if a digit is entered
    if (text && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current is empty
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {[...new Array(codeLength)].map((_, index) => (
        <Pressable
          key={index}
          style={styles.pressable}
          onPress={() => inputRefs.current[index]?.focus()}>
          <TextInput
            ref={ref => (inputRefs.current[index] = ref)}
            style={[styles.box, focusedIndex === index && styles.boxFocused]}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={text => handleTextChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            value={value[index] || ''}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
          />
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pressable: {
    flex: 1,
    marginHorizontal: 5,
  },
  box: {
    height: 60,
    width: '100%',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.DARK_CHARCOAL,
    backgroundColor: THEME.LIGHT_GRAY,
    borderWidth: 2,
    borderColor: THEME.LIGHT_GRAY,
    borderRadius: 12,
  },
  boxFocused: {
    borderColor: THEME.BOLD_YELLOW,
    backgroundColor: THEME.CREAM_WHITE,
  },
});

export default OtpInput;

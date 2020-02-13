// LIBRARIES
import React from 'react';
import {View, Text, TextInput} from 'react-native';

export const TextInputView = ({
  labelText,
  placeholder,
  labelIcon,
  value,
  autoCorrect,
  autoCapitalize,
  secureTextEntry,
  keyboardType,
  onChangeText,
  onSubmitEditing,
  blurOnSubmit,
  returnKeyType,
  maxLength,
  customStyle,
  placeholderTextColor,
}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={{marginRight: 5}}>{labelIcon}</View>
      <TextInput
        placeholder={placeholder}
        maxLength={maxLength || 40}
        placeholderTextColor={placeholderTextColor || '#333'}
        value={value}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={blurOnSubmit}
        returnKeyType={returnKeyType}
        style={[
          {height: 50, flex: 1, fontSize: 16, marginLeft: 5},
          customStyle,
        ]}
      />
    </View>
  );
};

//= =====STYLES DECLARATION======//

const styles = {
  ContainerStyle: {
    marginBottom: 10,
  },
};

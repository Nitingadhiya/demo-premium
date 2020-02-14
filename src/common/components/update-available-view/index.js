import React, {Component} from 'react';
import {View, TouchableOpacity, Text, Platform, Linking} from 'react-native';
import styles from './styles';

const navigateToUpdate = () => {
  if (Platform.OS === 'android') {
    Linking.openURL(
      'https://play.google.com/store/apps/details?id=com.premium.sales.corporation',
    );
  } else {
    Linking.canOpenURL(
      'https://play.google.com/store/apps/details?id=com.premium.sales.corporation',
    );
  }
};
export const UpdateAvailableView = ({}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.newVersionText}>New Version Available</Text>
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => navigateToUpdate()}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

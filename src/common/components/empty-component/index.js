import React from 'react';
import {View, Text} from 'react-native';
import styles from './styles';

export const EmptyComponent = ({message}) => {
  return (
    <View style={styles.noOfferView}>
      <Text style={styles.noOfferText}>{message}</Text>
    </View>
  );
};

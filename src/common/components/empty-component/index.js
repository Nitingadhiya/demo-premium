import React from 'react';
import {View, Text} from 'react-native';
import styles from './styles';

export const EmptyComponent = ({message}) => {
  return (
    <View style={Styles.noOfferView}>
      <Text style={Styles.noOfferText}>{message}</Text>
    </View>
  );
};

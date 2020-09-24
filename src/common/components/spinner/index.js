import React, {Component} from 'react';
import {View} from 'react-native';
import Spinner from 'react-native-spinkit';
import {Matrics, Color} from '../../../common/styles';
import styles from './styles';

export const SpinnerView = ({type, size, color}) => {
  return (
    <View style={styles.spinnerView}>
      <Spinner
        style={styles.spinner}
        isVisible={true}
        size={size || Matrics.ScaleValue(50)}
        type={type || 'ThreeBounce'}
        color={color || Color.primary}
      />
    </View>
  );
};

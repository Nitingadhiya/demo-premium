import React from 'react';
import {View} from 'react-native';
import styles from './styles';
import {SpinnerView} from '../../../common/components';

export const LoadMoreComponent = ({loadMore}) => {
  return <View style={styles.mainView}>{loadMore && <SpinnerView />}</View>;
};

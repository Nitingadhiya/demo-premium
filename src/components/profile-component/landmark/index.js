import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import PickAddressModal from '../../pick-address-modal';

const contantText = 'Landmark';

export const LandMarkTextPickerTextBox = () => {
  const [addressModalVisible, useaddressModalVisible] = useState(false);
  const [landmarkText, userLandMarkText] = useState();

  const renderPickerModal = () => {
    if (addressModalVisible) {
      return (
        <PickAddressModal
          searchPlaceholderText={'Landmark'}
          modalType={'Landmark'}
          closeModalPress={(type, item) => {
            userLandMarkText(item);
            useaddressModalVisible(false);
          }}
        />
      );
    }
  };
  return (
    <>
      <TouchableOpacity
        style={styles.labelClass}
        onPress={() => {
          useaddressModalVisible(true);
        }}>
        <View style={styles.width120}>
          <Text style={styles.birthdayLabelText}>{contantText}</Text>
        </View>
        <View style={styles.flex1}>
          {landmarkText ? (
            <Text style={styles.font16_333}>{landmarkText}</Text>
          ) : (
            <Text style={styles.font16_999}>{contantText}</Text>
          )}
        </View>
      </TouchableOpacity>
      {renderPickerModal()}
    </>
  );
};

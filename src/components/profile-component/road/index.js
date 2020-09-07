import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import PickAddressModal from '../../pick-address-modal';

const contantText = 'Road';

export const RoadPickerTextBox = ({road, setRoadValue}) => {
  const [addressModalVisible, useaddressModalVisible] = useState(false);
  const [roadText, userRoadText] = useState();
  useEffect(() => {
    if (road) {
      userRoadText(road);
    }
  }, [road]); // Only re-run the effect if images changes

  const renderPickerModal = () => {
    if (addressModalVisible) {
      return (
        <PickAddressModal
          searchPlaceholderText={'Road'}
          modalType={'Road'}
          closeModalPress={(type, item) => {
            userRoadText(item);
            useaddressModalVisible(false);
            setRoadValue(item);
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
          {roadText ? (
            <Text style={styles.font16_333}>{roadText}</Text>
          ) : (
            <Text style={styles.font16_999}>{roadText}</Text>
          )}
        </View>
      </TouchableOpacity>
      {renderPickerModal()}
    </>
  );
};

import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import PickAddressModal from '../../pick-address-modal';

const contantText = 'Area';

export const AreaPickerTextBox = ({area, setAreaValue}) => {
  const [addressModalVisible, useaddressModalVisible] = useState(false);
  const [areaText, userareaText] = useState();
  useEffect(() => {
    if (area) {
      userareaText(area);
    }
  }, [area]); // Only re-run the effect if images changes

  const renderPickerModal = () => {
    if (addressModalVisible) {
      return (
        <PickAddressModal
          searchPlaceholderText={contantText}
          modalType={contantText}
          closeModalPress={(type, item) => {
            userareaText(item);
            useaddressModalVisible(false);
            setAreaValue(item);
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
          {areaText ? (
            <Text style={styles.font16_333}>{areaText}</Text>
          ) : (
            <Text style={styles.font16_999}>{areaText}</Text>
          )}
        </View>
      </TouchableOpacity>
      {renderPickerModal()}
    </>
  );
};

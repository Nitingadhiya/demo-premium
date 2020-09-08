import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import PickAddressModal from '../../pick-address-modal';

const contantText = 'City';

export const CityPickerTextBox = ({city, setAreaValue, opacityValue}) => {
  const [addressModalVisible, useaddressModalVisible] = useState(false);
  const [areaText, userCityText] = useState();
  useEffect(() => {
    if (city) {
      userCityText(city);
    }
  }, [city]); // Only re-run the effect if images changes

  const renderPickerModal = () => {
    if (addressModalVisible) {
      return (
        <PickAddressModal
          searchPlaceholderText={contantText}
          modalType={contantText}
          closeModalPress={(type, item) => {
            userCityText(item);
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
        style={[styles.labelClass, {opacity: opacityValue ? 0.5 : 1}]}
        disabled={opacityValue}
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

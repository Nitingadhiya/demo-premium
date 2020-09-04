import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Picker} from 'react-native';
import styles from './styles';
import PickAddressModal from '../../pick-address-modal';

const contantText = 'Area';

export const ItemTypeSelectBox = ({item}) => {
  const [selectedItem, setItemPickerValue] = useState();

  return (
    <View style={styles.container}>
      <View style={styles.viewSystemName}>
        <Text style={styles.textFieldTitle}>Item Type</Text>
      </View>
      <View style={styles.borderW1}>
        <Picker
          prompt="Enter Item Type"
          selectedValue={selectedItem || 0}
          onValueChange={(itemValue, itemIndex) => {
            setItemPickerValue(itemValue);
            // this.subjectChange(itemValue);
            // this.setState({selectedCompSubject: itemValue});
          }}>
          {item.map((data, index) => {
            return (
              <Picker.Item
                label={data.CodeDesc}
                value={data.CodeId}
                key={`${index}`}
              />
            );
          })}
        </Picker>
      </View>
    </View>
  );
};

import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Picker} from 'react-native';
import styles from './styles';

export const SystemTypeSelectBox = ({item, selectedItem, itemChange}) => {
  //const [selectedItem, setItemPickerValue] = useState();

  return (
    <View style={styles.container}>
      <View style={styles.viewSystemName}>
        <Text style={styles.textFieldTitle}>System</Text>
      </View>
      <View style={styles.borderW1}>
        <Picker
          prompt="Select System"
          selectedValue={selectedItem || 0}
          onValueChange={(itemValue, itemIndex) => {
            itemChange(itemValue);
            // this.subjectChange(itemValue);
            // this.setState({selectedCompSubject: itemValue});
          }}>
          {item.map((data, index) => {
            return (
              <Picker.Item
                label={data.CodeDesc}
                value={data.CodeDesc}
                key={`${index}`}
              />
            );
          })}
        </Picker>
      </View>
    </View>
  );
};

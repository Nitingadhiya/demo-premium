import React from "react";
import { View, Text } from "react-native";
import { Matrics } from "../../styles";
import PickerModal from "../../../react-native-picker-modal-view";
import Styles from "./styles";

export const CustomPicker = ({
  items,
  title,
  onClosed,
  onSelected,
  onBackButtonPressed,
  selectedItem,
  selectPlaceholderText,
  searchPlaceholderText
}) => {
  return (
    <View style={Styles.mainView}>
      <Text style={[Styles.q2Title, { marginBottom: Matrics.ScaleValue(0) }]}>
        {title}
      </Text>
      <PickerModal
        showAlphabeticalIndex={true}
        onSelected={onSelected}
        onClosed={onClosed}
        onBackButtonPressed={onBackButtonPressed}
        items={items}
        selected={selectedItem}
        autoGenerateAlphabeticalIndex={true}
        selectPlaceholderText={selectPlaceholderText}
        onEndReached={() => console.log("list ended...")}
        searchPlaceholderText={searchPlaceholderText}
        requireSelection={false}
        autoSort={false}
        style={{ chooseText: { fontSize: 20 } }}
      />
    </View>
  );
};

import React, { Component } from "react";
import { View, Text } from "react-native";
import _ from "lodash";
import SectionedMultiSelect from "../../../react-native-sectioned-multi-select";
import { Matrics, Fonts, Color, ApplicationStyles } from "../../styles";
import Styles from "./styles";
// import Helper from "../../../util/helper";
import { Helper } from "../../../util";

const noResultsComponent = () => (
  <View style={Styles.noResultView}>
    <Text style={Styles.textNoResult}>
      {Helper.translation("Register.Sorry, no results", "Sorry, no results")}
    </Text>
  </View>
);

export const CustomMultiplePicker = ({
  multiSelectItems,
  selectedMultiItems,
  onSelectedItemsChange
}) => {
  if (multiSelectItems && !_.size(multiSelectItems) > 0) return <View />;
  return (
    <View style={{ marginTop: Matrics.ScaleValue(10) }}>
      <Text style={[Styles.q2Title, { marginBottom: Matrics.ScaleValue(5) }]}>
        {Helper.translation("Register.Languages", "Languages")}
      </Text>
      <SectionedMultiSelect
        items={multiSelectItems}
        uniqueKey="id"
        subKey="children"
        iconKey="icon"
        showDropDowns={false}
        selectText={Helper.translation(
          "Register.Select languages",
          "Select languages"
        )}
        expandDropDowns={true}
        readOnlyHeadings={true}
        onSelectedItemsChange={selectedMultiItems =>
          onSelectedItemsChange(selectedMultiItems)
        }
        selectedItems={selectedMultiItems}
        showCancelButton
        modalWithSafeAreaView={true}
        modalAnimationType={"slide"}
        searchPlaceholderText={Helper.translation(
          "Register.Search language",
          "Search language..."
        )}
        selectedText={Helper.translation("Words.selected", "selected")}
        noResultsComponent={noResultsComponent()}
        confirmText={Helper.translation("Words.Confirm", "Confirm")}
        styles={Styles.custom}
      />
    </View>
  );
};

import React, { Component } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Color, Matrics, Fonts } from "../../styles";

export const Button = ({
  label,
  onPress,
  customStyle,
  children,
  customTextStyle,
  customIcon,
  disabled
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} disabled={disabled}>
      <View style={[styles.buttonStyle, customStyle]}>
        {customIcon && <View style={styles.customIcon}>{customIcon}</View>}
        <Text style={[styles.buttonTextStyle, customTextStyle]}>{label}</Text>
        {children}
      </View>
    </TouchableOpacity>
  );
};
const styles = {
  buttonStyle: {
    backgroundColor: Color.darkRed,
    height: Matrics.ScaleValue(45),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Matrics.ScaleValue(5)
  },
  buttonTextStyle: {
    color: Color.white,
    fontSize: Matrics.ScaleValue(16),
    fontFamily: Fonts.type.RubikMedium,
    textAlign: "center"
  },
  customIcon: {
    position: "absolute",
    zIndex: 1,
    left: Matrics.ScaleValue(20)
  }
};

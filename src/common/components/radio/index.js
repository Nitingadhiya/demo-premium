import React, { Component } from "react";
import { View, Text } from "react-native";
import LottieView from "lottie-react-native";
import { Matrics, Images } from "../../styles";
import Styles from "./styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Helper } from "../../../util";
import RegisterObj from "../../../api/register-data";

const animationRadioView = () => (
  <View style={Styles.animationCheckboxView}>
    <LottieView
      source={Images.radio}
      resizeMode="cover"
      autoPlay={true}
      loop={false}
      style={{ transform: [{ scale: 1 }] }}
    />
  </View>
);
export const Radio = ({
  items,
  title,
  onPress,
  subTitle,
  customStyle,
  radioButtonView,
  langType,
  stateName
}) => {
  roundMark = (stateName, val) => {
    if (
      RegisterObj[stateName] &&
      val === "yes" &&
      RegisterObj[stateName] === true
    ) {
      return animationRadioView(); //<View style={Styles.dotStyles} />;
    } else if (
      !RegisterObj[stateName] &&
      val === "no" &&
      RegisterObj[stateName] === false
    ) {
      return animationRadioView();
    } else if (RegisterObj[stateName] === val) {
      return animationRadioView();
    }
  };

  return (
    <View
      style={{
        alignSelf: "flex-start",
        width: Matrics.screenWidth - Matrics.ScaleValue(40),
        flexWrap: "wrap",
        marginLeft: Matrics.ScaleValue(-10)
      }}
    >
      <View style={{ marginLeft: Matrics.ScaleValue(10) }}>
        <Text style={Styles.q2Title}>{title}</Text>
        {subTitle && <Text style={Styles.q2subTitle}>{subTitle}</Text>}
      </View>
      <View style={customStyle}>
        {items.map((res, index) => (
          <View
            style={[Styles.q2OptionView, radioButtonView]}
            key={index.toString()}
          >
            <TouchableOpacity
              onPress={() => onPress(res.key)}
              style={[Styles.q2OptionView, Styles.animationTouchStyles]}
            >
              <View style={Styles.checkedRoundBRD}>
                {this.roundMark(stateName, res.key)}
              </View>
              <Text style={Styles.q2TitleOption}>
                {Helper.translation(`${langType}.${res.label}`, res.label)}
                {/* {res.label} */}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

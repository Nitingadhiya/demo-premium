import React from "react";
import { View, Text, TouchableOpacity, Linking, Platform } from "react-native";
import LottieView from "lottie-react-native";
import Styles from "./styles";
// import Helper from "../../../util/helper";
import { Helper } from "../../../util";
import RegisterObj from "../../../api/register-data";
import GlobalVar from "../../../global";
import ServerVar from "../../../../config/server-config";
import { Images, Matrics } from "../../styles";
import Icon from "react-native-fontawesome-pro";

export const Checkbox = ({
  items,
  title,
  onPress,
  subTitle,
  customOptionStyle,
  customView,
  langType,
  stateName,
  mainView,
  privacyPolicy,
  disabled,
  screen,
  icon
}) => {
  IconView = () => (
    <View style={Styles.animationCheckboxView}>
      <LottieView
        source={Images.checkbox}
        resizeMode="cover"
        autoPlay={true}
        loop={false}
        style={{ transform: [{ scale: 1 }] }}
      />
    </View>
  );
  // <Icon
  //   name={"ios-checkmark"}
  //   color={Color.darkRed}
  //   size={Matrics.ScaleValue(28)}
  //   style={{
  //     marginTop:
  //       Platform.OS === "ios" ? Matrics.ScaleValue(-4) : Matrics.ScaleValue(0)
  //   }}
  // />

  checkMark = (stateName, val) => {
    if (!RegisterObj[stateName]) return null;
    return RegisterObj[stateName].includes(val) ? this.IconView() : null;
  };

  return (
    <View style={[Styles.checkboxView, mainView]}>
      {title ? <Text style={Styles.q2Title}>{title}</Text> : null}
      {subTitle && <Text style={Styles.q2subTitle}>{subTitle}</Text>}
      {items.map((res, index) => (
        <View style={[Styles.q2OptionView, customView]} key={index.toString()}>
          <TouchableOpacity
            style={Styles.touchBtn}
            onPress={() => onPress(res.key)}
            activeOpacity={0.9}
            disabled={disabled}
          >
            <View style={Styles.checkView}>
              {screen === "jobDetails"
                ? this.IconView()
                : this.checkMark(stateName, res.key)}
            </View>
            {icon ? (
              <View style={{ marginLeft: Matrics.ScaleValue(5) }}>
                <Icon
                  name={res.icon}
                  size={Matrics.ScaleValue(res.size)}
                  type={res.type}
                />
              </View>
            ) : null}
            <Text style={[Styles.q2TitleOption, customOptionStyle]}>
              {screen === "jobDetails"
                ? res
                : Helper.translation(`${langType}.${res.label}`, res.label)}
              {privacyPolicy && index === 0 && (
                <Text
                  style={Styles.privacyText}
                  onPress={() => Linking.openURL(ServerVar.privacyPolicyURL())}
                >
                  {" "}
                  {Helper.translation(
                    "Words.privacy policy",
                    "privacy policy."
                  )}
                </Text>
              )}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

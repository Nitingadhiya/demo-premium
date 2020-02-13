import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import MIcon from "react-native-vector-icons/MaterialIcons";
import { Color, ApplicationStyles, Images, Matrics } from "../../styles";
import BackNavigation from "../back-navigation";

export const Header = (navigation, title, step, backNav) => {
  return {
    headerTitle:
      title === "logo" ? (
        <View style={{ flex: 1, alignItems: "center" }}>
          <Image
            source={Images.welcomeLogo}
            style={{
              width: 210,
              height: 40
            }}
            resizeMode={"contain"}
          />
        </View>
      ) : (
        <Text style={ApplicationStyles.headerTitleStyle}>{title}</Text>
      ),
    headerTitleStyle: ApplicationStyles.headerTitleStyle,
    headerLeft: backNav ? BackNavigation(navigation, backNav) : <View />,
    headerRight: step ? (
      <TouchableOpacity
        style={ApplicationStyles.stepView}
        activeOpacity={1}
        onPress={() => navigation.navigate("Invite")}
      >
        <MIcon name={"person-add"} size={22} color={Color.black30} />
      </TouchableOpacity>
    ) : (
      <View />
    ),
    headerStyle: ApplicationStyles.headerStyle
  };
};

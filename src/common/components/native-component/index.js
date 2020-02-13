import React, { Component } from "react";
import {
  Text,
  View,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback
} from "react-native";
import { Color } from "../../styles";

export default class NativeComponent extends Component {
  render() {
    if (Platform.OS === "android") {
      return (
        <TouchableNativeFeedback
          {...this.props}
          useForeground={false}
          background={TouchableNativeFeedback.Ripple(Color.darkRed10, false)}
          delayPressIn={0}
        />
      );
    }
    return <TouchableOpacity {...this.props} />;
  }
}

import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
  AsyncStorage
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StackActions, NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import {
  Button,
  TextInputField,
  ActionModal,
  LoadWheel,
  TextInputView
} from "../../components/index";
import { Color, Images, Matrics, Fonts, ApplicationStyles } from "./index";
import Global from "../../../global";
import styles from "./styles";

class AuthHeader extends Component {
  render() {
    const { tab, onPress, selectedTab, title } = this.props;
    return (
      <View style={styles.signInView}>
        <View style={styles.signInTextView}>
          <Text style={styles.signInText}>{title}</Text>
        </View>
        <View style={styles.tabView}>
          {tab &&
            tab.map((res, index) => (
              <View style={styles.tabTouchView} key={res}>
                <TouchableOpacity
                  style={[
                    styles.touchopacityBorder,
                    selectedTab === index && styles.activeBorder
                  ]}
                  onPress={() => onPress(index)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      selectedTab === index && styles.selectedTab
                    ]}
                  >
                    {res}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      </View>
    );
  }
}
export default AuthHeader;

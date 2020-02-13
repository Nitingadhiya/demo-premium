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
} from "../index";
import {
  Color,
  Images,
  Matrics,
  Fonts,
  ApplicationStyles
} from "../../../common/styles";
// import { loginRequest } from '../Redux/actions'
import Global from "../../../global";
import Styles from "./styles";

class InfoHeader extends Component {
  skipStep = (skip, skipStep) => {
    if (skip) {
      return (
        <Text style={Styles.skipText} onPress={skipStep}>
          Skip
        </Text>
      );
    }
  };

  render() {
    const {
      title,
      currentStep,
      totalStep,
      navigation,
      skipStep,
      skip
    } = this.props;
    return (
      <View style={Styles.signInView}>
        <View style={Styles.headerView}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image source={Images.back} />
          </TouchableOpacity>
          <Text style={Styles.stepText}>
            Step {currentStep} / {totalStep}
          </Text>
        </View>
        <View style={Styles.signInTextView}>
          <Text style={Styles.signInText}>{title}</Text>
          {this.skipStep(skip, skipStep)}
        </View>
      </View>
    );
  }
}
export default InfoHeader;
